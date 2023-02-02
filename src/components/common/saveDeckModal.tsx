import parrot_img from "@public/Parroting_Parrot.png";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";

import ArrowLeftIcon from "@/components/icons/arrowLeftIcon";
import ArrowRightIcon from "@/components/icons/arrowRightIcon";
import ExitIcon from "@/components/icons/exitIcon";
import SaveIcon from "@/components/icons/saveIcon";
import type { useDeck } from "@/lib/hooks/useDeck";
import type { DeckCard } from "@/lib/types";
import { getHeroIcon } from "@/lib/utils";

import Button from "./button";

enum ModalType {
  EDIT,
  NEW,
}

type SaveDeckModalProps = {
  userDeck: ReturnType<typeof useDeck>;
  toggleModal: () => void;
};

const SaveDeckModal = ({ userDeck, toggleModal }: SaveDeckModalProps) => {
  const {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    deckCards,
    hero,
    saveDeck,
    updateDeck,
    updateIsLoading,
    saveIsLoading,
    deckId,
    frontCardUrl,
    setFrontCardUrl,
  } = userDeck;

  // if deck has no id, it's a new deck
  const modalType = useMemo(
    () => (deckId ? ModalType.EDIT : ModalType.NEW),
    [deckId]
  );

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
          <DeckFrontCard
            deckCardImages={deckCards.map(
              (dc: DeckCard) => dc.card?.image || parrot_img.src
            )}
            frontCardUrl={frontCardUrl}
            setFrontCardUrl={setFrontCardUrl}
          />

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
                value={deckName}
                placeholder="Deck Name..."
                onChange={(e) => setDeckName(e.target.value)}
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
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
              />
            </div>
          </div>

          <div className={"col-span-6 flex w-full justify-between"}>
            <div
              className={
                "flex cursor-pointer items-center justify-center p-2 duration-200 hover:text-red-500"
              }
              onClick={toggleModal}
            >
              <ExitIcon />
            </div>

            {modalType === ModalType.NEW && (
              <Button onClick={saveDeck} disabled={saveIsLoading}>
                <SaveIcon />
                Save
                {saveIsLoading && <PulseLoader size={5} color={"#99816A"} />}
              </Button>
            )}

            {modalType === ModalType.EDIT && (
              <Button onClick={updateDeck} disabled={updateIsLoading}>
                <SaveIcon />
                Edit
                {updateIsLoading && <PulseLoader size={5} color={"#99816A"} />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveDeckModal;

type DeckFrontCardProps = {
  deckCardImages: string[];
  frontCardUrl: string;
  setFrontCardUrl: (frontCardUrl: string) => void;
};

const DeckFrontCard = ({
  deckCardImages,
  frontCardUrl,
  setFrontCardUrl,
}: DeckFrontCardProps) => {
  // this smells dirty, consider changing DB field to an index instead of url

  const [frontCardIndex, setFrontCardIndex] = useState(
    deckCardImages.findIndex((image) => image === frontCardUrl) === -1
      ? 0
      : deckCardImages.findIndex((image) => image === frontCardUrl)
  );

  const reduceFrontCardIndex = () => {
    if (frontCardIndex > 0) {
      setFrontCardIndex(frontCardIndex - 1);
      setFrontCardUrl(deckCardImages[frontCardIndex - 1] || parrot_img.src);
    } else {
      setFrontCardIndex(deckCardImages.length - 1);
      setFrontCardUrl(
        deckCardImages[deckCardImages.length - 1] || parrot_img.src
      );
    }
  };
  const increaseFrontCardIndex = () => {
    if (frontCardIndex < deckCardImages.length - 1) {
      setFrontCardIndex(frontCardIndex + 1);
      setFrontCardUrl(deckCardImages[frontCardIndex + 1] || parrot_img.src);
    } else {
      setFrontCardIndex(0);
      setFrontCardUrl(deckCardImages[0] || parrot_img.src);
    }
  };
  return (
    <div
      className={"relative col-span-3 row-span-4 rounded-2xl bg-main-400 p-1"}
    >
      <div
        className={
          "h-full w-full rounded-xl bg-cover bg-center bg-no-repeat drop-shadow-xl"
        }
        style={{
          backgroundImage: `url(${
            deckCardImages[frontCardIndex] || parrot_img.src
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
  );
};
