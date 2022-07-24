import {DeckCard} from "../../lib/types";
import styles from "../../styles/Brew.module.css";
import React, {useState} from "react";
import CardDisplay from "../common/carddisplay";

type TestDrawProps = {
    deck: DeckCard[]
}

const getPopulatedTestDeck = (deck: DeckCard[]) => {
    const newDeck: DeckCard[] = []
    deck.forEach(card => {
        for(let i=0; i < card.count; i++){
            newDeck.push(card)
        }
    })
    return shuffleCards(newDeck)
}

const shuffleCards = (array: DeckCard[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        // @ts-ignore
        array[i] = array[j];
        // @ts-ignore
        array[j] = temp;
    }
    return array
}

export default function TestDraw({deck}: TestDrawProps){

    const [cardsInTestDeck, setCardsInTestDeck] = useState<DeckCard[]>(getPopulatedTestDeck(deck))
    const [cardsInTestHand, setCardsInTestHand] = useState<DeckCard[]>([])

    const drawCard = () => {
        let newDeck = cardsInTestDeck
        if(newDeck.length <= 0 || typeof newDeck == 'undefined'){
            return
        }

        let newHand = cardsInTestHand
        newHand.push(newDeck.pop()!)

        setCardsInTestDeck([...newDeck])
        setCardsInTestHand([...newHand])
    }

    const resetTestDraw = () => {
        setCardsInTestDeck(getPopulatedTestDeck(deck))
        setCardsInTestHand([])
    }

    const removeCard = (index: number) => {
        const newHand = cardsInTestHand
        newHand.splice(index,1)
        setCardsInTestHand([...newHand])
    }

    return(
        <>
            <div className={"relative h-[270px] overflow-y-scroll no-scrollbar"}>
                <div className={"absolute h-full will-change-transform flex items-center -translate-x-[10%] scale-[80%]"}>
                    {cardsInTestHand.map((card, i) => {
                        return (
                            <div key={i} className={"testDrawCardAnimationWrapper flex-none"} onClick={() => removeCard(i)}>
                                <CardDisplay
                                    dc={card}
                                    tooltipOffset={-80}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={"absolute w-36 right-3 bottom-5 flex flex-col gap-3 bg-main-500 p-3 rounded-xl"}>

                <button className={"p-2 rounded text-center bg-main-300 hover:bg-main-200 duration-300 text-lg flex justify-center items-center gap-1 shadow"}
                        onClick={drawCard}>
                    Draw
                </button>

                <button className={"p-2 rounded text-center bg-main-300 hover:bg-main-200 duration-300 text-lg flex justify-center items-center gap-1 shadow"}
                        onClick={resetTestDraw}>
                    Reset
                </button>

            </div>
        </>
    )
}