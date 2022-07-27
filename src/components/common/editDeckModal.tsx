import Image from "next/image";
import slugify from "slugify";
import React, {useState} from "react";
import {DeckCard} from "../../lib/types";
import {Hero} from "@prisma/client";
import Button from "./button";
import {trpc} from "../../utils/trpc";
import {Session} from "next-auth";
import {PulseLoader} from "react-spinners";
import {useRouter} from "next/router";
import {getHeroIcon} from "../../lib/utils";

type EditDeckModalProps = {
    cards: DeckCard[],
    hero: Hero,
    deckName?: string,
    description?: string,
    toggleModal: () => void,
    session: Session | null,
    // type: "new" | "edit",
    id?: string,
}

const EditDeckModal = ({cards, hero, deckName, description, toggleModal, session, id}: EditDeckModalProps) => {

    const type = id ? "edit" : "new"

    const [deckNameValue, setDeckNameValue] = useState(deckName || "");
    const [descriptionValue, setDescriptionValue] = useState(description || "");

    const [frontCardIndex, setFrontCardIndex] = useState(0);
    const reduceFrontCardIndex = () => {
        if (frontCardIndex > 0) {
            setFrontCardIndex(frontCardIndex - 1);
        }
        else {
            setFrontCardIndex(cards.length - 1);
        }
    }
    const increaseFrontCardIndex = () => {
        if (frontCardIndex < cards.length - 1) {
            setFrontCardIndex(frontCardIndex + 1);
        }
        else {
            setFrontCardIndex(0);
        }
    }

    const router = useRouter()

    const saveDeckMutation = trpc.useMutation(["decks.save"], {
        async onSuccess(deckReponse) {
            router.push("/decks/"+deckReponse.id)
        }}
    )

    const updateDeckMutation = trpc.useMutation(["decks.update"], {
        async onSuccess() {
            router.push("/decks/"+id)
            toggleModal()
        }})


    const saveDeck = async (session: Session|null, hero: Hero, deckCards: DeckCard[], frontCardUrl: string, deckName: string, description: string, id: string | undefined) => {
        if(!session?.user || session.user.email == null){
            return
        }

        switch (type) {
            case "new":
                await saveDeckMutation.mutateAsync({
                    frontCard: frontCardUrl,
                    userEmail: session.user.email,
                    name: deckName,
                    heroId: hero.id,
                    description: description,
                    cards: deckCards.map(dc => {
                        return {
                            cardId: dc.card.id,
                            count: dc.count,
                            affinityBasedCost: dc.affinityBasedCost,
                        }
                    })
                })
                break;

            case "edit":
                if (!id) {
                    return
                }

                await updateDeckMutation.mutateAsync({
                    id: id,
                    frontCard: frontCardUrl,
                    userEmail: session.user.email,
                    name: deckName,
                    heroId: hero.id,
                    description: description,
                    cards: deckCards.map(dc => {
                        return {
                            cardId: dc.card.id,
                            count: dc.count,
                            affinityBasedCost: dc.affinityBasedCost,
                        }
                    })
                })
                break;
        }
    }

    return(
        <>
            <div
                className={"fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50 fade-in"}
                onClick={toggleModal}
            >
                <div
                    className={"grid grid-rows-6 grid-cols-6 bg-main-500 p-3 gap-2 rounded"}
                    onClick={e => e.stopPropagation()}
                >

                    {/* Hero Icon */}
                    <div className={"row-span-3 col-span-3 flex justify-center items-center"}>
                        <div className={"w-36 h-36 circle"}>
                            <Image src={getHeroIcon(hero.name)}
                                   width={150}
                                   height={150}
                                   alt={hero.name}
                                   objectFit={"contain"}
                                // layout={"fill"}
                            />
                        </div>
                    </div>

                    {/* Front Card */}
                    <div className={"row-span-4 col-span-3 bg-main-400 rounded-2xl p-1 relative"}>
                        <div
                            className={"w-full h-full bg-cover bg-no-repeat bg-center drop-shadow-xl rounded-xl"}
                            style={{backgroundImage: `url(${cards[frontCardIndex]?.card.image || "https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/a54332d0-3e5c-11eb-b033-73172d333e79.png"})`}}
                        />

                        <div className={"absolute top-0 flex justify-between items-center h-full w-[105%] -left-1.5"}>
                            <div
                                className={"bg-main-400 rounded-2xl text-main-600 hover:text-main-200 w-7 h-7 p-1 flex justify-center items-center"}
                                onClick={reduceFrontCardIndex}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </div>

                            <div
                                className={"bg-main-400 rounded-2xl text-main-600 hover:text-main-200 w-7 h-7 p-1 flex justify-center items-center"}
                                onClick={increaseFrontCardIndex}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Deck Name */}
                    <div className={"col-span-3"}>
                        <div className={"bg-main-400 p-1 flex justify-center rounded-2xl shadow"}>
                            <input
                                className={"w-full text-main-700 p-1 rounded-2xl text-center focus:outline-main-300"}
                                type="text"
                                value={deckNameValue}
                                placeholder="Deck Name..."
                                onChange={(e) => setDeckNameValue(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Deck Description */}
                    <div className={"row-span-2 col-span-6"}>
                        <div className={"bg-main-400 p-1 flex justify-center rounded-2xl shadow"}>
                        <textarea
                            className={"no-scrollbar h-20 text-center resize-none p-2 w-full text-main-700 p-1 rounded-2xl focus:outline-main-300"}
                            placeholder="Description..."
                            value={descriptionValue}
                            onChange={(e) => setDescriptionValue(e.target.value)}
                        />
                        </div>
                    </div>

                    <div className={"flex justify-between w-full col-span-6"}>
                        <div
                            className={"flex justify-center items-center p-2 hover:text-red-500 duration-200 cursor-pointer"}
                            onClick={toggleModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        {type === "new" &&
                            <Button
                                // TODO: figure out placeholder image for front card
                                onClick={() => saveDeck(session, hero, cards, cards[frontCardIndex]?.card.image || "", deckNameValue, descriptionValue, id)}
                                disabled={saveDeckMutation.isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save
                                {saveDeckMutation.isLoading &&
                                    <PulseLoader size={5} color={'#99816A'}/>
                                }
                            </Button>
                        }

                        {type === "edit" &&
                            <Button
                                onClick={() => saveDeck(session, hero, cards, cards[frontCardIndex]?.card.image || "", deckNameValue, descriptionValue, id)}
                                disabled={updateDeckMutation.isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Edit
                                {updateDeckMutation.isLoading &&
                                    <PulseLoader size={5} color={'#99816A'}/>
                                }
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}

export default EditDeckModal;