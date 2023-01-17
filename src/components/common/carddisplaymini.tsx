import {DeckCard} from "../../lib/types";
import {Affinity} from "@prisma/client";
import Image from "next/image";

import manaCircle_mind from "../../../public/builder/bluemanacircle.png";
import manaCircle_strength from "../../../public/builder/redmanacircle.png";
import manaCircle_spirit from "../../../public/builder/greenmanacircle.png";
import manaCircle_neutral from "../../../public/builder/greymanacircle.png";
import {useState} from "react";
import ReactTooltip from "react-tooltip";
import ToolTipProvider from "./toolTipProvider";
import {get_rgb} from "../../lib/utils";


type CardDisplayMiniProps = {
    deckCard: DeckCard,
    onRightClick?: any,
    onLeftClick?: any,
    tooltipOffset?: number,
}

export default function CardDisplayMini({deckCard, onLeftClick, onRightClick, tooltipOffset}: CardDisplayMiniProps) {

    if (!deckCard.card) return null

    return(
        <ToolTipProvider link={deckCard.card.link} tooltipOffset={tooltipOffset}>
            <div
                className={"w-full h-[35px] my-1 bg-main-400 no-select rollout hover:scale-y-110 relative cursor-pointer"}
                onContextMenu={(e) => {
                    e.preventDefault()
                    onRightClick ? onRightClick() : null
                }}
                onClick={() => onLeftClick ? onLeftClick() : null}
            >

                {/* Card Background */}
                <div className={"h-full relative"}>
                    <div className={"w-full absolute h-full"} style={{background: `linear-gradient(90deg, ${get_rgb(deckCard.card.affinity)} 40%, rgba(196, 196, 196, 0) 80%)`}}/>
                    <div className={"miniCardImage"} style={{backgroundImage: `url(${deckCard.card.image})`}}/>
                </div>

                {/* Card Info */}
                <div className={"absolute top-0.5 w-full h-full flex items-center justify-start px-1"}>

                    {/* Card Cost */}
                    <div className={"mt-0.5 absolute"}>
                        <Image src={(() => {
                            switch (deckCard.card.affinity) {
                                case Affinity.MIND:
                                    return manaCircle_mind
                                case Affinity.STRENGTH:
                                    return manaCircle_strength
                                case Affinity.SPIRIT:
                                    return manaCircle_spirit
                                case Affinity.NEUTRAL:
                                    return manaCircle_neutral
                            }
                        })()}
                               alt={"Mana Circle"}
                               width={30}
                               height={30}
                        />
                        <div className={`absolute top-[-2px] -left-[3px] w-[34px] h-[34px] card-cost-ring ${deckCard.affinityBasedCost > deckCard.card.cost ? "card-cost-off-affinity" : ''} flex items-center justify-center text-xl text-white drop-shadow-lg`}
                             style={{textShadow: 'rgb(0 0 0) 0px 1px 3px'}}>
                            {deckCard.affinityBasedCost}
                        </div>
                    </div>

                    {/* Card Name */}
                    <div className={"font-acme ml-8 min-w-[70px] grow text-lg text-gray-100 overflow-ellipsis whitespace-nowrap overflow-hidden"}
                         style={{textShadow: 'rgb(0 0 0) 0px 1px 3px'}}
                    >
                        {deckCard.card.name}
                    </div>

                    {/* Card Count */}
                    <div
                        key={deckCard.count}
                        className={`popup w-6 h-6 p- font-serif text-white bg-gray-900 border-white shadow-xl border-2 ${onRightClick && "hover:border-green-500 hover:scale-110"} duration-200 rounded flex justify-center items-center`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onRightClick ? onRightClick() : null
                        }}
                    >
                        x{deckCard.count}
                    </div>
                </div>
            </div>
        </ToolTipProvider>
            )
}