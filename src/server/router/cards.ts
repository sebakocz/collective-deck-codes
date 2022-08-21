import { createRouter } from "./context";
import { z } from "zod";
import {AffinityToPrismaConverter, RarityToPrismaConverter, TypeToPrismaConverter} from "../../utils/collactiveapi";

export const cardsRouter = createRouter()
    .query("getLegacy", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                where: {
                   state: {
                       in: [0,2]
                   }
                },
                orderBy: [
                    {
                        cost: "asc",
                    },
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })
    .query("getStandard", {
        resolve({ ctx}) {
            let x = new Date();
            x.setDate(27);
            x.setMonth(x.getMonth()-1);

            return ctx.prisma.card.findMany({
                where: {
                    release: {
                        lt: x
                    },
                    state: 0
                },
                orderBy: [
                    {
                        cost: "asc",
                    },
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })

    .query("getNewStandard", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                where: {
                    pools: {
                        hasSome: [8]
                    }
                },
                orderBy: [
                    {
                        cost: "asc",
                    },
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })


    .query("getCustom", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                where: {
                    // custom state is 9
                    pools:
                        {
                            hasEvery: [9]
                        }
                    },
                orderBy: [
                    {
                        cost: "asc",
                        },
                    {
                        name: "asc",
                    }
                        ]
            })
        }
    })

    .query("getFew", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                take: 40
            })
        }
    })

    .mutation("create", {
        input: z.object({
            card: z.object({
                id: z.string(),
                name: z.string(),
                cost: z.number(),
                affinity: z.string(),
                rarity: z.string(),
                type: z.string(),
                atk: z.number().nullish(),
                hp: z.number().nullish(),
                state: z.number(),
                exclusive: z.boolean(),
                link: z.string(),
                image: z.string(),
                ability: z.string().nullish(),
                creator: z.string().nullish(),
                artist: z.string().nullish(),
                tribe: z.string().nullish(),
                realm: z.string().nullish(),
                week: z.string().nullish(),
            })
        }),
        resolve({ ctx, input }) {
            return ctx.prisma.card.create({
                data: {
                    ...input.card,
                    type: TypeToPrismaConverter(input.card.type),
                    affinity: AffinityToPrismaConverter(input.card.affinity),
                    rarity: RarityToPrismaConverter(input.card.rarity),
                    release: new Date(),
                }
            })
        }
    })