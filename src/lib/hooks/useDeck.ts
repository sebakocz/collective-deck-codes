import { Format } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useCardpool } from "@/lib/hooks/useCardpool";
import { useDeckCards } from "@/lib/hooks/useDeckCards";
import useHero from "@/lib/hooks/useHero";
import { api } from "@/utils/api";

export function useDeck() {
  const [deckDescription, setDeckDescription] = useState("");
  const [deckName, setDeckName] = useState("");
  const [deckId, setDeckId] = useState("");
  const [format, setFormat] = useState<Format>(Format.STANDARD);
  const { hero, setHero, setHeroByName, heroList } = useHero();
  const {
    deckCards,
    setDeckCards,
    addCardsToDeck,
    removeCardFromDeck,
    adjustAffinityPenalty,
  } = useDeckCards();
  const [frontCardUrl, setFrontCardUrl] = useState("");
  const router = useRouter();

  const saveDeckMutation = api.decks.save.useMutation({
    onSuccess: async (deckReponse) => {
      await router.push("/decks/" + deckReponse.id);
    },
  });

  const updateDeckMutation = api.decks.update.useMutation({
    onSuccess: async () => {
      await router.push("/decks/" + deckId);
    },
  });

  const whichFormatIsDeck = () => {
    const cardPools = deckCards.map((dc) => {
      if (!dc.card) {
        return "custom";
      }
      // if one of the pools is standard, the deck is standard, else it's legacy
      if (dc.card.pools.some((pool) => pool.name === "Standard")) {
        return "standard";
      } else if (dc.card.pools.some((pool) => pool.name === "Legacy")) {
        return "legacy";
      }
      return "custom";
    });

    if (cardPools.every((cp) => cp === "standard")) {
      return "standard";
    }

    if (cardPools.some((cp) => cp === "legacy")) {
      return "legacy";
    }

    return "custom";
  };

  useEffect(() => {
    setFormat(whichFormatIsDeck() as Format);
  }, [deckCards]);

  useEffect(() => {
    adjustAffinityPenalty(hero.affinity);
  }, [hero.affinity]);

  const saveDeck = async () => {
    await saveDeckMutation.mutateAsync({
      frontCard: frontCardUrl,
      name: deckName,
      heroId: hero.id,
      description: deckDescription,
      format: format,
      cards: deckCards.map((dc) => {
        if (!dc.card) {
          throw new Error("Card not found");
        }
        return {
          cardId: dc.card.id,
          count: dc.count,
          affinityPenalty: dc.affinityPenalty,
        };
      }),
    });
  };

  const updateDeck = async () => {
    await updateDeckMutation.mutateAsync({
      id: deckId,
      frontCard: frontCardUrl,
      name: deckName,
      heroId: hero.id,
      description: deckDescription,
      format: format,
      cards: deckCards.map((dc) => {
        if (!dc.card) {
          throw new Error("Card not found");
        }
        return {
          cardId: dc.card.id,
          count: dc.count,
          affinityPenalty: dc.affinityPenalty,
        };
      }),
    });
  };

  return {
    hero,
    setHero,
    setHeroByName,
    heroList,
    deckCards,
    setDeckCards,
    addCardsToDeck,
    removeCardFromDeck,
    deckId,
    setDeckId,
    deckDescription,
    setDeckDescription,
    deckName,
    setDeckName,
    saveDeck,
    updateDeck,
    frontCardUrl,
    setFrontCardUrl,
    saveIsLoading: saveDeckMutation.isLoading,
    updateIsLoading: updateDeckMutation.isLoading,
    format,
    setFormat,
  };
}
