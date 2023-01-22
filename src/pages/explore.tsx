import type { NextPage } from "next";
import Head from "next/head";

import TopDecksSection from "@/components/pages/home/topDecksSection";

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div
        className={
          "flex h-screen w-full flex-wrap justify-center overflow-hidden overflow-y-scroll p-8 will-change-transform"
        }
      >
        <TopDecksSection count={10} />
      </div>
    </>
  );
};

export default Explore;
