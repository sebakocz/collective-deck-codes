import { Rarity } from "@prisma/client";
import amberImg from "@public/amber.png";
import Image from "next/image";
import type { Session } from "next-auth";
import React, { useState } from "react";

import LabelChip from "@/components/common/labelChip";
import AnalyseIcon from "@/components/icons/analyseIcon";
import BrewIcon from "@/components/icons/brewIcon";
import SaveIcon from "@/components/icons/saveIcon";
import TrashIcon from "@/components/icons/trashIcon";
import ExportButton from "@/components/pages/brew/options/exportButton";
import ImportInputField from "@/components/pages/brew/options/importInputField";
import type { useDeck } from "@/lib/hooks/useDeck";
import type { DeckCard } from "@/lib/types";

import Button from "../../common/button";
import CardDisplayMini from "../../common/carddisplaymini";
import SaveDeckModal from "../../common/saveDeckModal";
import HeroDropdown from "./options/herodropdown";

const getDeckCost = (deck: DeckCard[]) => {
  let amberSum = 0;
  for (let i = 0; i < deck.length; i++) {
    switch (deck[i]?.card?.rarity) {
      case Rarity.COMMON:
      case Rarity.UNCOMMON:
      case Rarity.RARE:
        amberSum += 125;
        break;
      case Rarity.LEGENDARY:
        amberSum += 250;
        break;
    }
  }
  return amberSum;
};

type OptionProps = {
  userDeck: ReturnType<typeof useDeck>;
  brewing: { isBrewing: boolean; toggleBrewing: () => void };
  session: Session | null;
  isLoading: boolean;
};

export default function OptionsSection({
  userDeck,
  brewing,
  session,
  isLoading,
}: OptionProps) {
  const { isBrewing, toggleBrewing } = brewing;

  const {
    deckName,
    hero,
    deckCards,
    heroList,
    setDeckCards,
    setDeckName,
    setHeroByName,
    addCardsToDeck,
    removeCardFromDeck,
    format,
  } = userDeck;

  const [isSaveDeckModalOpen, setIsSaveDeckModalOpen] = useState(false);
  const toggleEditDeckModal = () => {
    setIsSaveDeckModalOpen(!isSaveDeckModalOpen);
  };

  return (
    <div className={"h-screen w-full bg-main-500 shadow-2xl md:w-60"}>
      <div
        className={"relative m-3 flex h-[96%] flex-col justify-evenly gap-2"}
      >
        {isSaveDeckModalOpen && (
          <SaveDeckModal
            userDeck={userDeck}
            toggleModal={toggleEditDeckModal}
          />
        )}

        {/* Analyse */}
        {isBrewing ? (
          <Button onClick={toggleBrewing}>
            <AnalyseIcon />
            Analyse
          </Button>
        ) : (
          <Button onClick={toggleBrewing}>
            <BrewIcon />
            Brew
          </Button>
        )}

        {/* Deck Name */}
        <div
          className={"flex justify-center rounded-2xl bg-main-400 p-1 shadow"}
        >
          <input
            className={
              "w-full rounded-2xl p-1 text-center text-main-700 focus:outline-main-300"
            }
            type="text"
            value={deckName}
            placeholder="Deck Name..."
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>

        {/*  Choose Hero  */}
        <div
          className={"flex justify-center rounded-2xl bg-main-400 p-1 shadow"}
        >
          <HeroDropdown
            changeHero={setHeroByName}
            heros={heroList}
            currentHero={hero}
          />
        </div>

        {/*  Deck List Section */}
        <div
          className={
            "relative my-1 h-[55%] grow rounded bg-main-300 p-1  shadow"
          }
        >
          {/* Call to Action on empty list */}
          {deckCards.length <= 0 ? (
            isLoading ? (
              <div className={"p-10 text-center italic text-main-700"}>
                Loading...
              </div>
            ) : (
              <div className={"p-10 text-center italic text-main-700"}>
                Import cards from your clipboard or click on images to add them!
              </div>
            )
          ) : (
            <></>
          )}

          {/* List of cards */}
          {deckCards.length > 0 && (
            <div
              className={
                "no-scrollbar h-full overflow-hidden overflow-y-scroll will-change-transform"
              }
            >
              <div className={"h-full w-full"}>
                {deckCards.map((dc) => {
                  return (
                    <CardDisplayMini
                      key={dc.card?.id}
                      deckCard={dc}
                      onLeftClick={() => removeCardFromDeck(dc)}
                      onRightClick={() => addCardsToDeck([{ ...dc }])}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Deck Interactables */}
          {deckCards.length > 0 && (
            <>
              {/* Clear Deck */}
              <button
                className={
                  "fade-in absolute -left-2 -top-2 rounded-2xl bg-main-400 p-1 text-main-600 drop-shadow-xl duration-200 hover:text-red-500"
                }
                onClick={() => setDeckCards([])}
              >
                <TrashIcon />
              </button>

              {/* Amber */}
              <div
                className={
                  "fade-in absolute -left-2 -bottom-2 flex h-7 w-auto items-center justify-center rounded-xl bg-main-400 p-1 pr-2 text-main-600"
                }
              >
                <div className={"flex w-6 items-center"}>
                  <Image src={amberImg} alt={"Amber"} width={18} height={18} />
                </div>
                {getDeckCost(deckCards)}
              </div>

              {/* Format */}
              <div className={"absolute -top-2 -right-2"}>
                <LabelChip label={format} />
              </div>

              {/* Deck Size */}
              <div
                className={
                  "fade-in absolute -right-2 -bottom-2 flex h-7 w-auto items-center justify-center rounded-xl bg-main-400 p-1 px-2 text-main-700"
                }
              >
                {deckCards.reduce((a, b) => a + b.count, 0)}
              </div>
            </>
          )}
        </div>

        {/* Import */}
        <ImportInputField userDeck={userDeck} />

        {/* Save */}
        <Button
          disabled={!session || deckCards.length <= 0}
          onClick={toggleEditDeckModal}
        >
          <SaveIcon />
          Save
        </Button>

        {/* Export */}
        <ExportButton hero={hero} deckCards={deckCards} deckName={deckName} />
      </div>
    </div>
  );
}
