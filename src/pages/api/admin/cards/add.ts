
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../../../server/db/client";
import {Prisma, Card} from "@prisma/client"
import {
    getCustomCardById,
    getPublicCards,
    StateToPrismaConverter,
} from "../../../../utils/collactiveapi";


const add = async (req: NextApiRequest, res: NextApiResponse) => {


    const { ACTION_KEY_ADD_CARD } = process.env;

    const ACTION_KEY_ADD_CARD_INPUT = req.headers?.authorization?.split(" ")[1] || "";
    const {cards} = req.body;
    const {state} = req.body;

    try {
        if (ACTION_KEY_ADD_CARD_INPUT === ACTION_KEY_ADD_CARD && cards.length > 0) {

            const public_cards = await getPublicCards()
            let new_card_list: Card[] = []

            console.log("Adding Custom Cards:")
            for (const card of cards) {

                console.log(card)

                // return if no input provided
                if (!card.id || !state){
                    res.status(400).json({
                        message: "No card id and/or state provided"
                    })
                    return
                }

                let new_card = public_cards.find((public_card: any) => public_card.rarity != 'Undraftable' && public_card.name.trim() === card.id)

                let card_data
                if(new_card) {
                    // save id for fetching
                    card_data = await getCustomCardById(new_card.uid, state)
                }
                else {
                    const card_id = /([a-z]|[0-9]){8}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){12}/.exec(card.id)![0]
                    // use id for fetching
                    card_data = await getCustomCardById(card_id || "", state)
                }

                if(card_data) {
                    console.log(`Adding ${card_data.name}`)
                    new_card_list.push(card_data)
                }
            }

            console.log("New Card List:")
            console.log(new_card_list)
            const pools = await StateToPrismaConverter(state)
            await prisma.$transaction(
                new_card_list.map((card: Prisma.CardCreateInput) => prisma.card.upsert({
                        where: {
                            id: card.id
                        },
                        update: {
                            ...card,
                            pools: {
                                connect: pools.map((pool: any) => {
                                    return {id: pool.id}
                                })
                            }
                        },
                        create: card
                    }
                )))

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

export default add;
