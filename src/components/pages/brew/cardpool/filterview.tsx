import manaCircle_Mind from "@public/builder/bluemanacircle.png";
import cardBackground_Unit from "@public/builder/cardbackground-unit-small.png";
import rarityCommon from "@public/builder/common.png";
import exclusiveStar from "@public/builder/exclusive-star.png";
import manaCircle_Spirit from "@public/builder/greenmanacircle.png";
import manaCircle_Neutral from "@public/builder/greymanacircle.png";
import rarityLegendary from "@public/builder/legendary.png";
import rarityRare from "@public/builder/rare.png";
import manaCircle_Strength from "@public/builder/redmanacircle.png";
import rarityUncommon from "@public/builder/uncommon.png";
import rarityToken from "@public/builder/undraftable.png";
import Image from "next/image";
import { useState } from "react";

import RefreshIcon from "@/components/icons/refreshIcon";
import type useFilter from "@/lib/hooks/useFilter";
import {
  abilityFilter,
  affinityMindFilter,
  affinityNeutralFilter,
  affinitySpiritFilter,
  affinityStrengthFilter,
  artistFilter,
  atkFilter,
  costFilter,
  creatorFilter,
  exclusiveFilter,
  hpFilter,
  nameFilter,
  rarityCommonFilter,
  rarityLegendaryFilter,
  rarityRareFilter,
  rarityTokenFilter,
  rarityUncommonFilter,
  realmFilter,
  tribeFilter,
  typeFilter,
} from "@/lib/utils";

type FilterViewProps = {
  filter: ReturnType<typeof useFilter>;
};

