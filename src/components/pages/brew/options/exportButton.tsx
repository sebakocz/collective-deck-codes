import type { Hero } from "@prisma/client";
import React, { useState } from "react";
import { PulseLoader } from "react-spinners";

import Button from "@/components/common/button";
import ExportIcon from "@/components/icons/exportIcon";
import type { DeckCard } from "@/lib/types";
import { exportDeckToClipboard } from "@/lib/utils";

type ExportButtonProps = {
  deckName: string;
  deckCards: DeckCard[];
  hero: Hero;
};

export default function ExportButton({
  deckName,
  deckCards,
  hero,
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onExport = () => {
    setIsLoading(true);
    exportDeckToClipboard(deckName, deckCards, hero);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <Button onClick={onExport} disabled={deckCards.length === 0 || isLoading}>
      {isLoading && <PulseLoader size={5} color={"#99816A"} />}
      {!isLoading && <ExportIcon />}
      Export
    </Button>
  );
}
