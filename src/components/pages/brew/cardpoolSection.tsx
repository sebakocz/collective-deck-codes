import "rc-dropdown/assets/index.css";

import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

import FormatDropdown from "@/components/pages/brew/cardpool/formatdropdown";
import type { useCardpool } from "@/lib/hooks/useCardpool";
import type { InputFilter } from "@/lib/hooks/useFilter";
import type useFilter from "@/lib/hooks/useFilter";
import type { DeckCard } from "@/lib/types";
import { quickSearchFilter } from "@/lib/utils";

import CardPoolView from "./cardpool/cardpoolview";
import FilterView from "./cardpool/filterview";

const QuickSearchBar = ({
  onInputFilter,
}: {
  onInputFilter: (filter: InputFilter["func"], input: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const onInput = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    onInputFilter(quickSearchFilter, debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div
      className={
        "my-6 flex w-full min-w-[300px] justify-center rounded-2xl bg-main-400 p-1 shadow md:m-2 md:w-[30vw]"
      }
    >
      <input
        className={
          "w-full rounded-2xl p-1 text-center text-main-700 focus:outline-main-300"
        }
        type="text"
        placeholder="Search..."
        onChange={onInput()}
      />
    </div>
  );
};

type CardLibraryProps = {
  addCardsToDeck: (cards: DeckCard[]) => void;
  useCardPool: ReturnType<typeof useCardpool>;
  sortedCardpool: DeckCard[];
  filter: ReturnType<typeof useFilter>;
};

export default function CardpoolSection({
  addCardsToDeck,
  useCardPool,
  sortedCardpool,
  filter,
}: CardLibraryProps) {
  // const { cardPool, setCardPool, cardPoolList } = useCardPool;

  const [cardpoolTab, setCardpoolTab] = useState(true);

  // TODO: maybe use useMemo to transform the cardpool Card[] to DeckCard[]?
  // const filteredCardPool = filter.applyFilters(cardPool.data || []);

  const toggledClass = "h-16 bg-main-300 shadow";
  const notToggledClass =
    "h-14 bg-main-200 mt-auto cursor-pointer hover:h-16 hover:bg-main-400";
  const tabClass = "rounded-t duration-200 flex items-center justify-around";

  return (
    <div className={"flex h-full w-full flex-col"}>
      <div className={"flex flex-wrap gap-1"}>
        <QuickSearchBar onInputFilter={filter.onInputFilter} />
        <div className={"flex flex-1 justify-around gap-1"}>
          <div
            className={`w-[60%] min-w-[200px] ${tabClass} ${
              cardpoolTab ? toggledClass : notToggledClass
            }`}
            onClick={() => setCardpoolTab(true)}
          >
            <div className={"flex gap-1 text-lg"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className={"hidden xl:block"}>Cardpool</span> (
              {sortedCardpool.length || "~"}/
              {useCardPool.cardPool.length || "~"})
            </div>

            <FormatDropdown useCardpool={useCardPool} />
          </div>
          <div
            className={`w-[30%] min-w-[150px] ${tabClass} ${
              cardpoolTab ? notToggledClass : toggledClass
            }`}
            onClick={() => setCardpoolTab(false)}
          >
            <div className={"flex gap-1 text-lg"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          "relative h-[60%] flex-1 rounded bg-main-300 p-1 shadow-main-600"
        }
      >
        {cardpoolTab ? (
          <>
            {useCardPool.isFetching ? (
              <div className={"mt-20 flex w-full justify-center"}>
                <FadeLoader
                  color={"#99816A"}
                  height={50}
                  width={20}
                  margin={50}
                />
              </div>
            ) : (
              <CardPoolView
                deckCards={sortedCardpool}
                addCardsToDeck={addCardsToDeck}
              />
            )}
          </>
        ) : (
          <FilterView filter={filter} />
        )}
      </div>
    </div>
  );
}
