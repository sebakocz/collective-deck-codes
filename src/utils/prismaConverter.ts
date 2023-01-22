import { Affinity, Rarity, Type } from "@prisma/client";

export function AffinityToPrismaConverter(affinity: string): Affinity {
  switch (affinity) {
    case "None":
      return Affinity.NEUTRAL;
    case "Mind":
      return Affinity.MIND;
    case "Strength":
      return Affinity.STRENGTH;
    case "Spirit":
      return Affinity.SPIRIT;
    default:
      return Affinity.NEUTRAL;
  }
}

export function RarityToPrismaConverter(rarity: string): Rarity {
  switch (rarity) {
    case "Common":
      return Rarity.COMMON;
    case "Uncommon":
      return Rarity.UNCOMMON;
    case "Rare":
      return Rarity.RARE;
    case "Legendary":
      return Rarity.LEGENDARY;
    case "Undraftable":
      return Rarity.TOKEN;
    default:
      return Rarity.TOKEN;
  }
}

export function TypeToPrismaConverter(type: string): Type {
  switch (type) {
    case "Unit":
      return Type.UNIT;
    case "Action":
      return Type.ACTION;
    default:
      return Type.ACTION;
  }
}

export function StateToPrismaConverter(state: number): string[] {
  switch (state) {
    case 0:
      try {
        return ["Standard", "Legacy"];
      } catch (e) {
        return [];
      }
    case 2:
      try {
        return ["Legacy"];
      } catch (e) {
        return [];
      }
    default:
      return [];
  }
}
