import Head from "next/head";
import NextNProgress from "nextjs-progressbar";

import Sidenav from "./sidenav";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <title>Collective Deck</title>
        <meta
          name="description"
          content="The best place for creating, sharing and exploring decks of your Collective!"
        />
        <link rel="icon" href="/collective_icon.png" />
      </Head>
      <div className={"relative flex bg-white"}>
        <NextNProgress color={"#2A7BDE"} />
        <Sidenav />
        {children}
      </div>
    </>
  );
}
