import {NextPage} from "next";
import {trpc} from "../utils/trpc";
import Head from "next/head";
import Options from "../components/brew/options";
import Cardlibrary from "../components/brew/cardlibrary";
import CardPoolView from "../components/brew/cardpoolview";
import FilterView from "../components/brew/filterview";
import {Card, CardsOnDecks, Prisma} from "@prisma/client";
import {DeckCard} from "../lib/types";
import FormatDropdown from "../components/brew/formatdropdown";
import React, {useEffect, useState} from "react";
import useFilter from "../lib/hooks/useFilter";
import {exclusiveFilter, getOffAffPenalty, noHero, sortCards} from "../lib/utils";
import {useDeck} from "../lib/hooks/useDeck";
import useHero from "../lib/hooks/useHero";
import Analyse from "../components/brew/analyse";
import {useSession} from "next-auth/react";

// const ToolTipProvider = React.lazy(() => import("../components/toolTipProvider"));
import ToolTipProvider from "../components/common/toolTipProvider";
import ReactTooltip from "react-tooltip";

const Brew: NextPage = () => {

    const { data: session } = useSession()

    const standardCardsImport = trpc.useQuery(["cards.getStandard"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const legacyCardsImport = trpc.useQuery(["cards.getLegacy"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const [currentCardsImport, setCurrentCardsImport] = useState("standard")
    const changeFormat = (format: string) => {
        setCurrentCardsImport(format)
    }

    // transform to DeckCards
    const getPoolDeckCards = (cards: Card[]) => cards.map((card: Card) => ({
        card: card,
        count: 1,
        affinityBasedCost: getOffAffPenalty(card, hero),
        cardId: card.id,
        deckId: ""
    }))

    const {hero, heros, setHeroByName} = useHero()

    useEffect(() =>{
        const newDeckCards = deck.map(card => {
            card.affinityBasedCost = getOffAffPenalty(card.card, hero)
            return card
        })
        setDeck(sortCards([...newDeckCards]))

        // when a non-non-hero is selected show exclusive cards
        // TODO: error: select hero -> refresh filters, you should change the default filter instead hacking like this
        if(hero.name.includes("No Hero") && !miscFilterExists(exclusiveFilter)){
            toggleMiscFilter(exclusiveFilter)
        }
        if(!hero.name.includes("No Hero") && miscFilterExists(exclusiveFilter)){
            toggleMiscFilter(exclusiveFilter)
        }
    }, [hero])

    const {
        applyFilters,
        toggleAffinityFilter,
        toggleRarityFilter,
        toggleMiscFilter,
        onInputFilter,
        getInputFilter,
        inputFilterExists,
        affinityFilterExists,
        rarityFilterExists,
        miscFilterExists,
        resetFilter
    } = useFilter(hero)

    const {deck, setDeck, addCardsToDeck, removeCardFromDeck} = useDeck()

    // TODO: doing this on each render is highly inefficient, maybe use memo or something
    const poolDeckCards = sortCards(getPoolDeckCards((currentCardsImport == "standard" ? standardCardsImport.data : currentCardsImport == "legacy" ? legacyCardsImport.data : [] ) || []))

    const [isBrewing, setIsBrewing] = useState(true)
    const toggleBrewing = () => {
        setIsBrewing(!isBrewing)
    }

    const importCardsFromString = (cardsString: string[]) => {
        let newCards: DeckCard[] = []
        for(let i=0; i < cardsString.length; i++){
            const line = cardsString[i]
            if(line?.startsWith('#')){
                continue
            }

            const count: number = parseInt(line!.charAt(0))
            const name = line!.slice(1).trim()
            if(!count || !name){
                return
            }

            const card_uid = /([a-z]|[0-9]){8}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){12}/.exec(name)
            if(card_uid && typeof card_uid != 'undefined') {
                const card = legacyCardsImport.data?.find(c => c.id == card_uid[0])
                if(card){
                    newCards.push({
                        card: card,
                        count: Number(count),
                        affinityBasedCost: getOffAffPenalty(card, hero),
                        cardId: card.id,
                        deckId: ""
                    })
                }
                continue
            }
            const card = legacyCardsImport.data?.find(c => c.name == name)
            if(card){
                newCards.push({
                    card: card,
                    count: Number(count),
                    affinityBasedCost: getOffAffPenalty(card, hero),
                    cardId: card.id,
                    deckId: ""
                })
            }
        }

        addCardsToDeck(newCards)
    }

    return (
        <>
            <Head>
                <title>Collective Decks - Brew</title>
            </Head>
            <div className={"flex flex-wrap w-full h-screen"}>
                <Options
                    importCardsFromString={importCardsFromString}
                    hero={hero}
                    userDeckCards={deck}
                    heros={heros}
                    addCardsToDeck={addCardsToDeck}
                    removeCardFromDeck={removeCardFromDeck}
                    setDeck={setDeck}
                    setHeroByName={setHeroByName}
                    toggleBrewing={toggleBrewing}
                    isBrewing={isBrewing}
                    session={session}
                />
                <main className={"p-1 md:p-8 flex-1 h-full"}>
                    {isBrewing ?
                        <Cardlibrary
                            isLoadingImport={currentCardsImport == "standard" ? standardCardsImport.isLoading : currentCardsImport == "legacy" ? legacyCardsImport.isLoading : false}
                            addCardsToDeck={addCardsToDeck}
                            maxCards={poolDeckCards.length}
                            deckCards={applyFilters(poolDeckCards)}
                            formatDropdown={<FormatDropdown changeFormat={changeFormat}/>}
                            filter={{
                                toggleAffinityFilter,
                                toggleRarityFilter,
                                toggleMiscFilter,
                                onInputFilter,
                                getInputFilter,
                                inputFilterExists,
                                affinityFilterExists,
                                rarityFilterExists,
                                miscFilterExists,
                                resetFilter
                            }}/>
                        :
                        <Analyse deck={deck}/>
                    }
                </main>
            </div>
        </>
    )
}

export default Brew