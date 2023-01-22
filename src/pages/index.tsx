import type { NextPage } from "next";
import Head from "next/head";

import CallToActionSection from "@/components/pages/home/callToActionSection";
import HeroSection from "@/components/pages/home/heroSection";
import TopDecksSection from "@/components/pages/home/topDecksSection";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Collective Deck Codes</title>
        <meta
          name="description"
          content="The best place for creating, sharing and exploring decks of your Collective!"
        />
      </Head>

      <div
        className={
          "flex h-screen w-full flex-col justify-start overflow-hidden overflow-y-scroll p-10 will-change-transform"
        }
      >
        <HeroSection />

        <CallToActionSection />

        <TopDecksSection count={4} />
      </div>
    </>
  );
};

export default Home;
