
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import {prisma} from "../../../server/db/client";
import {Prisma, Role, Affinity, Rarity, Type} from "@prisma/client"
import {
    AffinityToPrismaConverter,
    findProperty,
    getPublicCards,
    getSingleCard, RarityToPrismaConverter,
    TypeToPrismaConverter
} from "../../../utils/collactiveapi";


const updatedb = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session?.user?.email) {
        res.send({
            error: "You must be sign in to view the protected content on this page.",
        })
        return
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email
        }
    })

    if(user?.role != Role.ADMIN) {
        res.send({
            error: "Not authorized."
        })
    }


    // save a giant card list, then delete all table items and fill with new list
    let new_card_list: any = []
    const public_cards = await getPublicCards()

    // ?? default values - in case something is broken in the json
    for (let public_index=0;public_index<public_cards.length;public_index++){
        const card_id = public_cards[public_index].uid
        const card_api: any = await getSingleCard(card_id)
        console.log("Processing: "+card_api.card.name)
        const atk = findProperty(card_api.card.Text.Properties, 'ATK').Expression.Value
        const hp = findProperty(card_api.card.Text.Properties, 'HP').Expression.Value
        const new_card: Prisma.CardCreateInput = {
            id:         card_id,
            name:       card_api.card.name,
            type:       TypeToPrismaConverter(card_api.card.Text.ObjectType),
            affinity:   AffinityToPrismaConverter(card_api.card.Text.Affinity),
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
            link:       public_cards[public_index].imgurl,
            // if you really need this consider converting to unix timestamps
            // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
            release:    new Date(card_api.card.dtReleased).toISOString(),
            week:       card_api.card.releaseGroup,
            image:      findProperty(card_api.card.Text.Properties, 'PortraitUrl').Expression.Value,
            state:      public_cards[public_index].approval_state
        }

        new_card_list.push(new_card)
    }

    await prisma.card.deleteMany()

    await prisma.card.createMany({
        data: new_card_list
    })

    res.send({
        "success": "Job is done."
    })
};

export default updatedb;
