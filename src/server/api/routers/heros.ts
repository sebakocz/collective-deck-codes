import { createTRPCRouter, publicProcedure } from "../trpc";

export const herosRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hero.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
});
