import Sidenav from "./sidenav";
import Head from "next/head";
import ReactTooltip from "react-tooltip";
import NextNProgress from "nextjs-progressbar";


export default function Layout({children}: any){
    return(
        <>
            <Head>
                <title>Collective Deck</title>
                <meta name="description" content="The best place for creating, sharing and exploring decks of your Collective!" />
                <link rel="icon" href="/collective_icon.png" />

            </Head>
            <div className={'bg-white relative flex'}>
                <NextNProgress color={"#2A7BDE"}/>
                <Sidenav/>
                {children}
            </div>
        </>
    )
}