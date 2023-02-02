import type { Prisma } from "@prisma/client";

type Card = Prisma.CardGetPayload<{
  include: {
    pools: {
      select: {
        name: true;
      };
    };
  };
}>;

export type DeckCard = {
  card: Card | null;
  count: number;
  affinityPenalty: boolean;
};

// full deck data used for deck building
export type Deck = Prisma.DeckGetPayload<{
  include: {
    cards: {
      include: {
        card: true;
      };
    };
    hero: true;
    user: {
      select: {
        name: true;
      };
    };
    _count: {
      select: {
        favouritedBy: true;
      };
    };
  };
}>;

// fewer deck data used for deck listing
export type DeckSlot = Prisma.DeckGetPayload<{
  include: {
    hero: true;
    user: {
      select: {
        name: true;
      };
    };
    _count: {
      select: {
        favouritedBy: true;
      };
    };
  };
}>;

// created to modify the next-auth types to include the custom types: id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }
}
