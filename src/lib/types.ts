import {Prisma} from "@prisma/client";

export type DeckCard = Prisma.CardsOnDecksGetPayload<{
    include: {
        card: true
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
        }
    }
}>