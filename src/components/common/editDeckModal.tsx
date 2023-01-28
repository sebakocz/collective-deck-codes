import type { Hero } from "@prisma/client";
import parrot_img from "@public/Parroting_Parrot.png";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";

import LabelChip from "@/components/common/labelChip";
import ArrowLeftIcon from "@/components/icons/arrowLeftIcon";
import ArrowRightIcon from "@/components/icons/arrowRightIcon";
import ExitIcon from "@/components/icons/exitIcon";
import SaveIcon from "@/components/icons/saveIcon";
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

  // TODO: refactor this into a component together with template, extend userDeck with setFrontCard
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
                  deckCards[frontCardIndex]?.card?.image || parrot_img.src
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
                <ArrowLeftIcon />
              </div>

              <div
                className={
                  "flex h-7 w-7 items-center justify-center rounded-2xl bg-main-400 p-1 text-main-600 hover:text-main-200"
                }
                onClick={increaseFrontCardIndex}
              >
                <ArrowRightIcon />
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
              <ExitIcon />
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
                <SaveIcon />
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
                <SaveIcon />
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
