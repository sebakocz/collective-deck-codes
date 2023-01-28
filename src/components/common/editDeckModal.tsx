import type { Hero } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";

import LabelChip from "@/components/common/labelChip";
import { useCardpool } from "@/lib/hooks/useCardpool";
import type { useDeck } from "@/lib/hooks/useDeck";
import type { DeckCard } from "@/lib/types";
import { getHeroIcon } from "@/lib/utils";
import { api } from "@/utils/api";

import Button from "./button";

type EditDeckModalProps = {
  userDeck: ReturnType<typeof useDeck>;
  toggleModal: () => void;
};

const EditDeckModal = ({ userDeck, toggleModal }: EditDeckModalProps) => {
  // if deck has no id, it's a new deck
  const type = useMemo(
    () => (userDeck.deckId ? "edit" : "new"),
    [userDeck.deckId]
  );

  const { deckName, deckDescription, deckCards, hero } = userDeck;

  const [deckNameValue, setDeckNameValue] = useState(deckName || "");
  const [descriptionValue, setDescriptionValue] = useState(
    deckDescription || ""
  );

  const [frontCardIndex, setFrontCardIndex] = useState(0);
  const reduceFrontCardIndex = () => {
    if (frontCardIndex > 0) {
      setFrontCardIndex(frontCardIndex - 1);
    } else {
      setFrontCardIndex(deckCards.length - 1);
    }
  };
  const increaseFrontCardIndex = () => {
    if (frontCardIndex < deckCards.length - 1) {
      setFrontCardIndex(frontCardIndex + 1);
    } else {
      setFrontCardIndex(0);
    }
  };

  const router = useRouter();

  const saveDeckMutation = api.decks.save.useMutation({
    onSuccess: async (deckReponse) => {
      await router.push("/decks/" + deckReponse.id);
    },
  });

  const updateDeckMutation = api.decks.update.useMutation({
    onSuccess: async () => {
      await router.push("/decks/" + userDeck.deckId);
      toggleModal();
    },
  });

  const { whichCardPoolIsCardIn } = useCardpool();

  const whichFormatIsDeck = () => {
    const cardPools = deckCards.map((dc) => {
      if (!dc.card) {
        return "none";
      }
      return whichCardPoolIsCardIn(dc.card);
    });

    if (cardPools.every((cp) => cp === "standard")) {
      return "standard";
    }

    if (cardPools.some((cp) => cp === "legacy")) {
      return "legacy";
    }

    return "custom";
  };

  const format = useMemo(() => whichFormatIsDeck(), [deckCards]);

  const saveDeck = async (
    hero: Hero,
    deckCards: DeckCard[],
    frontCardUrl: string,
    deckName: string,
    description: string,
    id: string | undefined
  ) => {
    switch (type) {
      case "new":
        await saveDeckMutation.mutateAsync({
          frontCard: frontCardUrl,
          name: deckName,
          heroId: hero.id,
          description: description,
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
        break;

      case "edit":
        if (!id) {
          return;
        }

        await updateDeckMutation.mutateAsync({
          id: id,
          frontCard: frontCardUrl,
          name: deckName,
          heroId: hero.id,
          description: description,
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
        break;
    }
  };

  return (
    <>
      <div
        className={
          "fade-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50"
        }
        onClick={toggleModal}
      >
        <div
          className={
            "grid grid-cols-6 grid-rows-6 gap-2 rounded bg-main-500 p-3"
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Icon */}
          <div
            className={"col-span-3 row-span-3 flex items-center justify-center"}
          >
            <div className={"circle h-36 w-36"}>
              <Image
                src={getHeroIcon(hero.name)}
                width={150}
                height={150}
                alt={hero.name}
                objectFit={"contain"}
                // layout={"fill"}
              />
            </div>
          </div>

          {/* Front Card */}
          <div
            className={
              "relative col-span-3 row-span-4 rounded-2xl bg-main-400 p-1"
            }
          >
            <div
              className={
                "h-full w-full rounded-xl bg-cover bg-center bg-no-repeat drop-shadow-xl"
              }
              style={{
                backgroundImage: `url(${
                  deckCards[frontCardIndex]?.card?.image ||
                  "https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/a54332d0-3e5c-11eb-b033-73172d333e79.png"
                })`,
              }}
            />

            <div
              className={
                "absolute top-0 -left-1.5 flex h-full w-[105%] items-center justify-between"
              }
            >
              <div
                className={
                  "flex h-7 w-7 items-center justify-center rounded-2xl bg-main-400 p-1 text-main-600 hover:text-main-200"
                }
                onClick={reduceFrontCardIndex}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </div>

              <div
                className={
                  "flex h-7 w-7 items-center justify-center rounded-2xl bg-main-400 p-1 text-main-600 hover:text-main-200"
                }
                onClick={increaseFrontCardIndex}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Deck Name */}
          <div className={"col-span-3"}>
            <div
              className={
                "flex justify-center rounded-2xl bg-main-400 p-1 shadow"
              }
            >
              <input
                className={
                  "w-full rounded-2xl p-1 text-center text-main-700 focus:outline-main-300"
                }
                type="text"
                value={deckNameValue}
                placeholder="Deck Name..."
                onChange={(e) => setDeckNameValue(e.target.value)}
              />
            </div>
          </div>

          {/* Deck Description */}
          <div className={"col-span-6 row-span-2"}>
            <div
              className={
                "flex justify-center rounded-2xl bg-main-400 p-1 shadow"
              }
            >
              <textarea
                className={
                  "no-scrollbar h-20 w-full resize-none rounded-2xl p-2 p-1 text-center text-main-700 focus:outline-main-300"
                }
                placeholder="Description..."
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
            </div>
          </div>

          <LabelChip label={format} />

          <div className={"col-span-6 flex w-full justify-between"}>
            <div
              className={
                "flex cursor-pointer items-center justify-center p-2 duration-200 hover:text-red-500"
              }
              onClick={toggleModal}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            {type === "new" && (
              <Button
                // TODO: figure out placeholder image for front card
                onClick={async () =>
                  await saveDeck(
                    hero,
                    deckCards,
                    deckCards[frontCardIndex]?.card?.image || "",
                    deckNameValue,
                    descriptionValue,
                    undefined
                  )
                }
                disabled={saveDeckMutation.isLoading}
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
                {saveDeckMutation.isLoading && (
                  <PulseLoader size={5} color={"#99816A"} />
                )}
              </Button>
            )}

            {type === "edit" && (
              <Button
                onClick={async () =>
                  await saveDeck(
                    hero,
                    deckCards,
                    deckCards[frontCardIndex]?.card?.image || "",
                    deckNameValue,
                    descriptionValue,
                    userDeck.deckId
                  )
                }
                disabled={updateDeckMutation.isLoading}
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
                Edit
                {updateDeckMutation.isLoading && (
                  <PulseLoader size={5} color={"#99816A"} />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDeckModal;
