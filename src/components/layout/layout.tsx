import Sidenav from "./sidenav";
import Head from "next/head";
import ReactTooltip from "react-tooltip";


export default function Layout({children}: any){
    return(
        <>
            <Head>
                <title>Collective Deck</title>
                <meta name="description" content="The best place to view, build and analyse your Collective decks!" />
                <link rel="icon" href="/collective_icon.png" />

            </Head>
            <div className={'bg-white relative flex'}>
                <Sidenav/>
                {children}
            </div>
        </>
    )
}