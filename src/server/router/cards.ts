import { createRouter } from "./context";
import { z } from "zod";

export const cardsRouter = createRouter()
    .query("getLegacy", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                orderBy: [
                    {
                        cost: "asc",
                    },
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })
    .query("getStandard", {
        resolve({ ctx}) {
            let x = new Date();
            x.setDate(27);
            x.setMonth(x.getMonth()-1);

            return ctx.prisma.card.findMany({
                where: {
                    release: {
                        lt: x
                    },
                    state: 0
                },
                orderBy: [
                    {
                        cost: "asc",
                    },
                    {
                        name: "asc",
                    }
                ]
            })
        }
    })
    .query("getFew", {
        resolve({ ctx}) {
            return ctx.prisma.card.findMany({
                take: 40
            })
        }
    })