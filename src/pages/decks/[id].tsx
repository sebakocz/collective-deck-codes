import Image from "next/image"
import React from "react";
import {trpc} from "../../utils/trpc";
import CardDisplayMini from "../../components/common/carddisplaymini";
import {Deck, DeckCard} from "../../lib/types";
import {prisma} from "../../server/db/client";
import {GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {createSSGHelpers} from "@trpc/react/ssg";
import superjson from "superjson";
import {appRouter} from "../../server/router";
import slugify from "slugify";
import Button from "../../components/common/button";
import {exportDeckToClipboard, noHero} from "../../lib/utils";
import {Affinity, Type} from "@prisma/client";
import {Tooltip} from "react-tippy";
import cubeImg from "*.png";
import Head from "next/head";

// // https://trpc.io/docs/ssg
// export async function getStaticProps(
//     context: GetStaticPropsContext<{ id: string }>,
// ) {
//     const ssg = createSSGHelpers({
//         router: appRouter,
//         // @ts-ignore
//         ctx: {},
//         transformer: superjson, // optional - adds superjson serialization
//     });
//     const id = context.params?.id as string;
//
//     await ssg.fetchQuery('decks.getById', {
//         id,
//     });
//
//     return {
//         props: {
//             trpcState: ssg.dehydrate(),
//             id,
//         },
//         revalidate: 1,
//     };
// }
//
// export const getStaticPaths: GetStaticPaths = async () => {
//     const decks = await prisma.deck.findMany({
//         select: {
//             id: true,
//         },
//     });
//
//     return {
//         paths: decks.map((deck) => ({
//             params: {
//                 id: deck.id,
//             },
//         })),
//         // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
//         fallback: 'blocking',
//     };
// };

export async function getStaticPaths(){
    const decks = await prisma.deck.findMany({
        select: {
            id: true
        }
    })

    return {
        paths: decks.map(deck => ({
            params: {
                id: deck.id
            }
        })),
        fallback: false,
        revalidate: 60
    }
}

export async function getStaticProps({params}: any){
    const deck = await prisma.deck.findUnique({
        where: {
            id: params.id
        },
        include: {
            cards: {
                include: {
                    card: true
                },
                orderBy: [
                    {
                        affinityBasedCost: "asc"
                    },
                ]
            },
            user: {
                select: {
                    name: true
                }
            },
            hero: {
                select: {
                    name: true
                }
            }
        }
    })

    return({
        props: {
            deck: JSON.parse(JSON.stringify(deck))
        }
    })
}

const TypeList = ({deck, type}: {deck: Deck, type: Type}) => {
    return <div className={"w-[45%]"}>
        {deck?.cards.filter(c => c.card.type == type).map((card, index) => (
            <CardDisplayMini
                key={index}
                deckCard={card}
                tooltipOffset={-40}
            />
        ))}
    </div>
}

const DeckProfile = ( props: InferGetStaticPropsType<typeof getStaticProps>) => {

    const {deck}:{deck: Deck} = props

    return(
        <>
            <Head>
                <title>{deck.name} - by {deck.user.name}</title>
                <meta name="description" content={deck.description || "No Description."} />
                <meta name="theme-color" content="#E4D6C1" />
                <meta property="og:image" content={`https://www.collective.gg/emotes/${slugify(deck?.hero?.name || "", {replacement: '', lower: true})}_thumb.png`}/>
                <meta name="og:title" content={`${deck.name} - by ${deck.user.name}`} />
                <meta name="og:description" content={deck.description || "No Description."} />
                <meta property={"og:"} />
                <meta property="og:type" content="article" />

                <meta name="twitter:card" content="https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/2e793520-ed64-11eb-89bb-8d69998314a9.png"/>

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={"flex flex-col justify-start items-center w-full p-5 gap-5"}>

                {/* Header */}
                <div className={"min-w-[300px] h-40 flex gap-2"}>

                    {/* Hero Icon */}
                    <div className={"w-40 h-40 circle"}>
                        <Image src={`https://www.collective.gg/emotes/${slugify(deck?.hero?.name || "", {replacement: '', lower: true})}_thumb.png`}
                               width={250}
                               height={250}
                               alt={deck.hero?.name}
                            // objectFit={"fill"}
                            // layout={"fill"}
                        />
                    </div>

                    {/* Deck Info */}
                    <div className={"grow p-2"}>
                        <div className={"text-2xl font-bold"}>{deck.name}</div>
                        <div className={"text-sm"}>by {deck.user.name}</div>

                        <p className={"italic mt-6"}>
                            {deck.description || "No description"}
                        </p>
                    </div>
                </div>

                {/* Interaction Section */}
                <div className={"flex justify-between gap-6"}>

                    {/* TODO: OnClick */}
                    {/* @ts-ignore */}
                    <Tooltip
                        position={"bottom"}
                        title={"Under Construction. Blame Sevas or something."}
                    >
                        <Button disabled={true}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Brew
                        </Button>
                    </Tooltip>

                    <Button onClick={() => exportDeckToClipboard(deck.name, deck.cards, deck.hero || noHero)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export
                    </Button>
                </div>

                {/* Deck */}
                <div className={"min-w-[300px] w-2/5 flex justify-between"}>

                    {/* Units */}
                    <TypeList
                        deck={deck}
                        type={Type.UNIT}
                    />

                    {/* Action */}
                    <TypeList
                        deck={deck}
                        type={Type.ACTION}
                    />

                </div>
            </div>
        </>
    )
}

export default DeckProfile;