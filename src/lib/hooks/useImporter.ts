import type { Hero } from "@prisma/client";

import type { DeckCard } from "@/lib/types";
import { hasAffinityPenalty } from "@/lib/utils";
import { api } from "@/utils/api";
import { getCustomCardById } from "@/utils/collactiveapi";

export default function useImporter(hero: Hero) {
  const allCardsImport = api.cards.getAll.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const allCards = allCardsImport.data || [];

  const importCardsFromString = async (cardsString: string[]) => {
    console.log("importing cards");
    console.log(cardsString);

    const newCards: DeckCard[] = [];
    for (let i = 0; i < cardsString.length; i++) {
      const line = cardsString[i];
      if (line?.startsWith("#") || !line) {
        continue;
      }

      const count: number = parseInt(line.charAt(0));
      const name = line.slice(1).trim();
      if (!count || !name) {
        return;
      }

      // try to fetch id from line
      const card_uid =
        /([a-z]|[0-9]){8}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){4}-([a-z]|[0-9]){12}/.exec(
          name
        )?.[0];

      // use id/name to find card in db
      const card = allCards.find((c) => c.id == card_uid || c.name == name);
      if (card) {
        newCards.push({
          card: card,
          count: Number(count),
          affinityPenalty: hasAffinityPenalty(card.affinity, hero.affinity),
        });
        continue;
      }

      // if not found in db but a valid card id, fetch and push to decklist
      if (card_uid) {
        // get Card via fetching from Collective API
        const customCard = await getCustomCardById(card_uid);

        if (customCard) {
          // TODO: setting correct affinityBasedCost should not be the responsibility of the importer
          // push to newCards
          newCards.push({
            card: customCard,
            count: Number(count),
            affinityPenalty: hasAffinityPenalty(
              customCard.affinity as string,
              hero.affinity
            ),
          });
        }
      }
    }

    return newCards || [];
  };

  return {
    importCardsFromString,
  };
}
