import { createRouter } from "./context";
import { z } from "zod";

export const herosRouter = createRouter()
    .query("getAll", {
        resolve({ ctx}) {
            return ctx.prisma.hero.findMany({
                orderBy: [
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })
