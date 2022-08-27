import {createRouter} from "./context";
import {z} from "zod";
import {TRPCError} from "@trpc/server";

export const likesRouter = createRouter()
    .query("count", {
        input: z.object({
            deckId: z.string(),
        }),
        resolve: async ({ ctx: { prisma }, input }) => {
            const count = await prisma.favouriteDecksOnUsers.count({
                where: {
                    deckId: input.deckId,
                },
            });
            return {
                count,
            };
        }
    })
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    })
    .mutation("toggle", {
        input: z.object({
            deckId: z.string(),
            isLiked: z.boolean(),
        }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            if (input.isLiked) {
                await prisma.favouriteDecksOnUsers.create({
                    data: {
                        deckId: input.deckId,
                        userId: session?.user?.id!,
                    },
                });
            } else {
                await prisma.favouriteDecksOnUsers.delete({
                    where: {
                        userId_deckId: {
                            userId: session?.user?.id!,
                            deckId: input.deckId,
                        }
                    }
                });
            }
            return {
                message: "OK",
            };
        },
    })
    .query("isMine", {
        input: z.object({
            deckId: z.string()
        }),
        resolve: async ({ ctx: { prisma, session }, input }) => {
            const isMineObj = await prisma.favouriteDecksOnUsers.findUnique({
                where: {
                    userId_deckId: {
                        userId: session?.user?.id!,
                        deckId: input.deckId
                    }
                },
            });

            const isMine = Boolean(isMineObj)

            return {
                isMine,
            };
        }
    })