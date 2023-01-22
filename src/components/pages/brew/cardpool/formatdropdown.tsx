import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";
import { useState } from "react";

import type { useCardpool } from "@/lib/hooks/useCardpool";
import type { DeckCard } from "@/lib/types";

type FormatDropdownProps = {
  useCardpool: ReturnType<typeof useCardpool>;
};

export default function FormatDropdown({ useCardpool }: FormatDropdownProps) {
  // TODO: this should be dependant on cardPool
  const { setCardPool, cardPoolList } = useCardpool;

  const changeFormat = (format: string) => {
    setCardPool(cardPoolList[format] as DeckCard[]);
  };

  const format_options = ["Standard", "Legacy"];
  const [format, setFormat] = useState(format_options[0]);
  const menu = (
    <Menu
      onSelect={onSelect}
      // force-over-writing the default menu style to make it look better
      style={{ background: "none", border: "none", boxShadow: "none" }}
    >
      {format_options.map((format, index) => {
        return (
          <MenuItem
            key={index}
            className={
              "cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl bg-main-300 text-center text-lg shadow hover:bg-main-200"
            }
            style={{ marginTop: "0.1rem" }}
          >
            {format}
          </MenuItem>
        );
      })}
    </Menu>
  );

  function onSelect({ key }: { key: string }) {
    setFormat(format_options[key] as string);
    changeFormat((format_options[key] as string).toLowerCase());
  }

  return (
    <div className={"relative w-[40%]"}>
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
            "w-[100%] rounded-2xl border-2 border-main-300 bg-main-200 text-lg shadow duration-200 hover:bg-main-100"
          }
        >
          {format}
        </button>
      </Dropdown>
    </div>
  );
}
