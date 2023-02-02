import { Format } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { FormatToPrismaConverter } from "@/utils/prismaConverter";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const decksRouter = createTRPCRouter({
  getAllBySession: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.deck.findMany({
      where: {
        user: {
          id: ctx.session.user.id,
        },
      },
      include: {
        cards: {
          include: {
            card: true,
          },
        },
        hero: true,
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            favouritedBy: true,
          },
        },
      },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.deck.findMany({
      include: {
        cards: {
          include: {
            card: true,
          },
        },
        hero: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().max(100),
        heroId: z.number(),
        description: z.string().max(1000),
        // TODO: how about this implementation?
        // format: z.enum(FormatToPrismaConverter).optional(),
        format: z.string().max(100),
        cards: z
          .array(
            z.object({
              cardId: z.string(),
              count: z.number(),
              affinityPenalty: z.boolean(),
            })
          )
          .max(100),
        frontCard: z.string().nullish(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if user owns deck
      const deck = await ctx.prisma.deck.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!deck) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to edit this deck",
        });
      }

      // delete all cards
      const clearCardsFromDeck = ctx.prisma.cardsOnDecks.deleteMany({
        where: {
          deckId: input.id,
        },
      });

      // update the deck
      const updateDeck = ctx.prisma.deck.update({
        where: {
          id: deck.id,
        },
        data: {
          name: input.name,
          hero: input.heroId ? { connect: { id: input.heroId } } : {},
          cards: {
            create: input.cards.map((c) => ({
              card: {
                connect: {
                  id: c.cardId,
                },
              },
              cardIdHistory: c.cardId,
              count: c.count,
              affinityPenalty: c.affinityPenalty,
            })),
          },
          frontCard: input.frontCard || "",
          description: input.description || "",
          format: FormatToPrismaConverter(input.format),
        },
      });

      return ctx.prisma.$transaction([clearCardsFromDeck, updateDeck]);
    }),

  save: protectedProcedure
    .input(
      z.object({
        name: z.string().max(100),
        heroId: z.number(),
        description: z.string().max(1000),
        format: z.string().max(100),
        cards: z
          .array(
            z.object({
              cardId: z.string(),
              count: z.number(),
              affinityPenalty: z.boolean(),
            })
          )
          .max(100),
        frontCard: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // max 10 decks per user
      const decks = await ctx.prisma.deck.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (decks.length >= 10) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only have 10 decks",
        });
      }

      return ctx.prisma.deck.create({
        data: {
          user: {
            connect: {
              id: ctx.session?.user.id,
            },
          },
          name: input.name,
          hero: input.heroId ? { connect: { id: input.heroId } } : {},
          cards: {
            create: input.cards.map((c) => ({
              card: {
                connect: {
                  id: c.cardId,
                },
              },
              cardIdHistory: c.cardId,
              count: c.count,
              affinityPenalty: c.affinityPenalty,
            })),
          },
          frontCard: input.frontCard || "",
          description: input.description || "",
          format: FormatToPrismaConverter(input.format),
        },
      });
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.deck.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cards: {
            include: {
              card: {
                include: {
                  pools: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          hero: true,
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              favouritedBy: true,
            },
          },
        },
      });
    }),

  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deck = await ctx.prisma.deck.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!deck) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this deck",
        });
      }

      const deleteDeckCards = ctx.prisma.cardsOnDecks.deleteMany({
        where: {
          deckId: input.id,
        },
      });

      const deleteFavourites = ctx.prisma.favouriteDecksOnUsers.deleteMany({
        where: {
          deckId: input.id,
        },
      });

      const deleteDeck = ctx.prisma.deck.delete({
        where: {
          id: input.id,
        },
      });

      return ctx.prisma.$transaction([
        deleteDeckCards,
        deleteFavourites,
        deleteDeck,
      ]);
    }),

  getTopX: publicProcedure
    .input(
      z.object({
        count: z.number().min(1).max(100).optional(),
        format: z.nativeEnum(Format).optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.deck.findMany({
        include: {
          hero: true,
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              favouritedBy: true,
            },
          },
        },
        where: {
          format: input.format,
        },
        take: input.count,
        orderBy: {
          favouritedBy: {
            _count: "desc",
          },
        },
      });
    }),
});
