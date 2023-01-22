import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DeckCard } from "@/lib/types";

type ManaCurveProps = {
  deck: DeckCard[];
};

export default function ManaCurve({ deck }: ManaCurveProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const deckData: any[] = [];
  const fillDeckData = () => {
    deck.forEach((dc) => {
      if (!dc.card) {
        return;
      }

      const cost = dc.card.cost + (dc.affinityPenalty ? 1 : 0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      deckData[cost] = deckData[cost] || {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      deckData[cost].cost = cost;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      deckData[cost][dc.card.affinity] =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-plus-operands
        (deckData[cost][dc.card.affinity] || 0) + dc.count;
    });

    // fixing empty values in array that lead to errors
    for (let i = 0; i < deckData.length; i++) {
      if (!deckData[i]) {
        deckData[i] = {
          cost: i,
        };
      }
    }
  };
  fillDeckData();

  console.log(deckData);

  return (
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
        <XAxis dataKey="cost" domain={["dataMin", "dataMax"]} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        {/*<Legend />*/}
        <Bar dataKey="NEUTRAL" stackId="a" fill="#D3D3D3" />
        <Bar dataKey="SPIRIT" stackId="a" fill="#94E38E" />
        <Bar dataKey="MIND" stackId="a" fill="#61B4D9" />
        <Bar dataKey="STRENGTH" stackId="a" fill="#F69C99" />
      </BarChart>
    </ResponsiveContainer>
  );
}
