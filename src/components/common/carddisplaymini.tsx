import { Affinity } from "@prisma/client";
import manaCircle_mind from "@public/builder/bluemanacircle.png";
import manaCircle_spirit from "@public/builder/greenmanacircle.png";
import manaCircle_neutral from "@public/builder/greymanacircle.png";
import manaCircle_strength from "@public/builder/redmanacircle.png";
import Image from "next/image";

import type { DeckCard } from "@/lib/types";
import { get_rgb } from "@/lib/utils";

import ToolTipProvider from "./toolTipProvider";

type CardDisplayMiniProps = {
  deckCard: DeckCard;
  onRightClick?: () => void;
  onLeftClick?: () => void;
  tooltipOffset?: number;
};

export default function CardDisplayMini({
  deckCard,
  onLeftClick,
  onRightClick,
  tooltipOffset,
}: CardDisplayMiniProps) {
  if (!deckCard.card) return null;

  return (
    <ToolTipProvider link={deckCard.card.link} tooltipOffset={tooltipOffset}>
      <div
        className={
          "no-select rollout relative my-1 h-[35px] w-full cursor-pointer bg-main-400 hover:scale-y-110"
        }
        onContextMenu={(e) => {
          e.preventDefault();
          onRightClick ? onRightClick() : null;
        }}
        onClick={() => (onLeftClick ? onLeftClick() : null)}
      >
        {/* Card Background */}
        <div className={"relative h-full"}>
          <div
            className={"absolute h-full w-full"}
            style={{
              background: `linear-gradient(90deg, ${get_rgb(
                deckCard.card.affinity
              )} 40%, rgba(196, 196, 196, 0) 80%)`,
            }}
          />
          <div
            className={"miniCardImage"}
            style={{ backgroundImage: `url(${deckCard.card.image})` }}
          />
        </div>

        {/* Card Info */}
        <div
          className={
            "absolute top-0.5 flex h-full w-full items-center justify-start px-1"
          }
        >
          {/* Card Cost */}
          <div className={"absolute mt-0.5"}>
            <Image
              src={(() => {
                switch (deckCard.card.affinity) {
                  case Affinity.MIND:
                    return manaCircle_mind;
                  case Affinity.STRENGTH:
                    return manaCircle_strength;
                  case Affinity.SPIRIT:
                    return manaCircle_spirit;
                  case Affinity.NEUTRAL:
                    return manaCircle_neutral;
                }
              })()}
              alt={"Mana Circle"}
              width={30}
              height={30}
            />
            <div
              className={`card-cost-ring absolute top-[-2px] -left-[3px] h-[34px] w-[34px] ${
                deckCard.affinityPenalty ? "card-cost-off-affinity" : ""
              } flex items-center justify-center text-xl text-white drop-shadow-lg`}
              style={{ textShadow: "rgb(0 0 0) 0px 1px 3px" }}
            >
              {deckCard.card.cost + (deckCard.affinityPenalty ? 1 : 0)}
            </div>
          </div>

          {/* Card Name */}
          <div
            className={
              "ml-8 min-w-[70px] grow overflow-hidden overflow-ellipsis whitespace-nowrap font-acme text-lg text-gray-100"
            }
            style={{ textShadow: "rgb(0 0 0) 0px 1px 3px" }}
          >
            {deckCard.card.name}
          </div>

          {/* Card Count */}
          <div
            key={deckCard.count}
            className={`popup p- h-6 w-6 border-2 border-white bg-gray-900 font-serif text-white shadow-xl ${
              onRightClick ? "hover:scale-110 hover:border-green-500" : ""
            } flex items-center justify-center rounded duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onRightClick ? onRightClick() : null;
            }}
          >
            x{deckCard.count}
          </div>
        </div>
      </div>
    </ToolTipProvider>
  );
}
