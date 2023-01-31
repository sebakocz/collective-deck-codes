import type { Affinity } from "@prisma/client";
import { useEffect, useState } from "react";

import { hasAffinityPenalty } from "@/lib/utils";

import type { DeckCard } from "../types";

export const sortCards = (cards: DeckCard[]) => {
  return cards
    .sort(
      (a, b) =>
        a.card?.name.localeCompare(b.card?.name || "", undefined, {
          numeric: true,
        }) || 0
    )
    .sort(
      (a, b) =>
        a.card.cost +
        (a.affinityPenalty ? 1 : 0) -
        (b.card.cost + (b.affinityPenalty ? 1 : 0))
    );
};

export function useDeckCards() {
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);

  useEffect(() => {
    setDeckCards(sortCards(deckCards));
  }, [deckCards]);

  const addCardsToDeck = (cards: DeckCard[]) => {
    const new_deckCards: DeckCard[] = [];

    for (const neckDeckCard of cards) {
      // check if card already exists in deck
      const deckSlot = deckCards.find(
        (existingDeckCard) => existingDeckCard.card?.id == neckDeckCard.card?.id
      );

      // if it does, add to count
      if (typeof deckSlot !== "undefined") {
        // check if adding the card would exceed the max count
        if (deckSlot.count + neckDeckCard.count > 3) {
          deckSlot.count = 3;
          continue;
        }
        deckSlot.count += neckDeckCard.count;
      }
      // if it doesn't, add to deck
      else {
        new_deckCards.push(neckDeckCard);
      }
    }

    setDeckCards(sortCards([...deckCards, ...new_deckCards]));
  };

  const removeCardFromDeck = (card: DeckCard) => {
    const new_deck = deckCards.filter((c) => {
      if (c.card?.id == card.card?.id) {
        c.count--;
        return c.count > 0;
      }
      return true;
    });
    setDeckCards(new_deck);
  };

  const adjustAffinityPenalty = (heroAffinity: Affinity | null) => {
    const newCardPool = deckCards.map((card) => ({
      ...card,
      affinityPenalty: hasAffinityPenalty(card.card.affinity, heroAffinity),
    }));

    setDeckCards(sortCards(newCardPool));
  };

  return {
    deckCards,
    setDeckCards,
    addCardsToDeck,
    removeCardFromDeck,
    adjustAffinityPenalty,
  };
}
