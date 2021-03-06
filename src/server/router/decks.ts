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

    .mutation("update", {
        input: z
            .object({
                userEmail: z.string(),
                name: z.string().max(100),
                heroId: z.number(),
                description: z.string().max(1000),
                cards: z.array(z.object({
                    cardId: z.string(),
                    count: z.number(),
                    affinityBasedCost: z.number()
                })).max(100),
                frontCard: z.string().nullish(),
                id: z.string(),
            }),
        async resolve({ ctx, input }) {

            // is this user's deck?
            const deck = await ctx.prisma.deck.findFirst({
                where: {
                    id: input.id,
                    user: {
                        email: input.userEmail,
                    }
                }
            })

            if (!deck) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            // clear out the cards
            const clearCardsFromDeck = ctx.prisma.cardsOnDecks.deleteMany({
                where: {
                    deckId: input.id,
                }
            })

            // update
            const updateDeck = ctx.prisma.deck.update({
                where: {
                    id: deck.id
                },
                data: {
                    name: input.name,
                    hero: input.heroId ? { connect: { id: input.heroId } } : {},
                    cards: {
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
                    frontCard: input.frontCard || "",
                    description: input.description || ""
                }
            }
            )

            return ctx.prisma.$transaction([clearCardsFromDeck, updateDeck])
        }
    })


    .mutation("save", {
        input: z
            .object({
                userEmail: z.string(),
                name: z.string().max(100),
                heroId: z.number(),
                description: z.string().max(1000),
                cards: z.array(z.object({
                    cardId: z.string(),
                    count: z.number(),
                    affinityBasedCost: z.number()
                })).max(100),
                frontCard: z.string().nullish()
            }),
        async resolve({ ctx, input }) {

            // max 10 decks per user
            const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: input.userEmail,
                    },
                    include: {
                        decks: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            )

            if (!user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            if (user.decks.length >= 10) {
                throw new TRPCError({code:"CONFLICT"} )
            }

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
                    frontCard: input.frontCard || "",
                    description: input.description || ""
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
