import {Affinity, Card, Hero, Rarity} from "@prisma/client";
import {DeckCard} from "./types";
import slugify from "slugify";
import noHeroImg from "../../public/nohero_icon.png"

export const nameFilter = (f:DeckCard, input:string) => f.card.name.toLowerCase().includes(input)
export const tribeFilter = (f:DeckCard, input:string) => f.card.tribe?.toLowerCase().includes(input)
export const realmFilter = (f:DeckCard, input:string) => f.card.realm?.toLowerCase().includes(input)
export const abilityFilter = (f:DeckCard, input:string) => f.card.ability?.toLowerCase().includes(input)
export const artistFilter = (f:DeckCard, input:string) => f.card.artist?.toLowerCase().includes(input)
export const creatorFilter = (f:DeckCard, input:string) => f.card.creator?.toLowerCase().includes(input)
export const exclusiveFilter = (f:DeckCard) => !f.card.exclusive
export const costFilter = (f:DeckCard, input: number) => f.affinityBasedCost === Number(input)
export const atkFilter = (f:DeckCard, input: number) => f.card.atk === Number(input)
export const hpFilter = (f:DeckCard, input: number) => f.card.hp === Number(input)
export const affinityMindFilter = (f:DeckCard) => f.card.affinity == Affinity.MIND
export const affinityStrengthFilter = (f:DeckCard) => f.card.affinity == Affinity.STRENGTH
export const affinitySpiritFilter = (f:DeckCard) => f.card.affinity == Affinity.SPIRIT
export const affinityNeutralFilter = (f:DeckCard) => f.card.affinity == Affinity.NEUTRAL
export const typeFilter = (f:DeckCard, input: string) => f.card.type == input.toUpperCase()
export const rarityCommonFilter = (f:DeckCard) => f.card.rarity == Rarity.COMMON
export const rarityUncommonFilter = (f:DeckCard) => f.card.rarity == Rarity.UNCOMMON
export const rarityRareFilter = (f:DeckCard) => f.card.rarity == Rarity.RARE
export const rarityLegendaryFilter = (f:DeckCard) => f.card.rarity == Rarity.LEGENDARY
export const rarityTokenFilter = (f:DeckCard) => f.card.rarity == Rarity.TOKEN

export const quickSearchUsedFilters = [nameFilter, tribeFilter, realmFilter, abilityFilter, artistFilter, creatorFilter]
export const quickSearchFilter = (c:DeckCard, input:string) => {
    for(let i=0; i < quickSearchUsedFilters.length; i++){
        // @ts-ignore
        if(quickSearchUsedFilters[i](c, input)){
            return true
        }
    }
    return false
}


export const getOffAffPenalty = (card: Card, hero: Hero) => {
    if (card.affinity == Affinity.NEUTRAL || hero.affinity == null || hero.affinity == Affinity.NEUTRAL)
        return card.cost
    return hero.affinity != card.affinity ? card.cost+1 : card.cost;
}

export const sortCards = (cards: DeckCard[]) => {
    return cards
        .sort((a,b) => a.card.name.localeCompare(b.card.name, undefined, { numeric: true }))
        .sort((a,b) => (a.affinityBasedCost - b.affinityBasedCost))
}

export const noHero: Hero = {
    id: 0,
    name: "No Hero",
    affinity: null,
    deckId: "",
}

export const exportDeckToClipboard = (deckName: string, deck: DeckCard[], hero: Hero) => {
    let deckExportText = `# ${deckName != "" ? deckName : "Some pog deck"}\n# Hero: ${hero.name}`
    deck.forEach(dc => {
        deckExportText += `\n${dc.count} ${[0,2].includes(Number(dc.card.state)) ? dc.card.name : dc.card.link}`
    })

    navigator.clipboard.writeText(deckExportText)
}

export const get_rgb = (affinity: Affinity) => {
    let rgb
    switch (affinity) {
        case Affinity.NEUTRAL:
            rgb = "#BFBBB6"
            break
        case Affinity.MIND:
            rgb = "#2A7BDE"
            break
        case Affinity.STRENGTH:
            rgb = "#D42248"
            break
        case Affinity.SPIRIT:
            rgb = "#22BA29"
            break
        default:
            rgb = "#010101"
    }
    return rgb
}

export function getHeroIcon(heroName: string | undefined){
    if (heroName == "No Hero" || heroName == "" || typeof heroName == "undefined"){
        return noHeroImg.src
    }

    return `https://www.collective.gg/emotes/${slugify(heroName, {replacement: '', lower: true})}_thumb.png`
}