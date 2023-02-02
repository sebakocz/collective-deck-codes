import type { Card } from "@prisma/client";
import { useEffect, useState } from "react";

import type { DeckCard } from "@/lib/types";
import { api } from "@/utils/api";

const convertCardToDeckCard = (card: Card) => {
  return {
    card: card,
    count: 1,
    affinityPenalty: false,
  } as DeckCard;
};

export const useCardpool = () => {
  const [currentDeckCards, setCurrentDeckCards] = useState<DeckCard[]>([]);
  const [poolName, setPoolName] = useState("Standard");

  const cardPoolQuery = api.cards.getPool.useQuery(
    { name: poolName },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
        setCurrentDeckCards(data.map(convertCardToDeckCard));
      },
    }
  );

  useEffect(() => {
    setCurrentDeckCards([]);
  }, [poolName]);

  return {
    cardPoolQuery,
    currentDeckCards,
    setPoolName,
  };
};
