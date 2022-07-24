import TribeList from "./tribelist";
import {DeckCard} from "../../lib/types";
import ManaCurve from "./manacurve";
import TestDraw from "./testdraw";

const AnalyseBox = ({children}: any) => {
    return (
        <div className="relative bg-main-300 min-w-[200px] w-[35%] h-[45%] grow">
            {children}
        </div>
    );
}

type AnalyseProps = {
    deck: DeckCard[]
}

export default function Analyse({deck}: AnalyseProps){
    return (
        <div className={"w-full h-full flex flex-wrap content-start gap-9"}>

            <AnalyseBox>
                <TribeList deck={deck}/>
            </AnalyseBox>

            <AnalyseBox>
                <ManaCurve deck={deck}/>
            </AnalyseBox>

            <AnalyseBox>
                <TestDraw deck={deck}/>
            </AnalyseBox>

        </div>
    )
}