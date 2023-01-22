import { Rarity } from "@prisma/client";
import manaCircle_Mind from "@public/builder/bluemanacircle.png";
import cardBackground_Action from "@public/builder/cardbackground-small.png";
import cardBackground_Unit from "@public/builder/cardbackground-unit-small.png";
import rarityCommon from "@public/builder/common.png";
import exclusiveStar from "@public/builder/exclusive-star.png";
import manaCircle_Spirit from "@public/builder/greenmanacircle.png";
import manaCircle_Neutral from "@public/builder/greymanacircle.png";
import rarityLegendary from "@public/builder/legendary.png";
import rarityRare from "@public/builder/rare.png";
import manaCircle_Strength from "@public/builder/redmanacircle.png";
import rarityUncommon from "@public/builder/uncommon.png";
import rarityToken from "@public/builder/undraftable.png";
import parrotImg from "@public/Parroting_Parrot.png";
import Image from "next/image";

import type { DeckCard } from "@/lib/types";

import ToolTipProvider from "./toolTipProvider";

type CardDisplayProps = {
  dc: DeckCard;
  tooltipOffset?: number;
};

export default function CardDisplay({ dc, tooltipOffset }: CardDisplayProps) {
  // recent fix due to database change, good enough for now
  if (!dc.card) return null;

  return (
    <div
      className={
        "group relative cursor-pointer text-white duration-200 hover:scale-105"
      }
    >
      {/* Card Art Image */}
      <div className={"absolute left-7 top-7"}>
        <Image
          src={dc.card.image.includes("https") ? dc.card.image : parrotImg}
          alt={""}
          // layout={"fill"}
          objectFit={"contain"}
          width={150}
          height={120}
        />
      </div>

      {/* Card Background Image - Type */}
      <Image
        src={
          dc.card.type == "UNIT" ? cardBackground_Unit : cardBackground_Action
        }
        alt={""}
        width={320 * 0.65}
        height={476 * 0.65}
        priority
      />

      {/* Card Full Info Link */}
      <ToolTipProvider link={dc.card.link} tooltipOffset={tooltipOffset}>
        <div
          className={
            "z-100 absolute top-4 left-3 flex h-6 w-6 items-center justify-center rounded-2xl bg-main-400 text-main-600 opacity-0 duration-300 hover:bg-main-100 group-hover:opacity-100"
          }
        >
          <a
            href={dc.card.link}
            target={"_blank"}
            rel={"noreferrer"}
            data-tip={dc.card.link}
            data-for={"card-tooltip"}
            onClick={(e) => e.stopPropagation()}
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </a>
        </div>
      </ToolTipProvider>

      {/* Card Mana Cost + Affinity + Exclusivity */}
      <div className={"absolute top-3.5 right-3.5"}>
        <Image
          src={
            dc.card.affinity == "STRENGTH"
              ? manaCircle_Strength
              : dc.card.affinity == "SPIRIT"
              ? manaCircle_Spirit
              : dc.card.affinity == "MIND"
              ? manaCircle_Mind
              : manaCircle_Neutral
          }
          alt={""}
          width={37}
          height={37}
          priority
        />
        <div
          className={"card-cost-ring absolute -top-1 -left-1 h-[45px] w-[45px]"}
        >
          <div
            className={`card-display-text-stats ${
              dc.affinityPenalty ? "card-cost-off-affinity" : ""
            }`}
          >
            {dc.card.cost + (dc.affinityPenalty ? 1 : 0)}
          </div>
        </div>

        {dc.card.exclusive && (
          <div className={"absolute right-0.5 top-8"}>
            <Image
              src={exclusiveStar}
              alt={""}
              width={25}
              height={25}
              priority
            />
          </div>
        )}
      </div>

      {/* Card Attack Value */}
      <div
        className={"card-display-text-stats absolute bottom-3.5 left-[14%] w-2"}
      >
        {dc.card.atk}
      </div>

      {/* Card Health Value */}
      <div
        className={
          "card-display-text-stats absolute bottom-3.5 right-[15.5%] w-2"
        }
      >
        {dc.card.hp}
      </div>

      {/* Card Ability */}
      <div
        className={"card-display-text-ability absolute top-[58%] w-full"}
        style={{
          fontSize: (() => {
            switch (dc.card.rarity) {
              case Rarity.COMMON:
                return 14;
              case Rarity.UNCOMMON:
                return 12;
              case Rarity.RARE:
                return 10;
              case Rarity.LEGENDARY:
                return 9;
              case Rarity.TOKEN:
                return 12;
            }
          })(),
        }}
      >
        <div className={"w-[60%] text-center"}>{dc.card.ability}</div>
      </div>

      {/* Card Creator */}
      <div
        className={
          "card-display-text-normal absolute bottom-[10.8%] left-[30%]"
        }
      >
        {dc.card.creator}
      </div>

      {/* Card Artist */}
      <div
        className={"card-display-text-normal absolute bottom-[7.8%] left-[30%]"}
      >
        {dc.card.artist}
      </div>

      {/* Card Name */}
      <div
        className={
          "card-display-text-normal absolute top-[46.5%] w-[100%] text-center"
        }
      >
        <div className={"text-xs"}>{dc.card.name}</div>
      </div>

      {/* Card Realm */}
      <div
        className={
          "card-display-text-normal absolute top-[51%] w-[100%] text-center"
        }
      >
        {dc.card.tribe}
        {dc.card.realm !== "" ? ` from ${dc.card.realm || ""}` : ""}
      </div>

      {/* Card Rarity */}
      <div className={"absolute top-[53%] left-[46.5%]"}>
        <Image
          src={
            dc.card.rarity == "COMMON"
              ? rarityCommon
              : dc.card.rarity == "UNCOMMON"
              ? rarityUncommon
              : dc.card.rarity == "RARE"
              ? rarityRare
              : dc.card.rarity == "LEGENDARY"
              ? rarityLegendary
              : rarityToken
          }
          alt={`Rarity: ${dc.card.rarity}`}
          width={15}
          height={15}
          priority
        />
      </div>
    </div>
  );
}
