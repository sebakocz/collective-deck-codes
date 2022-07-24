import {useEffect, useState} from "react";
import {Hero} from "@prisma/client";
import {trpc} from "../../utils/trpc";
import {noHero} from "../utils";

export default function useHero(){
    const [hero, setHero] = useState<Hero>(noHero)

    const herosImport = trpc.useQuery(["heros.getAll"], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const setHeroByName = (name: string) => {
        // console.log("setHeroByName", name)
        let newHero = herosImport.data?.find((h: Hero) => h.name.toLowerCase() == name)
        if(!newHero)
            newHero = noHero
        // console.log("newHero", newHero)
        setHero(newHero)
    }

    return {hero, heros: [noHero, ...(herosImport.data || [])], setHeroByName}
}