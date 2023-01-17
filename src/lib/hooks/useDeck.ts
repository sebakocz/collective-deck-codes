import {useState} from "react";
import {Card} from "@prisma/client";
import {sortCards} from "../utils";
import {DeckCard} from "../types";

export function useDeck(){
    const [deck, setDeck] = useState<DeckCard[]>([])

    const addCardsToDeck = (cards: DeckCard[]) => {
        let new_deckCards: DeckCard[] = []
        for(let i=0; i < cards.length; i++) {
            const deckSlot = deck.find(dc => dc.card?.id == cards[i]?.card?.id)
            if (typeof deckSlot !== "undefined"){
                if(deckSlot.count + cards[i]?.count! > 3){
                    deckSlot.count = 3
                    continue
                }
                deckSlot.count += cards[i]?.count!
            }
            else {
                new_deckCards.push(cards[i]!)
            }
        }

        setDeck(sortCards([
            ...deck,
            ...new_deckCards
        ]))
    }

    const removeCardFromDeck = (card: DeckCard) => {
        const new_deck = deck.filter(c => {
            if(c.card?.id == card.card?.id){
                c.count--
                return c.count > 0
            }
            return true
        })
        setDeck(new_deck)
    }

    return {deck, setDeck, addCardsToDeck, removeCardFromDeck}
}