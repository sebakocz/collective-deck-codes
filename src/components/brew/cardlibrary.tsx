import {useEffect, useState} from "react";
import FilterView from "./filterview";

import 'rc-dropdown/assets/index.css';
import {quickSearchFilter} from "../../lib/utils";

import { useDebounce } from 'use-debounce';
import {DeckCard} from "../../lib/types";
import CardPoolView from "./cardpoolview";
import {FadeLoader} from "react-spinners";

const QuickSearchBar = ({filter}: any) => {

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const onInput = () => (e: any) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        filter.onInputFilter(quickSearchFilter, debouncedSearch);

    }, [debouncedSearch])

    return(
        <div className={"min-w-[300px] w-full md:w-[30vw] bg-main-400 p-1 my-6 md:m-2 flex justify-center rounded-2xl shadow"}>
            <input
                className={"w-full text-main-700 p-1 rounded-2xl text-center focus:outline-main-300"}
                type="text"
                placeholder="Search..."
                onChange={onInput()}
            />
        </div>
    )
}

type CardLibraryProps = {
    formatDropdown: JSX.Element,
    filter: any,
    deckCards: DeckCard[],
    maxCards: number,
    addCardsToDeck: (cards: DeckCard[]) => void,
    isLoadingImport: boolean,
}

export default function Cardlibrary({formatDropdown, filter, deckCards, maxCards, addCardsToDeck, isLoadingImport}: CardLibraryProps){
    const [cardpoolTab, setCardpoolTab] = useState(true)
    const toggledClass = "h-16 bg-main-300 shadow"
    const notToggledClass = "h-14 bg-main-200 mt-auto cursor-pointer hover:h-16 hover:bg-main-400"
    const tabClass = "rounded-t duration-200 flex items-center justify-around"


    return (
        <div className={"flex flex-col w-full h-full"}>
            <div className={"flex flex-wrap gap-1"}>
                <QuickSearchBar filter={filter}/>
                <div className={"flex gap-1 justify-around flex-1"}>
                    <div className={`w-[60%] min-w-[200px] ${tabClass} ${cardpoolTab ? toggledClass : notToggledClass}`}
                         onClick={() => setCardpoolTab(true)}>
                        <div className={"text-lg flex gap-1"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className={"hidden xl:block"}>Cardpool</span> ({deckCards.length || "~"}/{maxCards || "~"})
                        </div>

                        {formatDropdown}
                    </div>
                    <div className={`w-[30%] min-w-[150px] ${tabClass} ${cardpoolTab ? notToggledClass : toggledClass}`}
                         onClick={() => setCardpoolTab(false)}>
                        <div className={"text-lg flex gap-1"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </div>
                    </div>
                </div>
            </div>

            <div className={"bg-main-300 rounded flex-1 shadow-main-600 relative p-1 h-[60%]"}>
                {cardpoolTab ?
                    <>
                        {isLoadingImport ?
                            <div className={"mt-20 w-full flex justify-center"}>
                                <FadeLoader color={"#99816A"} height={50} width={20} margin={50}/>
                            </div>
                        :
                            <CardPoolView
                                deckCards={deckCards}
                                addCardsToDeck={addCardsToDeck}
                            />
                        }
                    </>
                    :
                    <FilterView
                        filter={filter}/>
                }
            </div>
        </div>
    )
}