import type { Hero } from "@prisma/client";
import { Affinity, Rarity } from "@prisma/client";
import slugify from "slugify";

import noHeroImg from "../../public/nohero_icon.png";
import type { DeckCard } from "./types";

// TODO: replace DeckCard with Card for better performance
export const nameFilter = (f: DeckCard, input: string) =>
  f.card?.name.toLowerCase().includes(input);
export const tribeFilter = (f: DeckCard, input: string) =>
  f.card?.tribe?.toLowerCase().includes(input) || false;
export const realmFilter = (f: DeckCard, input: string) =>
  f.card?.realm?.toLowerCase().includes(input) || false;
export const abilityFilter = (f: DeckCard, input: string) =>
  f.card?.ability?.toLowerCase().includes(input) || false;
export const artistFilter = (f: DeckCard, input: string) =>
  f.card?.artist?.toLowerCase().includes(input) || false;
export const creatorFilter = (f: DeckCard, input: string) =>
  f.card?.creator?.toLowerCase().includes(input) || false;
export const exclusiveFilter = (f: DeckCard) => f.card?.exclusive;
export const costFilter = (f: DeckCard, input: string) =>
  f.affinityPenalty
    ? f.card?.cost + 1 === Number(input)
    : f.card?.cost === Number(input);
export const atkFilter = (f: DeckCard, input: string) =>
  f.card?.atk === Number(input);
export const hpFilter = (f: DeckCard, input: string) =>
  f.card?.hp === Number(input);
export const affinityMindFilter = (f: DeckCard) =>
  f.card?.affinity == Affinity.MIND;
export const affinityStrengthFilter = (f: DeckCard) =>
  f.card?.affinity == Affinity.STRENGTH;
export const affinitySpiritFilter = (f: DeckCard) =>
  f.card?.affinity == Affinity.SPIRIT;
export const affinityNeutralFilter = (f: DeckCard) =>
  f.card?.affinity == Affinity.NEUTRAL;
export const typeFilter = (f: DeckCard, input: string) =>
  f.card?.type == input.toUpperCase();
export const rarityCommonFilter = (f: DeckCard) =>
  f.card?.rarity == Rarity.COMMON;
export const rarityUncommonFilter = (f: DeckCard) =>
  f.card?.rarity == Rarity.UNCOMMON;
export const rarityRareFilter = (f: DeckCard) => f.card?.rarity == Rarity.RARE;
export const rarityLegendaryFilter = (f: DeckCard) =>
  f.card?.rarity == Rarity.LEGENDARY;
export const rarityTokenFilter = (f: DeckCard) =>
  f.card?.rarity == Rarity.TOKEN;

export const quickSearchUsedFilters = [
  nameFilter,
  tribeFilter,
  realmFilter,
  abilityFilter,
  artistFilter,
  creatorFilter,
];
export const quickSearchFilter = (c: DeckCard, input: string) => {
  for (let i = 0; i < quickSearchUsedFilters.length; i++) {
    if (quickSearchUsedFilters[i]?.(c, input)) {
      return true;
    }
  }
  return false;
};

export const hasAffinityPenalty = (
  card_affinity: string,
  hero_affinity: string | null
) => {
  if (
    card_affinity == Affinity.NEUTRAL ||
    hero_affinity == null ||
    hero_affinity == Affinity.NEUTRAL
  )
    return false;
  return hero_affinity != card_affinity;
};

export const exportDeckToClipboard = (
  deckName: string,
  deck: DeckCard[],
  hero: Hero
) => {
  let deckExportText = `# ${
    deckName != "" ? deckName : "Some pog deck"
  }\n# Hero: ${hero.name}`;
  deck.forEach((dc) => {
    deckExportText += `\n${dc.count} ${
      [0, 2].includes(Number(dc.card?.state)) ? dc.card?.name : dc.card?.link
    }`;
  });

  void navigator.clipboard.writeText(deckExportText);
};

export const get_rgb = (affinity: Affinity) => {
  let rgb;
  switch (affinity) {
    case Affinity.NEUTRAL:
      rgb = "#BFBBB6";
      break;
    case Affinity.MIND:
      rgb = "#2A7BDE";
      break;
    case Affinity.STRENGTH:
      rgb = "#D42248";
      break;
    case Affinity.SPIRIT:
      rgb = "#22BA29";
      break;
    default:
      rgb = "#010101";
  }
  return rgb;
};

export function getHeroIcon(heroName: string | undefined) {
  if (
    heroName == "No Hero" ||
    heroName == "" ||
    typeof heroName == "undefined"
  ) {
    return noHeroImg.src;
  }

  return `https://www.collective.gg/emotes/${slugify(heroName, {
    replacement: "",
    lower: true,
  })}_thumb.png`;
}
