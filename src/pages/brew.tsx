import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { useCardpool } from "@/lib/hooks/useCardpool";
import { useDeck } from "@/lib/hooks/useDeck";
import { sortCards } from "@/lib/hooks/useDeckCards";
import useFilter from "@/lib/hooks/useFilter";
import { noHero } from "@/lib/hooks/useHero";
import type { DeckCard } from "@/lib/types";
import { hasAffinityPenalty } from "@/lib/utils";
import { api } from "@/utils/api";

import AnalyseSection from "../components/pages/brew/analyseSection";
import CardpoolSection from "../components/pages/brew/cardpoolSection";
import OptionsSection from "../components/pages/brew/optionsSection";

const Brew: NextPage = () => {
  const { data: session } = useSession();

  const userDeck = useDeck();

  // TODO: case for useDeckQuery ??
  const router = useRouter();
  let { id } = router.query;

  if (typeof id !== "string") {
    id = "";
  }

  // TODO: I believe this should be in useEffect to only be called once
  const deckParamImport = api.decks.getById.useQuery(
    { id: id },
    {
      refetchOnReconnect: false,
      // has to be commented out in order for deck to load when just browsing the app
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const deck = data?.cards || [];
        userDeck.addCardsToDeck(deck as DeckCard[]);
        userDeck.setDeckDescription(data?.description || "");
        userDeck.setHero(data?.hero || noHero);
        userDeck.setDeckName(data?.name || "");
        userDeck.setDeckId(data?.id || "");
      },
    }
  );

  // TODO: move into CardpoolSection
  // const filters = useFilter(hero);

  // toggle to switch between brew and analyse
  const [isBrewing, setIsBrewing] = useState(true);
  const toggleBrewing = () => {
    setIsBrewing(!isBrewing);
  };

  const cardPool = useCardpool();

  const sortedCardPool = useMemo(() => {
    // apply affinity changes on hero change
    const newCardPool = cardPool.cardPool.map((card) => ({
      ...card,
      affinityPenalty: hasAffinityPenalty(
        card.card.affinity,
        userDeck.hero.affinity
      ),
    }));

    console.log("newCardPool", newCardPool);

    return sortCards(newCardPool);
  }, [cardPool.cardPool, userDeck.hero.affinity]);

  const filter = useFilter(userDeck.hero);

  const filteredCardPool = useMemo(() => {
    return filter.applyFilters(sortedCardPool);
  }, [
    sortedCardPool,
    filter.inputFilters,
    filter.affinityFilters,
    filter.rarityFilters,
    filter.miscFilters,
  ]);

  return (
    <>
      <Head>
        <title>Brew</title>
      </Head>
      <div className={"flex h-screen w-full flex-wrap"}>
        <OptionsSection
          userDeck={userDeck}
          brewing={{ isBrewing, toggleBrewing }}
          session={session}
          isLoading={deckParamImport.isLoading}
        />
        <main className={"h-full flex-1 p-1 md:p-8"}>
          {isBrewing ? (
            <CardpoolSection
              addCardsToDeck={userDeck.addCardsToDeck}
              useCardPool={cardPool}
              sortedCardpool={filteredCardPool}
              filter={filter}
              // deckCards={applyFilters(poolDeckCards)}
              // formatDropdown={<FormatDropdown changeFormat={changeFormat} />}
            />
          ) : (
            <AnalyseSection deck={userDeck.deckCards} />
          )}
        </main>
      </div>
    </>
  );
};

export default Brew;
