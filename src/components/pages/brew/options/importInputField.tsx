import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

import ImportIcon from "@/components/icons/importIcon";
import type { useDeck } from "@/lib/hooks/useDeck";
import useImporter from "@/lib/hooks/useImporter";

type ImportInputFieldProps = {
  userDeck: ReturnType<typeof useDeck>;
};

export default function ImportInputField({ userDeck }: ImportInputFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deckText, setDeckText] = useState("");
  const importer = useImporter(userDeck.hero);

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setIsLoading(true);
    setDeckText(event.currentTarget.value);
  };

  useEffect(() => {
    if (isLoading) {
      importDeckFromClipboard();
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
  }, [isLoading]);

  const importDeckFromClipboard = () => {
    const clipboard = deckText;
    console.log(clipboard);
    setDeckText("");
    console.log(clipboard);
    const lines: string[] = clipboard.split(/\r?\n/);

    // set default values
    let heroName = "No Hero";
    let deckName = "";

    if (!lines[0]) return;

    // get the deck name from the first line
    if (lines[0].startsWith("#")) {
      deckName = lines[0].slice(1).trim();
      userDeck.setDeckName(deckName);
      lines.splice(0, 1);
    }

    // get the hero from the second line
    if (lines[0].startsWith("#")) {
      heroName = lines[0].slice(8).trim().toLowerCase();
      userDeck.setHeroByName(heroName);
      lines.splice(0, 1);
    }

    const cards = importer.importCardsFromString(lines);
    if (!cards) return;
    userDeck.addCardsToDeck([...cards]);
  };

  return (
    <div className={"relative"}>
      <textarea
        disabled={isLoading}
        rows={1}
        style={{ resize: "none" }}
        placeholder={isLoading ? "" : "Import via text..."}
        onInput={handleInput}
        value={deckText}
        className={
          "no-scrollbar w-full rounded bg-main-300 p-2 shadow focus:outline-main-300 enabled:hover:bg-main-200"
        }
      />
      <div className={"absolute top-0 right-0 p-2"}>
        <ImportIcon />
      </div>
      {isLoading && (
        <PulseLoader
          size={5}
          color={"#99816A"}
          className={"absolute top-0 left-0 p-2"}
        />
      )}
    </div>
  );
}
