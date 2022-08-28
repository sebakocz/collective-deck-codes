//no longer used, now fetching serverside
import {useEffect, useState} from "react";
import axios from "axios";
import {Deck} from "../types";

export function useViews(deck: Deck) {
    const [views, setViews] = useState(0);

    useEffect(() => {
        axios
            .get(`https://collectivedeckcodes.goatcounter.com/counter//decks/${deck.id}.json`)
            .then((res) => {
                setViews(res.data.count_unique)
            })
            .catch(function (error) {
                console.log("No views found for "+deck.name)
            })
    },[])

    return {views}
}