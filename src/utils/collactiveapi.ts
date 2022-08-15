import {Affinity, Card, Rarity, Type} from "@prisma/client";


export async function getPublicCards() {
    const public_cards =  await (await fetch('https://server.collective.gg/api/public-cards/')).json()
    return public_cards.cards
}

export async function getSingleCard(card_id: string){
    return await (await fetch("https://server.collective.gg/api/card/" + card_id)).json()
}

export async function getCustomCardById(card_id: string, card_state: number = 9){
    // TODO: you could write tests for this function

    const card_api: any = await getSingleCard(card_id)

    const atk = findProperty(card_api.card.Text.Properties, 'ATK').Expression.Value
    const hp = findProperty(card_api.card.Text.Properties, 'HP').Expression.Value

    let externals_suffix = "";
    if(Object.keys(card_api.externals).length > 0)
        externals_suffix = "-m"
    else{
        externals_suffix = "-s"
    }
    const card_link = 'https://files.collective.gg/p/cards/' + card_id + externals_suffix + '.png'

    const card: Card = {
        id:         card_id,
        name:       card_api.card.name,
        type:       TypeToPrismaConverter(card_api.card.Text.ObjectType),
        affinity:   AffinityToPrismaConverter(card_api.card.Text.Affinity),
        exclusive:  card_api.card.Text.AffinityExclusive ?? false,
        rarity:     RarityToPrismaConverter(card_api.card.Text.Rarity),
        cost:       parseInt(findProperty(card_api.card.Text.Properties, 'IGOCost').Expression.Value),
        atk:        isNaN(parseInt(atk)) ? null : parseInt(atk),
        hp:         isNaN(parseInt(hp)) ? null : parseInt(hp),
        ability:    getAbilityText(card_api),
        creator:    findProperty(card_api.card.Text.Properties, 'CreatorName').Expression.Value,
        artist:     findProperty(card_api.card.Text.Properties, 'ArtistName').Expression.Value,
        tribe:      findProperty(card_api.card.Text.Properties, 'TribalType').Expression.Value,
        realm:      findProperty(card_api.card.Text.Properties, 'Realm').Expression.Value,
        link:       card_link,
        // if you really need this consider converting to unix timestamps
        // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
        release:    new Date(card_api.card.dtReleased),
        week:       card_api.card.releaseGroup,
        image:      findProperty(card_api.card.Text.Properties, 'PortraitUrl').Expression.Value,
        state:      [card_state]
    }

    return card
}

export function findProperty(parent_node: any, symbol_name: String){

    // const card_img = findProperty(card_data.card.Text.Properties, 'PortraitUrl').Expression.Value;
    // find correct Property index
    for(let i = 0; i < parent_node.length; i++){
        if(parent_node[i].Symbol.Name === symbol_name){
            return parent_node[i];
        }
    }


    return {Expression: {Value: null}};
}

function getAbilityText(card_api: any){
    const json = card_api.card

    let ability_text = ""
    if(json.Text.PlayAbility.Properties){
        ability_text += findProperty(json.Text.PlayAbility.Properties, 'AbilityText').Expression.Value + "\n"
    }


    json.Text.Abilities.forEach((ability: any) => {
        if(ability.$type?.startsWith("Predefines.")){
            ability_text += ability.$type.substring(11) + " "
        }

        if (ability.Properties) {
            ability_text += findProperty(ability.Properties, 'AbilityText').Expression.Value + "\n"
        }
    })

    return ability_text
}


export function AffinityToPrismaConverter(affinity: string): Affinity{
    switch (affinity){
        case "None":
            return Affinity.NEUTRAL
        case "Mind":
            return Affinity.MIND
        case "Strength":
            return Affinity.STRENGTH
        case "Spirit":
            return Affinity.SPIRIT
        default:
            return Affinity.NEUTRAL
    }
}

export function RarityToPrismaConverter(rarity: string): Rarity{
    switch(rarity){
        case "Common":
            return Rarity.COMMON
        case "Uncommon":
            return Rarity.UNCOMMON
        case "Rare":
            return Rarity.RARE
        case "Legendary":
            return Rarity.LEGENDARY
        case "Undraftable":
            return Rarity.TOKEN
        default:
            return Rarity.TOKEN
    }
}

export function TypeToPrismaConverter(type: string): Type{
    switch (type){
        case "Unit":
            return Type.UNIT
        case "Action":
            return Type.ACTION
        default:
            return Type.ACTION
    }
}
