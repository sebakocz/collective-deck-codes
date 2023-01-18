import {Prisma} from "@prisma/client";

export type DeckCard = Prisma.CardsOnDecksGetPayload<{
    include: {
        card: true,
        cardIdHistory: false,
    }
}>

export type Deck = Prisma.DeckGetPayload<{
    include: {
        cards: {
            include: {
                card: true
            }
        }
        hero: true,
        user: {
            select: {
                name: true
            }
        },
        _count: {
            select: {
                favouritedBy: true,
            }
        }
    }
}>

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