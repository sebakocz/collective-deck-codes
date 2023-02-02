import { useRef, useState } from "react";

import CardDisplay from "@/components/common/carddisplay";
import type { DeckCard } from "@/lib/types";

type CardPoolViewProps = {
  deckCards?: DeckCard[];
  addCardsToDeck: (cards: DeckCard[]) => void;
};

export default function CardPoolView({
  deckCards,
  addCardsToDeck,
}: CardPoolViewProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop } = event.target as HTMLDivElement;
    setScrollTop(scrollTop);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const cardHeight = 309.4;
  const cardWidth = 208;
  const cardsPerRow = Math.floor(
    (containerRef?.current?.clientWidth || 300) / cardWidth
  );
  const totalheight = ((deckCards?.length || 0) / cardsPerRow) * cardHeight;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / cardHeight) * cardsPerRow - cardsPerRow * 3
  );
  const endIndex = Math.min(
    deckCards?.length || 0,
    Math.ceil(
      (scrollTop + (containerRef?.current?.clientHeight || 3000)) / cardHeight
    ) *
      cardsPerRow +
      cardsPerRow * 3
  );

  return (
    <>
      <div
        className={
          "h-full overflow-x-hidden overflow-y-scroll will-change-transform scrollbar-thin scrollbar-thumb-main-400"
        }
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div
          className={"flex flex-wrap content-start justify-center"}
          style={{
            paddingTop: (startIndex / cardsPerRow) * cardHeight || 0,
            height: totalheight,
          }}
        >
          {deckCards?.slice(startIndex, endIndex).map((dc) => {
            return (
              <div
                key={dc.card?.id}
                onClick={() => addCardsToDeck([{ ...dc }])}
              >
                <CardDisplay key={dc.card?.id} dc={dc} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
