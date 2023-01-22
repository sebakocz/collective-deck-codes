import type { Hero } from "@prisma/client";
import { useState } from "react";

import type { DeckCard } from "../types";
import {
  affinityMindFilter,
  affinityNeutralFilter,
  affinitySpiritFilter,
  affinityStrengthFilter,
  rarityCommonFilter,
  rarityLegendaryFilter,
  rarityRareFilter,
  rarityUncommonFilter,
} from "../utils";

export type InputFilter = {
  func: (f: DeckCard, input: string) => boolean;
  input: string;
};

export default function useFilter(hero: Hero) {
  // refactored whole neatly organized filter structure because it was too slow
  // followed these steps:
  // https://stackoverflow.com/questions/49963837/how-can-i-speed-up-my-array-search-function

  const [inputFilters, setInputFilters] = useState<InputFilter[]>([]);
  const [miscFilters, setMiscFilters] = useState<((f: DeckCard) => boolean)[]>(
    []
  );
  const [affinityFilters, setAffinityFilters] = useState<
    ((f: DeckCard) => boolean)[]
  >([
    affinityMindFilter,
    affinityStrengthFilter,
    affinitySpiritFilter,
    affinityNeutralFilter,
  ]);
  const [rarityFilters, setRarityFilters] = useState<
    ((f: DeckCard) => boolean)[]
  >([
    rarityCommonFilter,
    rarityUncommonFilter,
    rarityRareFilter,
    rarityLegendaryFilter,
  ]);

  function resetFilter() {
    setRarityFilters([
      rarityCommonFilter,
      rarityUncommonFilter,
      rarityRareFilter,
      rarityLegendaryFilter,
    ]);

    setAffinityFilters([
      affinityMindFilter,
      affinityStrengthFilter,
      affinitySpiritFilter,
      affinityNeutralFilter,
    ]);

    setMiscFilters([]);

    setInputFilters([]);
  }

  function inputFilterExists(filter: (f: DeckCard) => boolean) {
    return inputFilters.find((f) => f.func == filter) !== undefined;
  }

  function miscFilterExists(filter: (f: DeckCard) => boolean) {
    return miscFilters.find((f) => f == filter) !== undefined;
  }

  function affinityFilterExists(filter: (f: DeckCard) => boolean) {
    return affinityFilters.find((f) => f == filter) !== undefined;
  }

  function rarityFilterExists(filter: (f: DeckCard) => boolean) {
    return rarityFilters.find((f) => f == filter) !== undefined;
  }

  function addInputFilter(func: InputFilter["func"], input: string) {
    // ...input && {input} - conditional spreading, used to prevent empty values in objects
    // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
    setInputFilters((currentFilters) => [...currentFilters, { func, input }]);
  }

  function removeInputFilter(func: InputFilter["func"]) {
    setInputFilters((currentFilters) =>
      currentFilters.filter((f) => !(f.func == func))
    );
  }

  // changed back from curry so I can use debounce on quick search
  const onInputFilter = (filter: InputFilter["func"], input: string) => {
    input = input.toLowerCase();
    removeInputFilter(filter);
    if (input === "") {
      return;
    }

    addInputFilter(filter, input);
  };

  function getInputFilter(filter: InputFilter["func"]) {
    return inputFilters.find((f) => f.func == filter)?.input ?? "";
  }

  function removeMiscFilter(filter: (f: DeckCard) => boolean) {
    setMiscFilters((currentFilters) =>
      currentFilters.filter((f) => !(f == filter))
    );
  }

  function addMiscFilter(filter: (f: DeckCard) => boolean) {
    // ...input && {input} - conditional spreading, used to prevent empty values in objects
    // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
    setMiscFilters((currentFilters) => [...currentFilters, filter]);
  }

  function toggleMiscFilter(filter: (f: DeckCard) => boolean) {
    if (miscFilterExists(filter)) {
      removeMiscFilter(filter);
    } else {
      addMiscFilter(filter);
    }
  }

  function removeRarityFilter(filter: (f: DeckCard) => boolean) {
    setRarityFilters((currentFilters) =>
      currentFilters.filter((f) => !(f == filter))
    );
  }

  function addRarityFilter(filter: (f: DeckCard) => boolean) {
    // ...input && {input} - conditional spreading, used to prevent empty values in objects
    // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
    setRarityFilters((currentFilters) => [...currentFilters, filter]);
  }

  function toggleRarityFilter(filter: (f: DeckCard) => boolean) {
    if (rarityFilterExists(filter)) {
      removeRarityFilter(filter);
    } else {
      addRarityFilter(filter);
    }
  }

  function removeAffinityFilter(filter: (f: DeckCard) => boolean) {
    setAffinityFilters((currentFilters) =>
      currentFilters.filter((f) => !(f == filter))
    );
  }

  function addAffinityFilter(filter: (f: DeckCard) => boolean) {
    // ...input && {input} - conditional spreading, used to prevent empty values in objects
    // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
    setAffinityFilters((currentFilters) => [...currentFilters, filter]);
  }

  function toggleAffinityFilter(filter: (f: DeckCard) => boolean) {
    if (affinityFilterExists(filter)) {
      removeAffinityFilter(filter);
    } else {
      addAffinityFilter(filter);
    }
  }

  function applyFilters(cards: DeckCard[]) {
    const new_cards: DeckCard[] = [];
    for (let i = 0; i < cards.length; i++) {
      for (let f = 0; f < affinityFilters.length; f++) {
        if (affinityFilters[f]?.(cards[i] as DeckCard)) {
          new_cards.push(cards[i] as DeckCard);
          break;
        }
      }
    }

    const new_cards2: DeckCard[] = [];
    for (let i = 0; i < new_cards.length; i++) {
      for (let f = 0; f < rarityFilters.length; f++) {
        if (rarityFilters[f]?.(new_cards[i] as DeckCard)) {
          new_cards2.push(new_cards[i] as DeckCard);
          break;
        }
      }
    }

    const new_cards3: DeckCard[] = [];
    for (let i = 0; i < new_cards2.length; i++) {
      let passed = true;
      for (let f = 0; f < miscFilters.length; f++) {
        if (miscFilters[f]?.(new_cards2[i] as DeckCard)) {
          passed = false;
          break;
        }
      }
      if (passed) {
        new_cards3.push(new_cards2[i] as DeckCard);
      }
    }

    let new_cards4: DeckCard[] = [];
    for (let i = 0; i < new_cards3.length; i++) {
      let passed = true;
      for (let f = 0; f < inputFilters.length; f++) {
        if (typeof inputFilters[f] === "undefined") continue;
        if (
          !inputFilters[f]?.func(
            new_cards3[i] as DeckCard,
            inputFilters[f]?.input || ""
          )
        ) {
          passed = false;
          break;
        }
      }
      if (passed) {
        new_cards4.push(new_cards3[i] as DeckCard);
      }
    }

    // only show exclusive cards when they match hero affinity
    new_cards4 = new_cards4.filter((card) => {
      if (card.card?.exclusive) {
        return card.card.affinity == hero.affinity || hero.affinity == null;
      }
      return true;
    });

    return new_cards4;
  }

  return {
    applyFilters,
    toggleAffinityFilter,
    toggleRarityFilter,
    toggleMiscFilter,
    onInputFilter,
    getInputFilter,
    inputFilterExists,
    affinityFilterExists,
    rarityFilterExists,
    miscFilterExists,
    resetFilter,
    setAffinityFilters,
    setRarityFilters,
    rarityFilters,
    affinityFilters,
    miscFilters,
    inputFilters,
  };
}
