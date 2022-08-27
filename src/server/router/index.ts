// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import {merge} from "next-auth/utils/merge";
import {cardsRouter} from "./cards";
import {herosRouter} from "./heros";
import {decksRouter} from "./decks";
import {likesRouter} from "./likes";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("example.", exampleRouter)
    .merge("auth.", authRouter)
    .merge("cards.", cardsRouter)
    .merge("heros.", herosRouter)
    .merge("decks.", decksRouter)
    .merge("likes.", likesRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
