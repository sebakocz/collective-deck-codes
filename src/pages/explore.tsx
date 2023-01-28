import { Format } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import SelectChip from "@/components/common/selectChip";
import TopDecksSection from "@/components/pages/home/topDecksSection";

const Explore: NextPage = () => {
  const [selectedFormat, setSelectedFormat] = useState<Format>(Format.STANDARD);

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div
        className={
          "align-center flex h-screen w-full flex-wrap justify-center overflow-hidden overflow-y-scroll p-8 will-change-transform"
        }
      >
        {/* Filter Section */}
        <div className={"flex h-min w-full items-center justify-center gap-3"}>
          {/*<DeckSearchBar />*/}
          {Object.values(Format).map((format) => (
            <SelectChip
              key={format}
              label={format}
              onClick={() => setSelectedFormat(format)}
              selected={selectedFormat === format}
            />
          ))}
        </div>

        {/* Deck List Section */}
        <TopDecksSection format={selectedFormat} />
      </div>
    </>
  );
};

export default Explore;
