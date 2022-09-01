import Menu, {Item as MenuItem} from "rc-menu";
import Dropdown from "rc-dropdown";
import {useState} from "react";
import {useRouter} from "next/router";

type FormatDropdownProps = {
    changeFormat: Function
}

export default function FormatDropdown({changeFormat}: FormatDropdownProps){

    // // ?secretpool=true for testing purposes of the event set
    // const router = useRouter()
    // let {secretpool} = router.query
    // const format_options = secretpool == "true" ? ["Standard", "Legacy", "Event"] : ["Standard", "Legacy"]

    const format_options = ["Standard", "Legacy", "Event"]
    const [format, setFormat] = useState(format_options[0])
    const menu = (
        <Menu
            onSelect={onSelect}
            // force-over-writing the default menu style to make it look better
            style={{background: "none", border: "none", boxShadow: "none"}}
        >
            {format_options.map((format, index) => {
                return (
                    <MenuItem
                        key={index}
                        className={"shadow rounded-xl overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer text-center bg-main-300 hover:bg-main-200 text-lg"}
                        style={{marginTop: "0.1rem"}}
                    >
                        {format}
                    </MenuItem>
                )
            })}
        </Menu>
    );

    function onSelect({ key }: any) {
        setFormat(format_options[key])
        changeFormat(format_options[key]?.toLowerCase())
    }

    return (
        <div className={"w-[40%] relative"}>
            <Dropdown
                trigger={['click']}
                overlay={menu}
                animation="slide-up"
                placement="bottomCenter"
                overlayClassName={"w-[11%]"}
                // onVisibleChange={onVisibleChange}
            >
                <button className={"w-[100%] bg-main-200 rounded-2xl hover:bg-main-100 border-main-300 border-2 shadow duration-200 text-lg"}>
                    {format}
                </button>
            </Dropdown>
        </div>
    )
}