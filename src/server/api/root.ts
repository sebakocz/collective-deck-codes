import { cardsRouter } from "./routers/cards";
import { decksRouter } from "./routers/decks";
import { herosRouter } from "./routers/heros";
import { likesRouter } from "./routers/likes";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  cards: cardsRouter,
  decks: decksRouter,
  likes: likesRouter,
  heros: herosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
