import { Prisma } from "@prisma/client";
import {
  AffinityToPrismaConverter,
  RarityToPrismaConverter,
  TypeToPrismaConverter,
} from "@/utils/prismaConverter";
import Bottleneck from "bottleneck";

export async function getPublicCards() {
  const public_cards = await (
    await fetch("https://server.collective.gg/api/public-cards/")
  ).json();
  return public_cards.cards;
}

export async function getSingleCard(card_id) {
  return await (
    await fetch("https://server.collective.gg/api/card/" + card_id)
  ).json();
}

export async function getCustomCardById(card_id, card_state = 9) {
  // TODO: you could write tests for this function

  const card_api = await getSingleCard(card_id);

  const atk = findProperty(card_api.card.Text.Properties, "ATK").Expression
    .Value;
  const hp = findProperty(card_api.card.Text.Properties, "HP").Expression.Value;

  let externals_suffix;
  if (Object.keys(card_api.externals).length > 0) externals_suffix = "-m";
  else {
    externals_suffix = "-s";
  }
  const card_link =
    "https://files.collective.gg/p/cards/" +
    card_id +
    externals_suffix +
    ".png";

  const card = {
    id: card_id,
    name: card_api.card.name,
    type: TypeToPrismaConverter(card_api.card.Text.ObjectType),
    affinity: AffinityToPrismaConverter(card_api.card.Text.Affinity),
    exclusive: card_api.card.Text.AffinityExclusive ?? false,
    rarity: RarityToPrismaConverter(card_api.card.Text.Rarity),
    cost: parseInt(
      findProperty(card_api.card.Text.Properties, "IGOCost").Expression.Value
    ),
    atk: isNaN(parseInt(atk)) ? null : parseInt(atk),
    hp: isNaN(parseInt(hp)) ? null : parseInt(hp),
    ability: getAbilityText(card_api),
    creator: findProperty(card_api.card.Text.Properties, "CreatorName")
      .Expression.Value,
    artist: findProperty(card_api.card.Text.Properties, "ArtistName").Expression
      .Value,
    tribe: findProperty(card_api.card.Text.Properties, "TribalType").Expression
      .Value,
    realm: findProperty(card_api.card.Text.Properties, "Realm").Expression
      .Value,
    link: card_link,
    // if you really need this consider converting to unix timestamps
    // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
    release: new Date(card_api.card.dtReleased),
    week: card_api.card.releaseGroup,
    image: findProperty(card_api.card.Text.Properties, "PortraitUrl").Expression
      .Value,
    state: card_state,
    //     TODO: add pools, connect?
  };

  return card;
}

export function findProperty(parent_node, symbol_name) {
  // const card_img = findProperty(card_data.card.Text.Properties, 'PortraitUrl').Expression.Value;
  // find correct Property index
  for (let i = 0; i < parent_node.length; i++) {
    if (parent_node[i].Symbol.Name === symbol_name) {
      return parent_node[i];
    }
  }

  return { Expression: { Value: null } };
}

function getAbilityText(card_api) {
  const json = card_api.card;

  let ability_text = "";
  if (json.Text.PlayAbility.Properties) {
    ability_text +=
      findProperty(json.Text.PlayAbility.Properties, "AbilityText").Expression
        .Value + "\n";
  }

  json.Text.Abilities.forEach((ability) => {
    if (ability.$type?.startsWith("Predefines.")) {
      ability_text += ability.$type.substring(11) + " ";
    }

    if (ability.Properties) {
      ability_text +=
        findProperty(ability.Properties, "AbilityText").Expression.Value + "\n";
    }
  });

  return ability_text;
}

export async function getPublicCardsAsCards() {
  const limiter = new Bottleneck({
    maxConcurrent: 50,
    minTime: 100,
  });

  limiter.on("done", (info) => {
    console.log(info.options.id, "finished");
  });

  const new_card_list = [];
  const public_cards = await getPublicCards();

  const card_ids = public_cards.map((card) => card.uid);
  const cards_data = await Promise.all(
    card_ids.map(async (card_id, index) => {
      return await limiter.schedule(
        { id: card_id + "---" + index + "/" + card_ids.length },
        async () => {
          return await getSingleCard(card_id);
        }
      );
    })
  );

  for (
    let public_index = 0;
    public_index < public_cards.length;
    public_index++
  ) {
    const card_id = public_cards[public_index].uid;
    // const card_api: any = await getSingleCard(card_id)
    const card_api = cards_data[public_index];
    console.log("Processing: " + card_api.card.name);
    const atk = findProperty(card_api.card.Text.Properties, "ATK").Expression
      .Value;
    const hp = findProperty(card_api.card.Text.Properties, "HP").Expression
      .Value;
    const new_card = {
      id: card_id,
      name: card_api.card.name,
      type: TypeToPrismaConverter(card_api.card.Text.ObjectType),
      affinity: AffinityToPrismaConverter(card_api.card.Text.Affinity),
      // ?? -> default values - in case something is broken in the json
      exclusive: card_api.card.Text.AffinityExclusive ?? false,
      rarity: RarityToPrismaConverter(card_api.card.Text.Rarity),
      cost: parseInt(
        findProperty(card_api.card.Text.Properties, "IGOCost").Expression.Value
      ),
      atk: isNaN(parseInt(atk)) ? null : parseInt(atk),
      hp: isNaN(parseInt(hp)) ? null : parseInt(hp),
      ability: public_cards[public_index].static_text,
      creator: findProperty(card_api.card.Text.Properties, "CreatorName")
        .Expression.Value,
      artist: findProperty(card_api.card.Text.Properties, "ArtistName")
        .Expression.Value,
      tribe: findProperty(card_api.card.Text.Properties, "TribalType")
        .Expression.Value,
      realm: public_cards[public_index].realm,
      link: public_cards[public_index].imgurl || "",
      // if you really need this consider converting to unix timestamps
      // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
      release: new Date(card_api.card.dtReleased).toISOString(),
      image: findProperty(card_api.card.Text.Properties, "PortraitUrl")
        .Expression.Value,
      state: public_cards[public_index].approval_state ?? 9,
    };

    new_card_list.push(new_card);
  }

  return new_card_list;
}
