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
import {useRouter} from "next/router";
import {getCustomCardById} from "../utils/collactiveapi";

const Brew: NextPage = () => {

    const { data: session } = useSession()

    const [deckDescription, setDeckDescription] = useState("");

    const [deckName, setDeckName] = useState("")

    // TODO: make sure you can't edit other's decks!!
    const router = useRouter()
    let {id} = router.query

    if(typeof id !== "string"){
        id = ""
    }

    const deckParamImport = trpc.useQuery(["decks.getById", {id}], {
        refetchOnReconnect: false,
        // has to be commented out in order for deck to load when just browsing the app
        // refetchOnMount: false,
        refetchOnWindowFocus: false,
        async onSuccess(data) {
            const deck = data?.cards || []
            addCardsToDeck(deck)
            setDeckDescription(data?.description || "")
            setHero(data?.hero || noHero)
            setDeckName(data?.name || "")
        }
    })

    const standardCardsImport = trpc.useQuery(["cards.getStandard"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const newStandardCardsImport = trpc.useQuery(["cards.getNewStandard"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const legacyCardsImport = trpc.useQuery(["cards.getLegacy"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const customCardsImport = trpc.useQuery(["cards.getCustom"], {
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

    const {hero, setHero, heros, setHeroByName} = useHero()

    useEffect(() =>{
        const newDeckCards = deck.map(card => {
            card.affinityBasedCost = getOffAffPenalty(card.card, hero)
            return card
        })
        setDeck(sortCards([...newDeckCards]))

        // when a non-non-hero is selected show exclusive cards
        // TODO: error: select hero -> refresh filters, you should change the default filter instead hacking like this
        if(hero.name.includes("No Hero") && miscFilterExists(exclusiveFilter)){
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
        resetFilter,
        setAffinityFilters,
        setRarityFilters
    } = useFilter(hero)

    const {deck, setDeck, addCardsToDeck, removeCardFromDeck} = useDeck()

    // TODO: doing this on each render is highly inefficient, maybe use memo or something
    const poolDeckCards = sortCards(getPoolDeckCards((currentCardsImport == "standard" ? standardCardsImport.data : currentCardsImport == "legacy" ? legacyCardsImport.data : currentCardsImport == "event" ? newStandardCardsImport.data : [] ) || []))

    const [isBrewing, setIsBrewing] = useState(true)
    const toggleBrewing = () => {
        setIsBrewing(!isBrewing)
    }

    const addCardToDatabaseMutation = trpc.useMutation(["cards.create"])

    const importCardsFromString = async (cardsString: string[]) => {

        console.log("importing cards")
        console.log(cardsString)

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

            // find via id
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
                    continue
                }
            }

            // find via name
            const card = legacyCardsImport.data?.find(c => c.name == name)
            if(card){
                newCards.push({
                    card: card,
                    count: Number(count),
                    affinityBasedCost: getOffAffPenalty(card, hero),
                    cardId: card.id,
                    deckId: ""
                })
                continue
            }

            // find custom same custom card in db
            if(card_uid && typeof card_uid != 'undefined') {
                const card = customCardsImport.data?.find(c => c.id == card_uid[0])
                if(card){
                    newCards.push({
                        card: card,
                        count: Number(count),
                        affinityBasedCost: getOffAffPenalty(card, hero),
                        cardId: card.id,
                        deckId: ""
                    })
                    continue
                }


                // if not found in db but a valid card id, add to db and push to decklist
                if(card_uid[0]) {
                    // get Card via fetching from Collective API
                    const customCard = await getCustomCardById(card_uid[0])

                    // store card in db
                    if(customCard){
                        addCardToDatabaseMutation.mutate({
                            card: {
                                ...customCard
                            }
                        })

                        // push to newCards
                        newCards.push({
                            card: customCard,
                            count: Number(count),
                            affinityBasedCost: getOffAffPenalty(customCard, hero),
                            cardId: customCard.id,
                            deckId: ""
                        })
                    }
            }
        }
    }
        addCardsToDeck(newCards)
    }

    return (
        <>
            <Head>
                <title>Brew</title>
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
                    isParamLoading={deckParamImport.isLoading}
                    deckDescription={deckDescription}
                    deckId={id}
                    deckName={deckName}
                    setDeckName={setDeckName}
                />
                <main className={"p-1 md:p-8 flex-1 h-full"}>
                    {isBrewing ?
                        <Cardlibrary
                            isLoadingImport={currentCardsImport == "standard" ? standardCardsImport.isLoading : currentCardsImport == "legacy" ? legacyCardsImport.isLoading : currentCardsImport == "event" ? newStandardCardsImport.isLoading : false}
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
                                resetFilter,
                                setAffinityFilters,
                                setRarityFilters
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