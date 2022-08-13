import {DeckCard} from "../../lib/types";
import {Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

type ManaCurveProps = {
    deck: DeckCard[]
}

export default function ManaCurve({deck}: ManaCurveProps){

    const deckData: any = []
    const fillDeckData = () => {
        deck.forEach(dc => {
            const offAff =  dc.affinityBasedCost
            deckData[offAff] = deckData[offAff] || {}
            deckData[offAff].cost = offAff
            deckData[offAff][dc.card.affinity] = (deckData[offAff][dc.card.affinity] || 0) + dc.count
        })

        // fixing empty values in array that lead to errors
        for (let i = 0; i < deckData.length; i++) {
            if (!deckData[i]) {
                deckData[i] = {
                    cost: i
                }
            }
        }
    }
    fillDeckData()

    console.log(deckData)

    return(
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={deckData.flat()}
                margin={{
                    top: 20,
                    right: 20,
                    left: -20,
                    bottom: 5,
                }}
            >
                {/*<CartesianGrid strokeDasharray="3 3" />*/}
                <XAxis dataKey="cost" domain={['dataMin', 'dataMax']}/>
                <YAxis allowDecimals={false}/>
                <Tooltip />
                {/*<Legend />*/}
                <Bar dataKey="NEUTRAL" stackId="a" fill="#D3D3D3" />
                <Bar dataKey="SPIRIT" stackId="a" fill="#94E38E" />
                <Bar dataKey="MIND" stackId="a" fill="#61B4D9" />
                <Bar dataKey="STRENGTH" stackId="a" fill="#F69C99" />
            </BarChart>
        </ResponsiveContainer>
    )
}