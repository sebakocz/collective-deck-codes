import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Button from "../components/common/button";
import {BeatLoader} from "react-spinners";
import DeckSlot from "../components/common/deckslot";

const Home: NextPage = () => {

    const topDecksImport = trpc.useQuery(["decks.getTopX", {
        count: 4
    }], {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

  return (
    <>
      <Head>
        <title>Collective Deck Codes</title>
        <meta name="description" content="The best place to view, build and analyse your Collective decks!" />
      </Head>

        <div className={"w-full p-10 flex flex-col justify-start overflow-hidden overflow-y-scroll will-change-transform h-screen"}>

            <div>
                <h1 className={"text-7xl font-acme text-main-800 drop-shadow-xl"}>
                    You made your cards
                </h1>
                <h1 className={"text-7xl font-acme text-main-800 drop-shadow-xl"}>
                    Now make your decks
                </h1>

                <h3 className={"italic text-lg text-main-700 mt-2"}>
                    The best place for creating, sharing and exploring decks of your Collective!
                </h3>
            </div>


            {/* Call to action section */}
            <div className={"flex text-center text-2xl mt-10 gap-3 items-center content-center"}>

                <p>
                    Check out the player created cardpool and get ready to
                </p>

                <Link href={"/brew"}>
                    <a>
                        <Button>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Brew
                        </Button>
                    </a>
                </Link>
            </div>

            {/* Top decks section */}
            {/* Call to action section */}
            <div className={"flex text-center text-2xl mt-10 gap-3 items-center content-center"}>

                <p>
                    Or see what the community has been brewing and go
                </p>

                <Link href={"/brew"}>
                    <a>
                        <Button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            Explore
                        </Button>
                    </a>
                </Link>
            </div>

            <div className={"w-full -mt-10 flex"}>
                {topDecksImport.isLoading ?
                    <div className={"flex justify-center text-lg mt-16 w-full"}>
                        <BeatLoader
                            size={50}
                            color={"#99816A"}
                        />
                    </div>
                    :
                    topDecksImport?.data?.length || 0 > 0 ?
                        topDecksImport.data?.map((deck, i: number) => {
                            return (
                                <div key={i}>
                                    <DeckSlot
                                        key={i}
                                        deck={deck}
                                        index={i}
                                        publicView={true}
                                    />
                                </div>
                            )
                        })
                        :
                        <span className={"flex gap-2 items-center text-lg"}>
                        {"It seems like nobody created any decks yet. Go and "}
                            <Link href={"/brew"}>
                            <a>
                                <Button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Brew
                                </Button>
                            </a>
                        </Link>
                            {" some!"}
                    </span>
                }
            </div>
        </div>
    </>
  );
};

export default Home;
