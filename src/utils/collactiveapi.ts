

export async function getPublicCards() {
    const public_cards =  await (await fetch('https://server.collective.gg/api/public-cards/')).json()
    return public_cards.cards
}

export async function getSingleCard(card_id: string){
    return await (await fetch("https://server.collective.gg/api/card/" + card_id)).json()
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