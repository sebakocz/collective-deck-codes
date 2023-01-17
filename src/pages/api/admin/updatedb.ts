
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../../server/db/client";
import {Prisma} from "@prisma/client"
import {
    AffinityToPrismaConverter,
    findProperty,
    getPublicCards,
    getSingleCard, RarityToPrismaConverter,
    TypeToPrismaConverter
} from "../../../utils/collactiveapi";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
    maxConcurrent: 50,
    minTime: 100
});

limiter.on("done", (info) => {
    console.log(info.options.id, "finished");
});

const updatedb = async (req: NextApiRequest, res: NextApiResponse) => {

    // previous version of this function - admin only
    // const session = await getServerSession(req, res, nextAuthOptions);
    //
    // if (!session?.user?.email) {
    //     res.send({
    //         error: "You must be sign in to view the protected content on this page.",
    //     })
    //     return
    // }
    //
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email: session.user?.email
    //     }
    // })
    //
    // if(user?.role != Role.ADMIN) {
    //     res.send({
    //         error: "Not authorized."
    //     })
    // }

    // new version of this function - bearer token

    const { ACTION_KEY_DB_UPDATE } = process.env;

    const ACTION_KEY_DB_UPDATE_INPUT = req.headers?.authorization?.split(" ")[1] || "";

    try {
        if (ACTION_KEY_DB_UPDATE_INPUT === ACTION_KEY_DB_UPDATE) {
            // Process the POST request

            // save a giant card list, then delete all table items and fill with new list
            let new_card_list: any = []
            const public_cards = await getPublicCards()

            const card_ids = public_cards.map((card: any) => card.uid)
            const cards_data = await Promise.all(card_ids.map(async (card_id: string, index: number) => {
                return await limiter.schedule({id: card_id+"---"+index+"/"+card_ids.length}, async () => {
                    return await getSingleCard(card_id)
                })
            }))

            for (let public_index=0;public_index<public_cards.length;public_index++){
                const card_id = public_cards[public_index].uid
                // const card_api: any = await getSingleCard(card_id)
                const card_api: any = cards_data[public_index]
                console.log("Processing: "+card_api.card.name)
                const atk = findProperty(card_api.card.Text.Properties, 'ATK').Expression.Value
                const hp = findProperty(card_api.card.Text.Properties, 'HP').Expression.Value
                const new_card: Prisma.CardCreateManyInput = {
                    id:         card_id,
                    name:       card_api.card.name,
                    type:       TypeToPrismaConverter(card_api.card.Text.ObjectType),
                    affinity:   AffinityToPrismaConverter(card_api.card.Text.Affinity),
                    // ?? -> default values - in case something is broken in the json
                    exclusive:  card_api.card.Text.AffinityExclusive ?? false,
                    rarity:     RarityToPrismaConverter(card_api.card.Text.Rarity),
                    cost:       parseInt(findProperty(card_api.card.Text.Properties, 'IGOCost').Expression.Value),
                    atk:        isNaN(parseInt(atk)) ? null : parseInt(atk),
                    hp:         isNaN(parseInt(hp)) ? null : parseInt(hp),
                    ability:    public_cards[public_index].static_text,
                    creator:    findProperty(card_api.card.Text.Properties, 'CreatorName').Expression.Value,
                    artist:     findProperty(card_api.card.Text.Properties, 'ArtistName').Expression.Value,
                    tribe:      findProperty(card_api.card.Text.Properties, 'TribalType').Expression.Value,
                    realm:      public_cards[public_index].realm,
                    link:       public_cards[public_index].imgurl || "",
                    // if you really need this consider converting to unix timestamps
                    // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
                    release:    new Date(card_api.card.dtReleased).toISOString(),
                    image:      findProperty(card_api.card.Text.Properties, 'PortraitUrl').Expression.Value,
                    state:      public_cards[public_index].approval_state ?? 9,
                }

                new_card_list.push(new_card)
            }

            await prisma.$transaction([
                prisma.card.deleteMany({}),
                prisma.card.createMany({
                    data: new_card_list
                }),
                // update pools
                prisma.pool.update({
                    where: {
                        name: "Standard"
                    },
                    data: {
                        cards: {
                            connect: new_card_list.filter((card: Prisma.CardCreateInput) => card.state == 0).map((card: Prisma.CardCreateInput) => ({id: card.id}))
                        }
                    }
                }),
                prisma.pool.update({
                    where: {
                        name: "Legacy"
                    },
                    data: {
                        cards: {
                            connect: new_card_list.filter((card: Prisma.CardCreateInput) => card.state == 0 || card.state == 2).map((card: Prisma.CardCreateInput) => ({id: card.id}))
                        }
                    }
                }),
                // update decks using cardIdHistory, this is the longest part of the process, consider optimizing
                ...new_card_list.map((card: Prisma.CardCreateInput) => prisma.cardsOnDecks.updateMany({
                    where: {
                        cardIdHistory: card.id
                    },
                    data: {
                        cardId: card.id
                    }
                }))
            ])

            console.log("FINISHED: Cards updated.")

            res.status(200).json({ success: 'true' })
            return
        } else {
            res.status(401)
        }

        res.status(500).json({ error: "Access Denied" })
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: "Access Denied. Check Logs." })
    }
};

export default updatedb;
