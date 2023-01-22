import { useState } from "react";

import { useDeckCards } from "@/lib/hooks/useDeckCards";
import useHero from "@/lib/hooks/useHero";

export function useDeck() {
  const [deckDescription, setDeckDescription] = useState("");

  const [deckName, setDeckName] = useState("");

  const [deckId, setDeckId] = useState("");

  return {
    ...useHero(),
    ...useDeckCards(),
    deckId,
    setDeckId,
    deckDescription,
    setDeckDescription,
    deckName,
    setDeckName,
  };
}
