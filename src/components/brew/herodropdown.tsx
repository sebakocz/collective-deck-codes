import Menu, {Item as MenuItem} from "rc-menu";
import Dropdown from "rc-dropdown";
import {useState} from "react";
import {Hero} from "@prisma/client";

type HeroDropdownProps = {
    changeHero: Function
    heros: Hero[]
    currentHero: Hero
}

export default function HeroDropdown({changeHero, heros, currentHero}: HeroDropdownProps){
    const hero_options = heros.map((hero: Hero) => hero.name)
    const [hero, setHero] = useState(hero_options[0])
    const menu = (
        <Menu
            onSelect={onSelect}
            // force-over-writing the default menu style to make it look better
            style={{background: "none", border: "none", boxShadow: "none"}}
        >
            {hero_options.map((hero, index) => {
                return (
                    <MenuItem
                        key={index}
                        className={"shadow rounded-xl overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer text-center bg-main-300 hover:bg-main-200 text-lg"}
                        style={{marginTop: "0.1rem"}}
                    >
                        {hero}
                    </MenuItem>
                )
            })}
        </Menu>
    );

    function onSelect({ key }: any) {
        setHero(hero_options[key])
        changeHero(hero_options[key]?.toLowerCase())
    }

    return (
        <div className={"w-full relative"}>
            <Dropdown
                trigger={['click']}
                overlay={menu}
                animation="slide-up"
                placement="bottomCenter"
                overlayClassName={"w-[11%]"}
                // onVisibleChange={onVisibleChange}
            >
                <button className={"w-[100%] bg-main-200 rounded-2xl hover:bg-main-100 border-main-300 border-2 shadow duration-300 text-lg"}>
                    {currentHero.name}
                </button>
            </Dropdown>
        </div>
    )
}