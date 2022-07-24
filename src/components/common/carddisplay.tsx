import {DeckCard} from "../../lib/types"
import Image from "next/image"

import parrotImg from "../../../public/Parroting_Parrot.png"
import collectiveIcon from "../../../public/collective_icon.png"

import cardBackground_Unit from "../../../public/builder/cardbackground-unit-small.png"
import cardBackground_Action from "../../../public/builder/cardbackground-small.png"

import manaCircle_Strength from "../../../public/builder/redmanacircle.png"
import manaCircle_Spirit from "../../../public/builder/greenmanacircle.png"
import manaCircle_Mind from "../../../public/builder/bluemanacircle.png"
import manaCircle_Neutral from "../../../public/builder/greymanacircle.png"

import exclusiveStar from "../../../public/builder/exclusive-star.png"
import {Rarity} from "@prisma/client";

import rarityUncommon from "../../../public/builder/uncommon.png"
import rarityCommon from "../../../public/builder/common.png"
import rarityRare from "../../../public/builder/rare.png"
import rarityLegendary from "../../../public/builder/legendary.png"
import rarityToken from "../../../public/builder/undraftable.png"

import eyeIcon from "../../../public/builder/visibility_FILL0_wght400_GRAD0_opsz48.svg"
import ReactTooltip from "react-tooltip";
import {effect} from "zod";
import {Tooltip} from "react-tippy";
import ToolTipProvider from "./toolTipProvider";

type CardDisplayProps = {
    dc: DeckCard,
    tooltipOffset?: number,
}

export default function CardDisplay({dc, tooltipOffset}: CardDisplayProps) {
    return(
        <div className={"relative text-white hover:scale-105 cursor-pointer duration-200 group"}>

            {/* Card Art Image */}
            <div className={"absolute left-7 top-7"}>
                <Image src={dc.card.image.includes("https") ? dc.card.image : parrotImg}
                       alt={""}
                    // layout={"fill"}
                       objectFit={"contain"}
                       width={150}
                       height={120}
                />
            </div>

            {/* Card Background Image - Type */}
            <Image src={dc.card.type == "UNIT" ? cardBackground_Unit : cardBackground_Action}
                   alt={""}
                   width={320 *.65}
                   height={476 *.65}
                   priority
            />

            {/* Card Full Info Link */}
            <ToolTipProvider link={dc.card.link} tooltipOffset={tooltipOffset}>
                <div className={"z-100 absolute top-4 left-3 text-main-600 bg-main-400 rounded-2xl w-6 h-6 flex justify-center items-center opacity-0 group-hover:opacity-100 duration-300 hover:bg-main-100"}>
                    <a
                        href={dc.card.link}
                        target={"_blank"}
                        rel={"noreferrer"}
                        data-tip={dc.card.link}
                        data-for={"card-tooltip"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </a>
                </div>
            </ToolTipProvider>

            {/* Card Mana Cost + Affinity + Exclusivity */}
            <div className={"absolute top-3.5 right-3.5"}>
                <Image src={dc.card.affinity == "STRENGTH" ? manaCircle_Strength : dc.card.affinity == "SPIRIT" ? manaCircle_Spirit : dc.card.affinity == "MIND" ? manaCircle_Mind : manaCircle_Neutral}
                       alt={""}
                       width={37}
                       height={37}
                       priority
                />
                <div className={"card-cost-ring w-[45px] h-[45px] absolute -top-1 -left-1"}>
                    <div className={`card-display-text-stats ${dc.affinityBasedCost > dc.card.cost ? "card-cost-off-affinity" : ''}`}>
                        {dc.affinityBasedCost}
                    </div>
                </div>

                {dc.card.exclusive &&
                    <div className={"absolute right-0.5 top-8"}>
                        <Image src={exclusiveStar}
                               alt={""}
                               width={25}
                               height={25}
                               priority
                        />
                    </div>
                }
            </div>

            {/* Card Attack Value */}
            <div className={"card-display-text-stats absolute bottom-3.5 left-[14%] w-2"}>
                {dc.card.atk}
            </div>

            {/* Card Health Value */}
            <div className={"card-display-text-stats absolute bottom-3.5 right-[15.5%] w-2"}>
                {dc.card.hp}
            </div>

            {/* Card Ability */}
            <div className={"absolute card-display-text-ability top-[58%] w-full"}
                 style={{fontSize: (() => {
                         switch (dc.card.rarity) {
                             case Rarity.COMMON:
                                 return 14
                             case Rarity.UNCOMMON:
                                 return 12
                             case Rarity.RARE:
                                 return 10
                             case Rarity.LEGENDARY:
                                 return 9
                             case Rarity.TOKEN:
                                 return 12
                         }
                     })()}}
            >
                <div className={"text-center w-[60%]"}>
                    {dc.card.ability}
                </div>
            </div>

            {/* Card Creator */}
            <div className={"card-display-text-normal absolute bottom-[10.8%] left-[30%]"}>
                {dc.card.creator}
            </div>

            {/* Card Artist */}
            <div className={"card-display-text-normal absolute bottom-[7.8%] left-[30%]"}>
                {dc.card.artist}
            </div>

            {/* Card Name */}
            <div className={"card-display-text-normal absolute top-[46.5%] text-center w-[100%]"}>
                <div className={"text-xs"}>
                    {dc.card.name}
                </div>
            </div>

            {/* Card Realm */}
            <div className={"card-display-text-normal absolute top-[51%] text-center w-[100%]"}>
                {dc.card.tribe}
                {dc.card.realm !== "" ? ` from ${dc.card.realm}`:""}
            </div>

            {/* Card Rarity */}
            <div className={"absolute top-[53%] left-[46.5%]"}>
                <Image src={dc.card.rarity == "COMMON" ? rarityCommon : dc.card.rarity == "UNCOMMON" ? rarityUncommon : dc.card.rarity == "RARE" ? rarityRare : dc.card.rarity == "LEGENDARY" ? rarityLegendary : rarityToken}
                       alt={`Rarity: ${dc.card.rarity}`}
                       width={15}
                       height={15}
                       priority
                />
            </div>
        </div>
    )
}