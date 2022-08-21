
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../../../server/db/client";
import {Prisma, Role, Affinity, Rarity, Type, Card} from "@prisma/client"
import {
    AffinityToPrismaConverter,
    findProperty, getCustomCardById,
    getPublicCards,
    getSingleCard, RarityToPrismaConverter,
    TypeToPrismaConverter
} from "../../../../utils/collactiveapi";


const clearcustompool = async (req: NextApiRequest, res: NextApiResponse) => {


    const { ACTION_KEY_DELETE_ALL_CARDS } = process.env;
    const ACTION_KEY_DELETE_ALL_CARDS_INPUT = req.headers?.authorization?.split(" ")[1] || "";

    try {
        if (ACTION_KEY_DELETE_ALL_CARDS_INPUT === ACTION_KEY_DELETE_ALL_CARDS) {

            const cards = await prisma.card.findMany({
                where: {
                    //@ts-ignore
                    pools: {
                        hasSome: [8]
                    }
                }
            })

            for (const card of cards) {
                await prisma.card.update({
                    where: {
                        id: card.id
                    },
                    data: {
                        //@ts-ignore
                        pools: {
                           //@ts-ignore
                           set: card.pools.filter((state: number) => state !== 8)
                        }
                    }
                })
            }

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

export default clearcustompool;
