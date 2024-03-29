import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/server/db";

const deleteall = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ACTION_KEY_DELETE_ALL_CARDS } = process.env;
  const ACTION_KEY_DELETE_ALL_CARDS_INPUT =
    req.headers?.authorization?.split(" ")[1] || "";

  try {
    if (ACTION_KEY_DELETE_ALL_CARDS_INPUT === ACTION_KEY_DELETE_ALL_CARDS) {
      await prisma.card.deleteMany();

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

export default deleteall;
