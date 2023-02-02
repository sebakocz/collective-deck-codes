import { z } from "zod";

import {
  AffinityToPrismaConverter,
  RarityToPrismaConverter,
  TypeToPrismaConverter,
} from "@/utils/prismaConverter";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const cardsRouter = createTRPCRouter({
  getPool: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      switch (input.name) {
        case "Standard":
          const x = new Date();
          x.setDate(27);
          x.setMonth(x.getMonth() - 1);

          return ctx.prisma.card.findMany({
            where: {
              release: {
                lt: x,
              },
              pools: {
                some: {
                  name: "Standard",
                },
              },
            },
            include: {
              pools: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: [
              {
                cost: "asc",
              },
              {
                name: "asc",
              },
            ],
          });
        default:
          return ctx.prisma.card.findMany({
            where: {
              pools: {
                some: {
                  name: input.name,
                },
              },
            },
            include: {
              pools: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: [
              {
                cost: "asc",
              },
              {
                name: "asc",
              },
            ],
          });
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        card: z.object({
          id: z.string(),
          name: z.string(),
          cost: z.number(),
          affinity: z.string(),
          rarity: z.string(),
          type: z.string(),
          atk: z.number().nullish(),
          hp: z.number().nullish(),
          exclusive: z.boolean(),
          link: z.string(),
          image: z.string(),
          ability: z.string().nullish(),
          creator: z.string().nullish(),
          artist: z.string().nullish(),
          tribe: z.string().nullish(),
          realm: z.string().nullish(),
          week: z.string().nullish(),
          pools: z.array(z.string()),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.create({
        data: {
          ...input.card,
          type: TypeToPrismaConverter(input.card.type),
          affinity: AffinityToPrismaConverter(input.card.affinity),
          rarity: RarityToPrismaConverter(input.card.rarity),
          release: new Date(),
          pools: {
            connect: input.card.pools.map((x) => {
              return { name: x };
            }),
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.card.findMany({
      include: {
        pools: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        {
          cost: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }),
});
