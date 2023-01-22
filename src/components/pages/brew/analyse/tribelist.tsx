import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { DeckCard } from "@/lib/types";

function genColor(seed: number) {
  let color: string | number = Math.floor(Math.abs(Math.sin(seed) * 16777215));
  color = color.toString(16);
  // pad any colors shorter than 6 characters with leading 0s
  while (color.length < 6) {
    color = "0" + color;
  }
  return `#${color}`;
}

function seedFromString(string: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const lowCaseArr = [...string.toLowerCase()];
  return lowCaseArr.reduce((a, char) => a + char.charCodeAt(0), 0);
}

type TribeListProps = {
  deck: DeckCard[];
};

type TribeCountDict = {
  [key: string]: number;
};

type DataDict = { name: string; value: number | undefined }[];

export default function TribeList({ deck }: TribeListProps) {
  const tribesCountDict = () => {
    const dict: TribeCountDict = {};
    deck.forEach((dc) => {
      if (!dc.card?.tribe) {
        dict["Tribeless"] = (dict["Tribeless"] || 0) + dc.count;
        return;
      }
      const tribes = [...dc.card.tribe.split(" ")];
      tribes.forEach((tribe) => {
        dict[tribe] = (dict[tribe] || 0) + dc.count;
      });
    });

    const dataDict: DataDict = [];
    Object.keys(dict).map((key) => {
      dataDict.push({ name: key, value: dict[key] });
    });

    return dataDict;
  };

  const data: DataDict = tribesCountDict();

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }: any) => {
    const radius = (innerRadius as number) + (outerRadius - innerRadius) * 1.1;
    const x = (cx as number) + radius * Math.cos(-midAngle * RADIAN);
    const y = (cy as number) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={"white"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          filter: `drop-shadow(rgb(0 0 0) 0px 1px 2px)`,
        }}
      >
        {/*{`${(percent * 100).toFixed(0)}%`}*/}
        {name} x{value}
      </text>
    );
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={genColor(
                  seedFromString(data[index]?.name || "Tribeless")
                )}
                // style={{filter: `drop-shadow(0px 0px 2px ${genColor(seedFromString(data[index].name))}`}}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
