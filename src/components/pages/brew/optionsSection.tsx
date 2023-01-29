import { Rarity } from "@prisma/client";
import amberImg from "@public/amber.png";
import Image from "next/image";
import type { Session } from "next-auth";
import React, { useState } from "react";

import LabelChip from "@/components/common/labelChip";
import AnalyseIcon from "@/components/icons/analyseIcon";
import BrewIcon from "@/components/icons/brewIcon";
import ExportIcon from "@/components/icons/exportIcon";
import ImportIcon from "@/components/icons/importIcon";
import SaveIcon from "@/components/icons/saveIcon";
import TrashIcon from "@/components/icons/trashIcon";
import type { useDeck } from "@/lib/hooks/useDeck";
import useImporter from "@/lib/hooks/useImporter";
import type { DeckCard } from "@/lib/types";
import { exportDeckToClipboard } from "@/lib/utils";

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
  const importer = useImporter(userDeck.hero);

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

  const importDeckFromClipboard = async () => {
    const clipboard = await navigator.clipboard.readText();
    const lines: string[] = clipboard.split(/\r?\n/);

    // set default values
    let heroName = "No Hero";
    let deckName = "";

    if (!lines[0]) return;

    // get the deck name from the first line
    if (lines[0].startsWith("#")) {
      deckName = lines[0].slice(1).trim();
      userDeck.setDeckName(deckName);
      lines.splice(0, 1);
    }

    // get the hero from the second line
    if (lines[0].startsWith("#")) {
      heroName = lines[0].slice(8).trim().toLowerCase();
      userDeck.setHeroByName(heroName);
      lines.splice(0, 1);
    }

    const cards = await importer.importCardsFromString(lines);
    if (!cards) return;
    userDeck.addCardsToDeck(cards);
  };

  const [isSaveDeckModalOpen, setIsSaveDeckModalOpen] = useState(false);
  const toggleEditDeckModal = () => {
    setIsSaveDeckModalOpen(!isSaveDeckModalOpen);
  };

  return (
    <div className={"h-screen w-full bg-main-500 shadow-2xl md:w-60"}>
      <div className={"relative m-3 flex h-[96%] flex-col gap-3"}>
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
        <div className={"relative h-[55%] grow rounded bg-main-300 p-1 shadow"}>
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
              <div className={"mb-5 mt-3 h-full w-full"}>
                {deckCards.map((dc) => {
                  return (
                    <CardDisplayMini
                      key={dc.card.id}
                      deckCard={dc}
                      onLeftClick={() => removeCardFromDeck(dc)}
                      onRightClick={() => addCardsToDeck([dc])}
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
        <Button onClick={importDeckFromClipboard}>
          <ImportIcon />
          Import
        </Button>

        {/* Save */}
        <Button
          disabled={!session || deckCards.length <= 0}
          // onClick={saveDeck}
          onClick={toggleEditDeckModal}
        >
          <SaveIcon />
          Save
        </Button>

        {/* Export */}
        <Button
          onClick={() => exportDeckToClipboard(deckName, deckCards, hero)}
          moreClasses={"w-full"} // tippy workaround
        >
          <ExportIcon />
          Export
        </Button>
      </div>
    </div>
  );
}
