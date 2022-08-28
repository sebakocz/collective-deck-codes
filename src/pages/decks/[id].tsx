import Image from "next/image"
import React, {useState} from "react";
import CardDisplayMini from "../../components/common/carddisplaymini";
import {Deck, DeckCard} from "../../lib/types";
import {prisma} from "../../server/db/client";
import {InferGetStaticPropsType} from "next";
import Button from "../../components/common/button";
import {exportDeckToClipboard, get_rgb, getHeroIcon, noHero} from "../../lib/utils";
import {Affinity, Type} from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import EditDeckModal from "../../components/common/editDeckModal";
import {useSession} from "next-auth/react";
import {useViews} from "../../lib/hooks/useViews";
import {trpc} from "../../utils/trpc";

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
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({params}:any) => {
    const id = params?.id as string;

    if (!id) throw new Error();

    const deck = await prisma.deck.findUniqueOrThrow({
        where: { id },
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
                    name: true,
                    email: true,
                }
            },
            hero: true,
            _count: {
                select: {
                    favouritedBy: true,
                }
            }
        }
    })

    return({
        props: {
            deck: JSON.parse(JSON.stringify(deck))
        },
        revalidate: 60
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
    const { data: session } = useSession()

    const likeCountQuery = trpc.useQuery(
        ["likes.count", { deckId: deck?.id! }],
        { initialData: { count: deck?._count.favouritedBy! } }
    );

    const likedByMeQuery = trpc.useQuery(
        ["likes.isMine", {deckId: deck?.id!}],
        {
            initialData: {isMine: false},
            onSuccess: (data) => {
                setIsLiked(data.isMine)
            }
        }
    )

    const likeToggleMutation = trpc.useMutation("likes.toggle");
    const [isLiked, setIsLiked] = useState(likedByMeQuery.data?.isMine)
    const toggleLike = () => {
        if (typeof session == 'undefined') {
            console.log("You need to log in.")
        } else {
            likeToggleMutation
                .mutateAsync({
                    isLiked: !isLiked,
                    deckId: deck?.id!,
                })
                .then(() => {
                    likeCountQuery.refetch();
                })
                .catch((err) => {
                    console.log(err);
                });
            setIsLiked(!isLiked);
        }
    };

    const {views} = useViews(deck)

    const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false)
    const toggleEditDeckModal = () => {
        setIsEditDeckModalOpen(!isEditDeckModalOpen)
    }

    return(
        <>
            <Head>
                <title>{deck.name}</title>
                <meta name="description" content={(deck.description || "No Description.") + `\n~ by ${deck.user.name}`} />
                <meta name="theme-color" content={get_rgb(deck.hero?.affinity || Affinity.NEUTRAL)} />
                <meta property="og:image" content={getHeroIcon(deck.hero?.name)}/>
                <meta name="og:title" content={`${deck.name}`} />
                <meta name="og:description" content={(deck.description || "No Description.") + `\n~ by ${deck.user.name}`} />
                <meta property="og:type" content="article" />

                {/* TODO - this doesn't work */}
                {/*<meta name="twitter:card" content="https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/2e793520-ed64-11eb-89bb-8d69998314a9.png"/>*/}

                <link rel="icon" href="/favicon.ico" />
            </Head>

            {isEditDeckModalOpen &&
                <EditDeckModal
                    cards={deck.cards}
                    hero={deck.hero || noHero}
                    deckName={deck.name}
                    toggleModal={toggleEditDeckModal}
                    description={deck.description || "No Description."}
                    id={deck.id}
                />
            }

            <div className={"flex flex-col justify-start items-center w-full p-5 gap-5"}>

                {/* Header */}
                <div className={"min-w-[300px] flex gap-2 flex-wrap justify-center"}>

                    {/* Hero Icon */}
                    <div className={"w-40 circle"}>
                        <Image src={getHeroIcon(deck.hero?.name)}
                               width={250}
                               height={250}
                               alt={deck.hero?.name}
                            // objectFit={"contain"}
                            // layout={"fill"}
                        />
                    </div>

                    {/* Deck Info */}
                    <div className={"p-2"}>
                        <div className={"text-2xl font-bold"}>{deck.name}</div>
                        <div className={"text-sm"}>by {deck.user.name}</div>

                        <p className={"italic mt-6 max-w-lg"}>
                            {deck.description || "No description"}
                        </p>
                    </div>
                </div>

                {/* Interaction Section */}
                <div className={"flex justify-center gap-6 flex-wrap"}>

                    <Link href={{pathname: "/brew", query: {id: deck.id}}}>
                        <a>
                            <Button>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Brew
                            </Button>
                        </a>
                    </Link>

                    {/* @ts-ignore */}
                    {session?.user?.email == deck.user.email &&
                        <Button
                            // disabled={!session || userDeckCards.length <= 0 }
                            onClick={toggleEditDeckModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Edit
                        </Button>
                    }

                    <Button onClick={() => exportDeckToClipboard(deck.name, deck.cards, deck.hero || noHero)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export
                    </Button>

                    {/* Views */}
                    <div className={"text-center text-main-800 font-bold"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>

                        {views}
                    </div>

                    {/* Likes */}
                    <div className={`text-center text-main-800 font-bold cursor-pointer ${typeof session?.user !== 'undefined' ? "" : "pointer-events-none"}`}
                         onClick={() => {
                             toggleLike()
                         }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>


                        {likeCountQuery.data?.count}
                    </div>
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