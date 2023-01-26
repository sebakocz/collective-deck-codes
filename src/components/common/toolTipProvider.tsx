import collectiveIcon from "@public/collective_icon.png";
import Tippy from "@tippyjs/react";
import Image from "next/image";

type ToolTipProviderProps = {
  children: any;
  link: string;
  tooltipOffset?: number;
};

const ToolTipProvider = ({ children, link }: ToolTipProviderProps) => {
  return (
    <Tippy
      content={
        <div className={"bg-main-100 shadow-2xl"}>
          <Image
            src={link}
            alt={"Card Full Image"}
            width={300}
            height={300}
            placeholder={"blur"}
            blurDataURL={collectiveIcon.src}
          />
        </div>
      }
      placement={"right"}
      delay={[300, 0]}
    >
      {children}
    </Tippy>
  );
};

export default ToolTipProvider;
