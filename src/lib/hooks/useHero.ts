import type { Hero } from "@prisma/client";
import { useState } from "react";

import { api } from "@/utils/api";

export const noHero: Hero = {
  id: 0,
  name: "No Hero",
  affinity: null,
  deckId: "",
};

export default function useHero() {
  const [hero, setHero] = useState<Hero>(noHero);

  const herosImport = api.heros.getAll.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const setHeroByName = (name: string) => {
    let newHero = herosImport.data?.find(
      (h: Hero) => h.name.toLowerCase() == name
    );
    if (!newHero) newHero = noHero;
    setHero(newHero);
  };

  return {
    hero,
    setHero,
    setHeroByName,
    heroList: [noHero, ...(herosImport.data || [])],
  };
}