export default function FilterView({ filter }: FilterViewProps) {
  const [currentTooltip, setCurrentTooltip] = useState(
    "Hover on something for an explanation!"
  );
  const tooltipDict = {
    unit_action_toggle:
      "Switch between searching for units or actions. Default is both.",
    more_options:
      "This will be resetting and adding more filters for more complex searching, imagine it being like logical operations. (AND, OR...)",
    reset: "Resets all filters.",
    rarity:
      "The Rarity of the card. Default is excluding tokens. Right click to toggle all but one.",
    atk: "Attack value. You can use additional terms like > or < for more advanced filtering.",
    hp: "Health value. You can use additional terms like > or < for more advanced filtering.",
    mana_cost:
      "Mana cost value. You can use additional terms like > or < for more advanced filtering.",
    designer:
      "Designer(s) included in the creation of the card. Use ',' to only see cards from collaborations between multiple designers.",
    artist:
      "Artist(s) included in the creation of the card. Use ',' to only see cards from collaborations between multiple artists.",
    tribes:
      "The tribe list of the card. Use ',' to only see cards with those multiple tribes.",
    realm: "The realm of the card.",
    ability:
      'Look for whole words, parts of words or keywords. Use double parentheses ("" "") if you want to be explicit.',
    name: "The name of the card.",
    exclusive:
      "Some cards are exclusive - they are only usable by heroes with the same affinity.",
    affinity:
      "The affinity of the card. Default includes all affinities. Right click to toggle all but one.",
  };

  const [toggleOffset, setToggleOffset] = useState(() => {
    const input = filter.getInputFilter(typeFilter);
    if (input == "unit") {
      return "-108%";
    }
    if (input == "action") {
      return "113%";
    }
    return "0";
  });
  const OnToggleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    offset: string,
    type: string
  ) => {
    if (e.target.checked) {
      filter.onInputFilter(typeFilter, type);
      setToggleOffset(offset);
    }
  };

  const currentType = filter.getInputFilter(typeFilter);

  return (
    <div
      className={
        "flex h-full flex-wrap items-center justify-center gap-20 overflow-y-scroll"
      }
    >
      {/* Card Input Window */}
      <div className={"relative h-[476px] w-[320px] text-white"}>
        {/* Background */}
        <Image
          src={cardBackground_Unit}
          alt={""}
          width={320}
          height={476}
          priority
        />

        {/* Card Cost / Affinity / Exclusivity */}
        <div className={"absolute top-4 right-4"}>
          <Image
            src={manaCircle_Neutral}
            alt={""}
            width={50}
            height={50}
            priority
          />

          <input
            className={
              "card-cost-ring filter-input card-display-text-stats absolute -top-1 -left-1 h-[58px] w-[58px] text-center"
            }
            placeholder={"-"}
            onMouseEnter={() => setCurrentTooltip(tooltipDict.mana_cost)}
            onChange={(e) => filter.onInputFilter(costFilter, e.target.value)}
            value={filter.getInputFilter(costFilter)}
          />

          <div
            className={"flex flex-col items-center justify-center"}
            onMouseEnter={() => setCurrentTooltip(tooltipDict.affinity)}
          >
            <div
              onClick={() => filter.toggleAffinityFilter(affinityNeutralFilter)}
              // Right click to toggle all but one
              onContextMenu={(e) => {
                e.preventDefault();
                filter.setAffinityFilters([affinityNeutralFilter]);
              }}
              className={`filter-input`}
            >
              <div
                className={`${
                  filter.affinityFilterExists(affinityNeutralFilter)
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={manaCircle_Neutral}
                  alt={"Mana Circle Neutral"}
                  width={35}
                  height={35}
                />
              </div>
            </div>
            <div
              onClick={() =>
                filter.toggleAffinityFilter(affinityStrengthFilter)
              }
              // Right click to toggle all but one
              onContextMenu={(e) => {
                e.preventDefault();
                filter.setAffinityFilters([affinityStrengthFilter]);
              }}
              className={`filter-input`}
            >
              <div
                className={`${
                  filter.affinityFilterExists(affinityStrengthFilter)
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={manaCircle_Strength}
                  alt={"Mana Circle Strength"}
                  width={35}
                  height={35}
                />
              </div>
            </div>
            <div
              onClick={() => filter.toggleAffinityFilter(affinitySpiritFilter)}
              // Right click to toggle all but one
              onContextMenu={(e) => {
                e.preventDefault();
                filter.setAffinityFilters([affinitySpiritFilter]);
              }}
              className={`filter-input`}
            >
              <div
                className={`${
                  filter.affinityFilterExists(affinitySpiritFilter)
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={manaCircle_Spirit}
                  alt={"Mana Circle Spirit"}
                  width={35}
                  height={35}
                />
              </div>
            </div>
            <div
              onClick={() => filter.toggleAffinityFilter(affinityMindFilter)}
              // Right click to toggle all but one
              onContextMenu={(e) => {
                e.preventDefault();
                filter.setAffinityFilters([affinityMindFilter]);
              }}
              className={`filter-input`}
            >
              <div
                className={`${
                  filter.affinityFilterExists(affinityMindFilter)
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={manaCircle_Mind}
                  alt={"Mana Circle Mind"}
                  width={35}
                  height={35}
                />
              </div>
            </div>

            <div
              onMouseEnter={() => setCurrentTooltip(tooltipDict.exclusive)}
              onClick={() => filter.toggleMiscFilter(exclusiveFilter)}
              className={`filter-input`}
            >
              <div
                className={`${
                  !filter.miscFilterExists(exclusiveFilter)
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  src={exclusiveStar}
                  alt={"Exclusive Star"}
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card HP */}
        <input
          className={
            "filter-input background-none card-display-text-stats absolute bottom-[28px] right-[31px] h-[47px] w-[47px] text-center"
          }
          placeholder={"-"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.hp)}
          onChange={(e) => filter.onInputFilter(hpFilter, e.target.value)}
          value={filter.getInputFilter(hpFilter)}
        />

        {/* Card ATK */}
        <input
          className={
            "filter-input background-none card-display-text-stats absolute bottom-[28px] left-[28px] h-[47px] w-[47px] text-center"
          }
          placeholder={"-"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.atk)}
          onChange={(e) => filter.onInputFilter(atkFilter, e.target.value)}
          value={filter.getInputFilter(atkFilter)}
        />

        {/*  Card Ability  */}
        <textarea
          className={
            "filter-input background-none card-display-text-ability absolute top-[290px] left-[65px] h-[110px] w-[190px] text-center"
          }
          placeholder={"(Ability Text)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.ability)}
          onChange={(e) => filter.onInputFilter(abilityFilter, e.target.value)}
          value={filter.getInputFilter(abilityFilter)}
        />

        {/* Card Name */}
        <input
          className={
            "filter-input background-none card-display-text-name absolute top-[220px] left-[60px] h-[25px] w-[200px] text-center"
          }
          placeholder={"(Card Name)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.name)}
          onChange={(e) => filter.onInputFilter(nameFilter, e.target.value)}
          value={filter.getInputFilter(nameFilter)}
        />

        {/*  Card Tribes  */}
        <input
          className={
            "filter-input background-none card-display-text-normal absolute top-[245px] left-[55px] h-[20px] w-[120px] text-center"
          }
          placeholder={"(Tribes)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.tribes)}
          onChange={(e) => filter.onInputFilter(tribeFilter, e.target.value)}
          value={filter.getInputFilter(tribeFilter)}
        />

        {/*  Card Realm  */}
        <input
          className={
            "filter-input background-none card-display-text-normal absolute top-[245px] left-[180px] h-[20px] w-[80px] text-center"
          }
          placeholder={"(Realm)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.realm)}
          onChange={(e) => filter.onInputFilter(realmFilter, e.target.value)}
          value={filter.getInputFilter(realmFilter)}
        />

        {/*  Card Designer   */}
        <input
          className={
            "filter-input background-none card-display-text-normal absolute bottom-[47px] left-[100px] h-[15px] w-[130px] text-center"
          }
          placeholder={"(Designer)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.designer)}
          onChange={(e) => filter.onInputFilter(creatorFilter, e.target.value)}
          value={filter.getInputFilter(creatorFilter)}
        />

        {/*  Card Artist   */}
        <input
          className={
            "filter-input background-none card-display-text-normal absolute bottom-[33px] left-[100px] h-[15px] w-[130px] text-center"
          }
          placeholder={"(Artist)"}
          onMouseEnter={() => setCurrentTooltip(tooltipDict.artist)}
          onChange={(e) => filter.onInputFilter(artistFilter, e.target.value)}
          value={filter.getInputFilter(artistFilter)}
        />

        {/*  Card Rarity   */}
        <div
          className={
            "absolute top-[265px] left-[88px] flex h-[25px] w-full gap-1"
          }
          onMouseEnter={() => setCurrentTooltip(tooltipDict.rarity)}
        >
          <div
            className={"filter-input"}
            onClick={() => filter.toggleRarityFilter(rarityTokenFilter)}
            // Right click to toggle all but one
            onContextMenu={(e) => {
              e.preventDefault();
              filter.setRarityFilters([rarityTokenFilter]);
            }}
          >
            <div
              className={`${
                filter.rarityFilterExists(rarityTokenFilter)
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <Image
                src={rarityToken}
                alt={"Rarity Token"}
                width={27}
                height={27}
              />
            </div>
          </div>

          <div
            className={"filter-input"}
            onClick={() => filter.toggleRarityFilter(rarityCommonFilter)}
            // Right click to toggle all but one
            onContextMenu={(e) => {
              e.preventDefault();
              filter.setRarityFilters([rarityCommonFilter]);
            }}
          >
            <div
              className={`${
                filter.rarityFilterExists(rarityCommonFilter)
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <Image
                src={rarityCommon}
                alt={"Rarity Common"}
                width={27}
                height={27}
              />
            </div>
          </div>

          <div
            className={"filter-input"}
            onClick={() => filter.toggleRarityFilter(rarityUncommonFilter)}
            // Right click to toggle all but one
            onContextMenu={(e) => {
              e.preventDefault();
              filter.setRarityFilters([rarityUncommonFilter]);
            }}
          >
            <div
              className={`${
                filter.rarityFilterExists(rarityUncommonFilter)
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <Image
                src={rarityUncommon}
                alt={"Rarity Uncommon"}
                width={27}
                height={27}
              />
            </div>
          </div>

          <div
            className={"filter-input"}
            onClick={() => filter.toggleRarityFilter(rarityRareFilter)}
            // Right click to toggle all but one
            onContextMenu={(e) => {
              e.preventDefault();
              filter.setRarityFilters([rarityRareFilter]);
            }}
          >
            <div
              className={`${
                filter.rarityFilterExists(rarityRareFilter)
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <Image
                src={rarityRare}
                alt={"Rarity Rare"}
                width={27}
                height={27}
              />
            </div>
          </div>

          <div
            className={"filter-input"}
            onClick={() => filter.toggleRarityFilter(rarityLegendaryFilter)}
            // Right click to toggle all but one
            onContextMenu={(e) => {
              e.preventDefault();
              filter.setRarityFilters([rarityLegendaryFilter]);
            }}
          >
            <div
              className={`${
                filter.rarityFilterExists(rarityLegendaryFilter)
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            >
              <Image
                src={rarityLegendary}
                alt={"Rarity Legendary"}
                width={27}
                height={27}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip & Type Toggle*/}
      <div
        className={"flex flex-col items-center"}
        onMouseEnter={() => setCurrentTooltip(tooltipDict.unit_action_toggle)}
      >
        <div className={"filterToggle"}>
          <div key={"r-unit"} className={"filterToggleText"}>
            <input
              onChange={(e) => OnToggleChange(e, "-108%", "UNIT")}
              id={"r-unit"}
              type="radio"
              name="yc-form-switch"
              value="unit"
              checked={currentType == "unit"}
            />
            <label htmlFor="r-unit">Unit</label>
          </div>
          <div key={"r-both"} className={"filterToggleText"}>
            {/* use defaultChecked NOT checked in react! else on each switch it changes back to checked item */}
            <input
              id={"r-both"}
              type="radio"
              name="yc-form-switch"
              value="both"
              checked={!currentType}
              onChange={(e) => OnToggleChange(e, "0", "")}
            />
            <label htmlFor="r-both">Both</label>
          </div>
          <div key={"r-action"} className={"filterToggleText"}>
            <input
              onChange={(e) => OnToggleChange(e, "113%", "ACTION")}
              id={"r-action"}
              type="radio"
              name="yc-form-switch"
              value="action"
              checked={currentType == "action"}
            />
            <label htmlFor="r-action">Action</label>
          </div>
          <div
            className={"filterToggleSwitchIndicator"}
            style={{ transform: `translateX(${toggleOffset})` }}
          />
        </div>

        <div className={"h-80 w-64 bg-main-400 p-5 shadow-xl"}>
          <div className={"text-xs"}>Tooltip:</div>
          <div className={"italic"}>{currentTooltip}</div>
        </div>
      </div>

      {/* Filter Refresh Icon */}
      <div
        className={
          "cursor-pointer text-main-700 duration-500 hover:rotate-180 hover:text-main-500"
        }
        onMouseEnter={() => setCurrentTooltip(tooltipDict.reset)}
        onClick={() => {
          filter.resetFilter();
          setToggleOffset("0");
        }}
      >
        <RefreshIcon />
      </div>
    </div>
  );
}
