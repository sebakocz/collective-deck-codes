import ReactTooltip from "react-tooltip";
import Image from "next/image";
import parrotImg from "../../../public/Parroting_Parrot.png";
import collectiveIcon from "../../../public/collective_icon.png";
import {Tooltip} from "react-tippy";

type ToolTipProviderProps = {
    children: any,
    link: string,
    tooltipOffset?: number,
}

const ToolTipProvider = ({children, link, tooltipOffset}: ToolTipProviderProps) => {
    return (
        // @ts-ignore - https://github.com/tvkhoa/react-tippy/issues/169
        <Tooltip
            arrow={false}
            animateFill={false}
            theme={'light'}
            position={'right'}
            distance={tooltipOffset || 10}
            html={
                <div className={"w-2/3 md:w-96"}>
                    <Image
                        src={link}
                        alt={"Card Full Image"}
                        width={450}
                        height={450}
                        objectFit={"contain"}
                        placeholder={'blur'}
                        blurDataURL={collectiveIcon.src}
                    />
                </div>
            }
        >
            {children}
        </Tooltip>
    )
}

export default ToolTipProvider;