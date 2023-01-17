import {Hero} from "@prisma/client";
import {useState} from "react";
import {
    affinityMindFilter,
    affinityNeutralFilter,
    affinitySpiritFilter,
    affinityStrengthFilter,
    exclusiveFilter, rarityCommonFilter, rarityLegendaryFilter, rarityRareFilter, rarityUncommonFilter
} from "../utils";
import {DeckCard} from "../types";

type InputFilter = {
    func: Function,
    input: string | number
}

export default function useFilter(hero: Hero){

    // refactored whole neatly organized filter structure because it was too slow
    // followed these steps:
    // https://stackoverflow.com/questions/49963837/how-can-i-speed-up-my-array-search-function

    const [inputFilters, setInputFilters] = useState<InputFilter[]>([])
    const [miscFilters, setMiscFilters] = useState<Function[]>([
        exclusiveFilter
    ])
    const [affinityFilters, setAffinityFilters] = useState<Function[]>([
        affinityMindFilter,
        affinityStrengthFilter,
        affinitySpiritFilter,
        affinityNeutralFilter
    ])
    const [rarityFilters, setRarityFilters] = useState<Function[]>([
        rarityCommonFilter,
        rarityUncommonFilter,
        rarityRareFilter,
        rarityLegendaryFilter
    ])

    function resetFilter(){
        setRarityFilters([
            rarityCommonFilter,
            rarityUncommonFilter,
            rarityRareFilter,
            rarityLegendaryFilter
        ])

        setAffinityFilters([
            affinityMindFilter,
            affinityStrengthFilter,
            affinitySpiritFilter,
            affinityNeutralFilter
        ])

        setMiscFilters([
            exclusiveFilter
        ])

        setInputFilters([])
    }

    function inputFilterExists(filter: Function){
        return inputFilters.find(f => f.func == filter) !== undefined
    }

    function miscFilterExists(filter: Function){
        return miscFilters.find(f => f == filter) !== undefined
    }

    function affinityFilterExists(filter: Function){
        return affinityFilters.find(f => f == filter) !== undefined
    }

    function rarityFilterExists(filter: Function){
        return rarityFilters.find(f => f == filter) !== undefined
    }

    function addInputFilter(filter: Function, input: string) {
        // ...input && {input} - conditional spreading, used to prevent empty values in objects
        // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
        setInputFilters((currentFilters) => [...currentFilters, {func: filter, input}])
    }

    function removeInputFilter(filter: Function) {
        setInputFilters((currentFilters) =>
            currentFilters.filter(f => !(f.func == filter))
        )
    }

    // changed back from curry so I can use debounce on quick search
    const onInputFilter = (filter: Function, input: any) => {
        input = input.toLowerCase()
        removeInputFilter(filter)
        if(input === ""){
            return;
        }

        addInputFilter(filter, input)
    }

    function getInputFilter(filter: Function){
        return inputFilters.find(f => f.func == filter)?.input ?? ""
    }

    function removeMiscFilter(filter: Function) {
        setMiscFilters((currentFilters) =>
            currentFilters.filter(f => !(f == filter))
        )
    }

    function addMiscFilter(filter: Function) {
        // ...input && {input} - conditional spreading, used to prevent empty values in objects
        // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
        setMiscFilters((currentFilters) => [...currentFilters, filter])
    }

    function toggleMiscFilter(filter: Function){
        if (miscFilterExists(filter)) {
            removeMiscFilter(filter)
        } else {
            addMiscFilter(filter)
        }
    }

    function removeRarityFilter(filter: Function) {
        setRarityFilters((currentFilters) =>
            currentFilters.filter(f => !(f == filter))
        )
    }

    function addRarityFilter(filter: Function) {
        // ...input && {input} - conditional spreading, used to prevent empty values in objects
        // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
        setRarityFilters((currentFilters) => [...currentFilters, filter])
    }

    function toggleRarityFilter(filter: Function){
        if (rarityFilterExists(filter)) {
            removeRarityFilter(filter)
        } else {
            addRarityFilter(filter)
        }
    }

    function removeAffinityFilter(filter: Function) {
        setAffinityFilters((currentFilters) =>
            currentFilters.filter(f => !(f == filter))
        )
    }

    function addAffinityFilter(filter: Function) {
        // ...input && {input} - conditional spreading, used to prevent empty values in objects
        // setFilters((currentFilters) => [...currentFilters, {name, func, ...input && {input}, ...group && {group}}])
        setAffinityFilters((currentFilters) => [...currentFilters, filter])
    }

    function toggleAffinityFilter(filter: Function){
        if (affinityFilterExists(filter)) {
            removeAffinityFilter(filter)
        } else {
            addAffinityFilter(filter)
        }
    }

    function applyFilters(cards: DeckCard[]){
        let new_cards: DeckCard[] = []
        for (let i=0; i < cards.length; i++){
            for (let f=0; f < affinityFilters.length; f++) {

                if (affinityFilters[f]!(cards[i])) {
                    new_cards.push(cards[i]!)
                    break
                }
            }
        }

        let new_cards2: DeckCard[] = []
        for (let i=0; i < new_cards.length; i++){
            for (let f=0; f < rarityFilters.length; f++) {
                if (rarityFilters[f]!(new_cards[i])) {
                    new_cards2.push(new_cards[i]!)
                    break
                }
            }
        }

        let new_cards3: DeckCard[] = []
        for (let i=0; i < new_cards2.length; i++){
            let passed = true
            for (let f=0; f < miscFilters.length; f++) {
                if (!miscFilters[f]!(new_cards2[i])) {
                    passed = false
                    break
                }
            }
            if (passed) {
                new_cards3.push(new_cards2[i]!)
            }
        }

        let new_cards4: DeckCard[] = []
        for (let i=0; i < new_cards3.length; i++){
            let passed = true
            for (let f=0; f < inputFilters.length; f++) {
                if (!inputFilters[f]!.func(new_cards3[i], inputFilters[f]!.input)) {
                    passed = false
                    break
                }
            }
            if (passed){
                new_cards4.push(new_cards3[i]!)
            }
        }

        // only show exclusive cards when they match hero affinity
        new_cards4 = new_cards4.filter(card => {
            if(card.card?.exclusive){
                return card.card.affinity == hero.affinity || hero.affinity == null
            }
            return true
        })


        return new_cards4
    }

    return {
        applyFilters,
        toggleAffinityFilter,
        toggleRarityFilter,
        toggleMiscFilter,
        onInputFilter,
        getInputFilter,
        inputFilterExists,
        affinityFilterExists,
        rarityFilterExists,
        miscFilterExists,
        resetFilter,
        setAffinityFilters,
        setRarityFilters
    }
}