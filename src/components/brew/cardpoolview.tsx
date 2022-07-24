import {Card} from "@prisma/client";
import {DeckCard} from "../../lib/types";
import CardDisplay from "../common/carddisplay";
import {useRef, useState} from "react";
import ReactTooltip from "react-tooltip";
import ToolTipProvider from "../common/toolTipProvider";

type CardPoolViewProps = {
    deckCards?: DeckCard[],
    addCardsToDeck: (cards: DeckCard[]) => void,
}

export default function CardPoolView({deckCards, addCardsToDeck}: CardPoolViewProps){
    const [scrollTop, setScrollTop] = useState(0)

    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        setScrollTop(scrollTop)
    }

    const containerRef = useRef<HTMLDivElement>(null)

    const cardHeight = 309.4
    const cardWidth = 208
    const cardsPerRow = Math.floor((containerRef?.current?.clientWidth || 300)/cardWidth)
    const totalheight = ((deckCards?.length || 0)/cardsPerRow) * cardHeight
    const startIndex = Math.max(0, Math.floor(scrollTop/cardHeight)*cardsPerRow - cardsPerRow*3)
    const endIndex = Math.min((deckCards?.length || 0), Math.ceil((scrollTop+(containerRef?.current?.clientHeight || 3000))/cardHeight)*cardsPerRow + cardsPerRow*3)

    return (
        <>
            <div className={"overflow-y-scroll overflow-x-hidden h-full will-change-transform"}
                 onScroll={handleScroll}
                 ref={containerRef}>
                <div
                    className={"flex flex-wrap justify-center content-start"}
                    style={{paddingTop:(startIndex/cardsPerRow*cardHeight) || 0, height: totalheight }}
                >

                    {deckCards?.slice(startIndex, endIndex).map(dc => {
                        return (
                            <div key={dc.cardId} onClick={() => addCardsToDeck([dc])}>
                                <CardDisplay
                                    key={dc.cardId}
                                    dc={dc}
                                    tooltipOffset={-100}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}