import { createRouter } from "./context";
import { z } from "zod";
import {TRPCError} from "@trpc/server";

export const decksRouter = createRouter()
    .query("getAllBySession", {
        resolve({ ctx }) {
            if (!ctx.session?.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
            return ctx.prisma.deck.findMany({
                where: {
                    user: {
                        email: ctx.session.user.email,
                    },
                },
                include: {
                    cards: {
                        include: {
                            card: true,
                        },
                        orderBy: {
                            affinityBasedCost: "asc",
                        }
                    },
                    hero: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                }
            });
        }
    })

    .query("getAll", {
        resolve({ ctx }) {
            return ctx.prisma.deck.findMany({
                include: {
                    cards: {
                        include: {
                            card: true,
                        }
                    },
                    hero: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                }
            });
        }
    })

    .mutation("save", {
        input: z
            .object({
                userEmail: z.string(),
                name: z.string(),
                heroId: z.number(),
                cards: z.array(z.object({
                    cardId: z.string(),
                    count: z.number(),
                    affinityBasedCost: z.number()
                })),
                frontCard: z.string().nullish()
            }),
        resolve({ ctx, input }) {

            return ctx.prisma.deck.create({
                data: {
                    user: {
                        connect: {
                            email: input.userEmail
                        }
                    },
                    name: input.name,
                    hero: input.heroId ? { connect: { id: input.heroId } } : {},
                    cards:
                        {
                            create: input.cards.map(c => ({
                                card: {
                                    connect: {
                                        id: c.cardId
                                    }
                                },
                                count: c.count,
                                affinityBasedCost: c.affinityBasedCost
                            }))
                        },
                    frontCard: input.frontCard || ""
                    }
                }
            )
        }
    })

    .query("getById", {
        input: z.object({
            id: z.string()
        }),
        resolve({ ctx, input }) {
            return ctx.prisma.deck.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    cards: {
                        include: {
                            card: true,
                        },
                        orderBy: [
                            {
                                affinityBasedCost: "asc",
                            }
                        ]
                    },
                    hero: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                }
            });
        }
    })

    .mutation("deleteById", {
        input: z.object({
            id: z.string()
        }),
        resolve({ ctx, input }) {
            if (!ctx.session?.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const deleteDeckCards = ctx.prisma.cardsOnDecks.deleteMany({
                where: {
                    deckId: input.id,
                }
            })

            const deleteDeck = ctx.prisma.deck.deleteMany({
                where: {
                    id: input.id,
                    user: {
                        email: ctx.session.user.email,
                    }
                }
            })

            return ctx.prisma.$transaction([deleteDeckCards, deleteDeck])
        }
    })
