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
  const [standardDeckCards, setStandardDeckCards] = useState<DeckCard[]>([]);
  const [legacyDeckCards, setLegacyDeckCards] = useState<DeckCard[]>([]);

  const standardCardsImport = api.cards.getStandard.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setStandardDeckCards(data.map(convertCardToDeckCard));
    },
  });

  const legacyCardsImport = api.cards.getLegacy.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setLegacyDeckCards(data.map(convertCardToDeckCard));
    },
  });

  const isFetching =
    standardCardsImport.isLoading || legacyCardsImport.isLoading;

  const cardPoolList = {
    standard: standardDeckCards,
    legacy: legacyDeckCards,
  };

  const [cardPool, setCardPool] = useState(cardPoolList.standard);

  // using this to re-render when cards are fetched
  useEffect(() => {
    setCardPool(cardPoolList.standard);
  }, [standardDeckCards]);

  return {
    cardPool,
    setCardPool,
    cardPoolList,
    isFetching,
  };
};
