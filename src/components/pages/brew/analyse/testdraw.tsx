import React, { useState } from "react";

import CardDisplay from "@/components/common/carddisplay";
import type { DeckCard } from "@/lib/types";

type TestDrawProps = {
  deck: DeckCard[];
};

const getPopulatedTestDeck = (deck: DeckCard[]) => {
  const newDeck: DeckCard[] = [];
  deck.forEach((card) => {
    for (let i = 0; i < card.count; i++) {
      newDeck.push(card);
    }
  });
  return shuffleCards(newDeck);
};

const shuffleCards = (array: DeckCard[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i] as DeckCard;

    array[i] = array[j] as DeckCard;
    array[j] = temp;
  }
  return array;
};

export default function TestDraw({ deck }: TestDrawProps) {
  const [cardsInTestDeck, setCardsInTestDeck] = useState<DeckCard[]>(
    getPopulatedTestDeck(deck)
  );
  const [cardsInTestHand, setCardsInTestHand] = useState<DeckCard[]>([]);

  const drawCard = () => {
    const newDeck = cardsInTestDeck;
    if (newDeck.length <= 0 || typeof newDeck == "undefined") {
      return;
    }

    const newHand = cardsInTestHand;
    newHand.push(newDeck.pop() as DeckCard);

    setCardsInTestDeck([...newDeck]);
    setCardsInTestHand([...newHand]);
  };

  const resetTestDraw = () => {
    setCardsInTestDeck(getPopulatedTestDeck(deck));
    setCardsInTestHand([]);
  };

  const removeCard = (index: number) => {
    const newHand = cardsInTestHand;
    newHand.splice(index, 1);
    setCardsInTestHand([...newHand]);
  };

  return (
    <>
      <div className={"no-scrollbar relative h-[270px] overflow-y-scroll"}>
        <div
          className={
            "absolute flex h-full -translate-x-[10%] scale-[80%] items-center will-change-transform"
          }
        >
          {cardsInTestHand.map((card, i) => {
            return (
              <div
                key={i}
                className={"testDrawCardAnimationWrapper flex-none"}
                onClick={() => removeCard(i)}
              >
                <CardDisplay dc={card} />
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={
          "absolute right-3 bottom-5 flex w-36 flex-col gap-3 rounded-xl bg-main-500 p-3"
        }
      >
        <button
          className={
            "flex items-center justify-center gap-1 rounded bg-main-300 p-2 text-center text-lg shadow duration-300 hover:bg-main-200"
          }
          onClick={drawCard}
        >
          Draw
        </button>

        <button
          className={
            "flex items-center justify-center gap-1 rounded bg-main-300 p-2 text-center text-lg shadow duration-300 hover:bg-main-200"
          }
          onClick={resetTestDraw}
        >
          Reset
        </button>
      </div>
    </>
  );
}
