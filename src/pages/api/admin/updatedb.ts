import type { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/server/db";
import { getPublicCardsAsCards } from "@/utils/collactiveapi";

const isDev = process.env.NODE_ENV === "development";

const updatedb = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ACTION_KEY_DB_UPDATE } = process.env;

  const ACTION_KEY_DB_UPDATE_INPUT =
    req.headers?.authorization?.split(" ")[1] || "";

  try {
    if (ACTION_KEY_DB_UPDATE_INPUT === ACTION_KEY_DB_UPDATE || isDev) {
      // Process the POST request

      // save a giant card list, then delete all table items and fill with new list
      const new_card_list =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (await getPublicCardsAsCards()) as Prisma.CardCreateInput[];

      await prisma.$transaction([
        prisma.card.deleteMany({}),
        prisma.card.createMany({
          data: new_card_list,
        }),
        // update pools
        prisma.pool.update({
          where: {
            name: "Standard",
          },
          data: {
            cards: {
              connect: new_card_list
                .filter((card: Prisma.CardCreateInput) => card.state == 0)
                .map((card: Prisma.CardCreateInput) => ({ id: card.id })),
            },
          },
        }),
        prisma.pool.update({
          where: {
            name: "Legacy",
          },
          data: {
            cards: {
              connect: new_card_list
                .filter(
                  (card: Prisma.CardCreateInput) =>
                    card.state == 0 || card.state == 2
                )
                .map((card: Prisma.CardCreateInput) => ({ id: card.id })),
            },
          },
        }),
        // update decks using cardIdHistory, this is the longest part of the process, consider optimizing
        ...new_card_list.map((card: Prisma.CardCreateInput) =>
          prisma.cardsOnDecks.updateMany({
            where: {
              cardIdHistory: card.id,
            },
            data: {
              cardId: card.id,
            },
          })
        ),
      ]);

      console.log("FINISHED: Cards updated.");

      res.status(200).json({ success: "true" });
      return;
    } else {
      res.status(401);
    }

    res.status(500).json({ error: "Access Denied" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Access Denied. Check Logs." });
  }
};

export default updatedb;
