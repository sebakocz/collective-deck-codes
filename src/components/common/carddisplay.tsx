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
import collectiveIcon from "@public/collective_icon.png";
import parrotImg from "@public/Parroting_Parrot.png";
import Image from "next/image";

import EyeIcon from "@/components/icons/eyeIcon";
import type { DeckCard } from "@/lib/types";

import ToolTipProvider from "./toolTipProvider";

type CardDisplayProps = {
  dc: DeckCard;
};

export default function CardDisplay({ dc }: CardDisplayProps) {
  // recent fix due to database change, good enough for now
  if (!dc.card) return null;

  return (
    <div
      className={
        "group relative cursor-pointer text-white duration-200 hover:scale-105"
      }
    >
      {/* Card Art Image */}
      <Image
        src={dc.card.image.includes("https") ? dc.card.image : parrotImg}
        alt={""}
        width={150}
        height={120}
        className={
          "absolute top-[29%] left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform"
        }
        placeholder={"blur"}
        blurDataURL={collectiveIcon.blurDataURL}
      />

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
      <ToolTipProvider link={dc.card.link}>
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
            <EyeIcon />
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
        className={
          "card-display-text-stats absolute bottom-2.5 left-[14.5%] w-2"
        }
      >
        {dc.card.atk}
      </div>

      {/* Card Health Value */}
      <div
        className={
          "card-display-text-stats absolute bottom-2.5 right-[15%] w-2"
        }
      >
        {dc.card.hp}
      </div>

      {/* Card Ability */}
      <div
        className={"card-display-text-ability absolute top-[60%] w-full"}
        style={{
          fontSize: (() => {
            switch (dc.card.rarity) {
              case Rarity.COMMON:
                return 11;
              case Rarity.UNCOMMON:
                return 9;
              case Rarity.RARE:
                return 8;
              case Rarity.LEGENDARY:
                return 8;
              case Rarity.TOKEN:
                return 10;
            }
          })(),
        }}
      >
        <div className={"w-[60%] text-center"}>{dc.card.ability}</div>
      </div>

      {/* Card Creator */}
      <div
        className={"card-display-text-normal absolute bottom-[9.3%] left-[30%]"}
      >
        {dc.card.creator}
      </div>

      {/* Card Artist */}
      <div
        className={"card-display-text-normal absolute bottom-[6.4%] left-[30%]"}
      >
        {dc.card.artist}
      </div>

      {/* Card Name */}
      <div
        className={
          "card-display-text-normal absolute top-[47.2%] w-[100%] text-center"
        }
      >
        <div className={"text-xs"}>{dc.card.name}</div>
      </div>

      {/* Card Tribe & Realm */}
      <div
        className={
          "card-display-text-normal absolute top-[51.8%] w-[100%] text-center "
        }
      >
        {dc.card.tribe}
        {dc.card.realm !== "" ? ` from ${dc.card.realm || ""}` : ""}
      </div>

      {/* Card Rarity */}
      <div className={"absolute top-[55%] left-[46.5%]"}>
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
