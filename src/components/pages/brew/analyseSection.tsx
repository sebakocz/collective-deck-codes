import type { DeckCard } from "@/lib/types";

import ManaCurve from "./analyse/manacurve";
import TestDraw from "./analyse/testdraw";
import TribeList from "./analyse/tribelist";

const AnalyseBox = ({ children }: any) => {
  return (
    <div className="relative h-[45%] w-[35%] min-w-[200px] grow bg-main-300">
      {children}
    </div>
  );
};

type AnalyseProps = {
  deck: DeckCard[];
};

export default function AnalyseSection({ deck }: AnalyseProps) {
  return (
    <div className={"flex h-full w-full flex-wrap content-start gap-9"}>
      <AnalyseBox>
        <TribeList deck={deck} />
      </AnalyseBox>

      <AnalyseBox>
        <ManaCurve deck={deck} />
      </AnalyseBox>

      <AnalyseBox>
        <TestDraw deck={deck} />
      </AnalyseBox>
    </div>
  );
}
