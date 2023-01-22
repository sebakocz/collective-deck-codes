import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const likesRouter = createTRPCRouter({
  count: protectedProcedure
    .input(z.object({ deckId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.favouriteDecksOnUsers.count({
        where: {
          deckId: input.deckId,
        },
      });
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        deckId: z.string(),
        isLiked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.isLiked) {
        return ctx.prisma.favouriteDecksOnUsers.create({
          data: {
            deckId: input.deckId,
            userId: ctx.session.user.id,
          },
        });
      } else {
        return ctx.prisma.favouriteDecksOnUsers.delete({
          where: {
            userId_deckId: {
              userId: ctx.session.user.id,
              deckId: input.deckId,
            },
          },
        });
      }
    }),

  isMine: protectedProcedure
    .input(z.object({ deckId: z.string() }))
    .query(async ({ ctx, input }) => {
      const isMineObj = await ctx.prisma.favouriteDecksOnUsers.findFirst({
        where: {
          deckId: input.deckId,
          userId: ctx.session.user.id,
        },
      });
      return isMineObj !== null;
    }),
});
