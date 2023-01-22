import type { Hero } from "@prisma/client";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";
import { useState } from "react";

type HeroDropdownProps = {
  changeHero: (hero: string) => void;
  heros: Hero[];
  currentHero: Hero;
};

export default function HeroDropdown({
  changeHero,
  heros,
  currentHero,
}: HeroDropdownProps) {
  const hero_options = heros.map((hero: Hero) => hero.name);
  const [hero, setHero] = useState(hero_options[0]);
  const menu = (
    <Menu
      onSelect={onSelect}
      // force-over-writing the default menu style to make it look better
      style={{ background: "none", border: "none", boxShadow: "none" }}
    >
      {hero_options.map((hero, index) => {
        return (
          <MenuItem
            key={index}
            className={
              "cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl bg-main-300 text-center text-lg shadow hover:bg-main-200"
            }
            style={{ marginTop: "0.1rem" }}
          >
            {hero}
          </MenuItem>
        );
      })}
    </Menu>
  );

  function onSelect({ key }: { key: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setHero(hero_options[key]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    changeHero(hero_options[key]?.toLowerCase());
  }

  return (
    <div className={"relative w-full"}>
      <Dropdown
        trigger={["click"]}
        overlay={menu}
        animation="slide-up"
        placement="bottomCenter"
        overlayClassName={"w-[11%]"}
        // onVisibleChange={onVisibleChange}
      >
        <button
          className={
            "w-[100%] rounded-2xl border-2 border-main-300 bg-main-200 text-lg shadow duration-300 hover:bg-main-100"
          }
        >
          {currentHero.name}
        </button>
      </Dropdown>
    </div>
  );
}
