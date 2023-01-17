import {Affinity, Hero, Rarity} from "@prisma/client";
import HeroDropdown from "./herodropdown";
import {DeckCard} from "../../lib/types";
import CardDisplayMini from "../common/carddisplaymini";

import Image from "next/image";
import amberImg from "../../../public/amber.png"
import React, {useState} from "react";
import {exportDeckToClipboard, getOffAffPenalty} from "../../lib/utils";
import {SessionContextValue} from "next-auth/react";
import {Session} from "next-auth";
import {trpc} from "../../utils/trpc";
import {reporter} from "next/dist/trace/report";
import {PulseLoader} from "react-spinners";
import Button from "../common/button";
import slugify from "slugify";
import EditDeckModal from "../common/editDeckModal";
import {Tooltip} from "react-tippy";
import collectiveIcon from "../../../public/collective_icon.png";

const getDeckCost = (deck: DeckCard[]) => {
    let amberSum = 0
    for(let i=0; i < deck.length; i++){
        switch (deck[i]?.card?.rarity) {
            case Rarity.COMMON:
            case Rarity.UNCOMMON:
            case Rarity.RARE:
                amberSum += 125
                break;
            case Rarity.LEGENDARY:
                amberSum += 250
                break;
        }
    }
    return amberSum
}

type OptionProps = {
    heros: Hero[],
    hero: Hero
    userDeckCards: DeckCard[],
    addCardsToDeck: (cards: DeckCard[]) => void,
    removeCardFromDeck: (card: DeckCard) => void,
    setDeck: (deck: DeckCard[]) => void,
    setHeroByName: (heroName: string) => void,
    importCardsFromString: (cards: string[]) => void,
    toggleBrewing: () => void,
    isBrewing: boolean,
    session: Session | null,
    isParamLoading: boolean,
    deckDescription: string,
    deckId: string,
    deckName: string,
    setDeckName: (name: string) => void,
}

export default function Options({heros, hero, userDeckCards, addCardsToDeck, removeCardFromDeck, setDeck, setHeroByName, importCardsFromString, toggleBrewing, isBrewing, session, isParamLoading, deckDescription, deckId, deckName, setDeckName}: OptionProps) {


    const importDeckFromClipboard = async () => {
        const clipboard = await navigator.clipboard.readText()
        let lines: string[] = clipboard.split(/\r?\n/)

        let heroName = "No Hero"
        let deckName = ""

        if(lines[0]?.startsWith('#')){
            //@ts-ignore
            deckName = lines.splice(0,1)[0].slice(1).trim()
            setDeckName(deckName)
        }

        if(lines[0]?.startsWith('#')){
            //@ts-ignore
            heroName = lines.splice(0,1)[0].slice(8).trim().toLowerCase()
            setHeroByName(heroName)
        }

        await importCardsFromString(lines)
    }


    const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false)
    const toggleEditDeckModal = () => {
        setIsEditDeckModalOpen(!isEditDeckModalOpen)
    }

    return (
        <div className={"w-full md:w-60 h-screen bg-main-500 shadow-2xl"}>
            <div className={"flex flex-col gap-3 m-3 h-[96%] relative"}>

                {isEditDeckModalOpen &&
                    <EditDeckModal
                        cards={userDeckCards}
                        hero={hero}
                        deckName={deckName}
                        toggleModal={toggleEditDeckModal}
                        description={deckDescription}
                        id={deckId}
                    />
                }

                {/* Analyse */}
                {isBrewing ?
                    <Button onClick={toggleBrewing}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analyse
                    </Button>
                :
                    <Button onClick={toggleBrewing}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Brew
                    </Button>
                }

                {/* Deck Name */}
                <div className={"bg-main-400 p-1 flex justify-center rounded-2xl shadow"}>
                    <input
                        className={"w-full text-main-700 p-1 rounded-2xl text-center focus:outline-main-300"}
                        type="text"
                        value={deckName}
                        placeholder="Deck Name..."
                        onChange={(e) => setDeckName(e.target.value)}
                    />
                </div>

                {/*  Choose Hero  */}
                <div className={"bg-main-400 p-1 flex justify-center rounded-2xl shadow"}>
                    <HeroDropdown
                        changeHero={setHeroByName}
                        heros={heros}
                        currentHero={hero}
                    />
                </div>

                {/*  Deck List Section */}
                <div
                    className={"bg-main-300 grow p-1 rounded h-[55%] shadow relative"}
                >
                    {/* Call to Action on empty list */}
                    {userDeckCards.length <= 0 ?
                        isParamLoading ?
                        <div className={"text-center italic text-main-700 p-10"}>
                            Loading...
                        </div>
                        :
                        <div className={"text-center italic text-main-700 p-10"}>
                            Import cards from your clipboard or click on images to add them!
                        </div>
                        :
                        <></>
                    }

                    {/* List of cards */}
                    {userDeckCards.length > 0 &&
                        <div className={"overflow-y-scroll overflow-hidden h-full no-scrollbar will-change-transform"}>
                            <div className={"mb-5 mt-3 w-full h-full"}>
                                {userDeckCards.map(dc => {
                                    return (
                                        <CardDisplayMini
                                            key={dc.cardId}
                                            deckCard={dc}
                                            onLeftClick={() => removeCardFromDeck(dc)}
                                            onRightClick={() => addCardsToDeck([dc])}
                                            tooltipOffset={-210}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    }

                    {/* Deck Intractables */}
                    {userDeckCards.length > 0 &&
                            <>
                                {/* Reset */}
                                <button
                                    className={"fade-in absolute -left-2 -top-2 bg-main-400 drop-shadow-xl rounded-2xl p-1 text-main-600 hover:text-red-500 duration-200"}
                                    onClick={() => setDeck([])}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                {/* Amber */}
                                <div className={"fade-in absolute p-1 pr-2 h-7 w-auto -left-2 -bottom-2 rounded-xl bg-main-400 flex items-center justify-center text-main-600"}>
                                    <div className={"w-6 flex items-center"}>
                                        <Image
                                            src={amberImg}
                                            alt={"Amber"}
                                            width={18}
                                            height={18}
                                        />
                                    </div>
                                    {getDeckCost(userDeckCards)}
                                </div>

                                {/* Deck Size */}
                                <div className={"fade-in absolute p-1 px-2 h-7 w-auto -right-2 -bottom-2 rounded-xl bg-main-400 flex items-center justify-center text-main-700"}>
                                    {userDeckCards.reduce((a,b) => a + b.count, 0)}
                                </div>
                            </>
                    }
                </div>

                {/* Import */}
                <Button onClick={() => importDeckFromClipboard()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Import
                </Button>

                {/* Save */}
                <Button
                    disabled={!session || userDeckCards.length <= 0 }
                    // onClick={saveDeck}
                    onClick={toggleEditDeckModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save
                </Button>

                {/* Export */}
                {/*@ts-ignore - https://github.com/tvkhoa/react-tippy/issues/169*/}
                <Tooltip
                    title={"Done!"}
                    trigger={'click'}
                    theme={'light'}
                    distance={5}
                    html={
                        <div className={"text-center text-main-800 p-2 w-44"}>
                            {userDeckCards.length > 0 ? "Decklist exported to clipboard!" : "You need to add cards to your deck!"}
                        </div>
                    }
                >
                    <Button
                        onClick={() => exportDeckToClipboard(deckName, userDeckCards, hero)}
                        moreClasses={"w-full"} // tippy workaround
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}