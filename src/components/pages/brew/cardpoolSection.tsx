import "rc-dropdown/assets/index.css";

import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

import BookIcon from "@/components/icons/bookIcon";
import FilterIcon from "@/components/icons/filterIcon";
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
              <BookIcon />
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
              <FilterIcon />
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
