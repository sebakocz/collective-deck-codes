import { createRouter } from "./context";
import { z } from "zod";
import {
    AffinityToPrismaConverter,
    RarityToPrismaConverter,
    StateToPrismaConverter,
    TypeToPrismaConverter
} from "../../utils/collactiveapi";

export const cardsRouter = createRouter()
    .query("getLegacy", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                where: {
                   pools: {
                          some: {
                                name: "Legacy"
                          }
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
                    pools: {
                        some: {
                            name: "Standard"
                        }
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

    // .query("getNewStandard", {
    //     resolve({ ctx}) {
    //         return ctx.prisma.card.findMany({
    //             where: {
    //                 pools: {
    //                     hasSome: [8]
    //                 }
    //             },
    //             orderBy: [
    //                 {
    //                     cost: "asc",
    //                 },
    //                 {
    //                     name: "asc",
    //                 }
    //             ]
    //         })
    //     }
    // })

    .query("getCustom", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                where: {
                    // custom state is 9
                    state: 9
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
                state: z.number().nullish(),
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
       async resolve ({ ctx, input }) {
            const pools = await StateToPrismaConverter(input.card.state || 9)
            return ctx.prisma.card.create({
                data: {
                    ...input.card,
                    type: TypeToPrismaConverter(input.card.type),
                    affinity: AffinityToPrismaConverter(input.card.affinity),
                    rarity: RarityToPrismaConverter(input.card.rarity),
                    release: new Date(),
                    pools: {
                        connect: pools.map((pool: any) => {
                            return {id: pool.id}
                        })
                    }
                }
            })
        }
    })