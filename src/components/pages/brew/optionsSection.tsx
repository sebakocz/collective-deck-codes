import { Rarity } from "@prisma/client";
import amberImg from "@public/amber.png";
import Image from "next/image";
import type { Session } from "next-auth";
import React, { useState } from "react";

import type { useDeck } from "@/lib/hooks/useDeck";
import useImporter from "@/lib/hooks/useImporter";
import type { DeckCard } from "@/lib/types";
import { exportDeckToClipboard } from "@/lib/utils";

import Button from "../../common/button";
import CardDisplayMini from "../../common/carddisplaymini";
import EditDeckModal from "../../common/editDeckModal";
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

  const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
  const toggleEditDeckModal = () => {
    setIsEditDeckModalOpen(!isEditDeckModalOpen);
  };

  return (
    <div className={"h-screen w-full bg-main-500 shadow-2xl md:w-60"}>
      <div className={"relative m-3 flex h-[96%] flex-col gap-3"}>
        {isEditDeckModalOpen && (
          <EditDeckModal
            userDeck={userDeck}
            toggleModal={toggleEditDeckModal}
          />
        )}

        {/* Analyse */}
        {isBrewing ? (
          <Button onClick={toggleBrewing}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analyse
          </Button>
        ) : (
          <Button onClick={toggleBrewing}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
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
              {/* Reset */}
              <button
                className={
                  "fade-in absolute -left-2 -top-2 rounded-2xl bg-main-400 p-1 text-main-600 drop-shadow-xl duration-200 hover:text-red-500"
                }
                onClick={() => setDeckCards([])}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Import
        </Button>

        {/* Save */}
        <Button
          disabled={!session || deckCards.length <= 0}
          // onClick={saveDeck}
          onClick={toggleEditDeckModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save
        </Button>

        {/* Export */}
        <Button
          onClick={() => exportDeckToClipboard(deckName, deckCards, hero)}
          moreClasses={"w-full"} // tippy workaround
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Export
        </Button>
      </div>
    </div>
  );
}
