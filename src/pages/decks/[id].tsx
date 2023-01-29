import { Affinity, Type } from "@prisma/client";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Button from "@/components/common/button";
import CardDisplayMini from "@/components/common/carddisplaymini";
import LabelChip from "@/components/common/labelChip";
import SaveDeckModal from "@/components/common/saveDeckModal";
import BrewIcon from "@/components/icons/brewIcon";
import ExportIcon from "@/components/icons/exportIcon";
import EyeIcon from "@/components/icons/eyeIcon";
import LikeIcon from "@/components/icons/likeIcon";
import SaveIcon from "@/components/icons/saveIcon";
import { useDeck } from "@/lib/hooks/useDeck";
import { noHero } from "@/lib/hooks/useHero";
import type { Deck, DeckCard } from "@/lib/types";
import { get_rgb, getHeroIcon } from "@/lib/utils";
import { exportDeckToClipboard } from "@/lib/utils";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";

export async function getStaticPaths() {
  const decks = await prisma?.deck.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: decks?.map((deck) => ({
      params: {
        id: deck.id,
      },
    })),
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const id = params?.id as string;

  if (!id) throw new Error();

  const deck = await prisma?.deck.findUniqueOrThrow({
    where: { id },
    include: {
      cards: {
        include: {
          card: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      hero: true,
      _count: {
        select: {
          favouritedBy: true,
        },
      },
    },
  });

  let views: { count_unique: number };
  try {
    const viewsRes = await fetch(
      `https://collectivedeckcodes.goatcounter.com/counter//decks/${
        deck?.id || "error"
      }.json`
    );
    views = (await viewsRes.json()) as { count_unique: number };
  } catch (e) {
    views = { count_unique: 0 };
  }

  return {
    props: {
      deck: JSON.parse(JSON.stringify(deck)) as Deck,
      views: views.count_unique,
    },
    revalidate: 60,
  };
};

const TypeList = ({ deck, type }: { deck: Deck; type: Type }) => {
  return (
    <div className={"w-[45%]"}>
      {deck?.cards
        .filter((c) => c.card?.type == type)
        .map((card, index) => (
          <CardDisplayMini key={index} deckCard={card as DeckCard} />
        ))}
    </div>
  );
};

const DeckProfile = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { deck }: { deck: Deck } = props;
  const { views } = props;
  //no longer used, now fetching serverside
  // const {views} = useViews(deck)

  const { data: session } = useSession();

  const likeCountQuery = api.likes.count.useQuery(
    { deckId: deck?.id },
    {
      initialData: deck._count.favouritedBy,
    }
  );

  const likedByMeQuery = api.likes.isMine.useQuery(
    { deckId: deck?.id },
    {
      initialData: { isMine: false },
      onSuccess: (data) => {
        setIsLiked(data);
      },
    }
  );

  const likeToggleMutation = api.likes.toggle.useMutation();
  const [isLiked, setIsLiked] = useState(likedByMeQuery.data);
  const toggleLike = () => {
    if (typeof session == "undefined") {
      console.log("You need to log in.");
    } else {
      likeToggleMutation
        .mutateAsync({
          isLiked: !isLiked,
          deckId: deck?.id,
        })
        .then(async () => {
          await likeCountQuery.refetch();
        })
        .catch((err) => {
          console.log(err);
        });
      setIsLiked(!isLiked);
    }
  };

  const userDeck = useDeck();

  useEffect(() => {
    userDeck.addCardsToDeck(deck.cards as DeckCard[]);
    userDeck.setDeckDescription(deck.description || "");
    userDeck.setHero(deck.hero || noHero);
    userDeck.setDeckName(deck.name || "");
    userDeck.setDeckId(deck.id || "");
    userDeck.setFrontCardUrl(deck.frontCard || "");
  }, [deck]);

  const [isSaveDeckModalOpen, setIsSaveDeckModalOpen] = useState(false);
  const toggleEditDeckModal = () => {
    setIsSaveDeckModalOpen(!isSaveDeckModalOpen);
  };

  return (
    <>
      <Head>
        <title>{deck.name}</title>
        <meta
          name="description"
          content={
            (deck.description || "No Description.") +
            `\n~ by ${deck.user.name || "Unknown"}` +
            `\n\n${views} 👁️ ${deck._count.favouritedBy} ❤️`
          }
        />
        <meta
          name="theme-color"
          content={get_rgb(deck.hero?.affinity || Affinity.NEUTRAL)}
        />
        <meta property="og:image" content={getHeroIcon(deck.hero?.name)} />
        <meta name="og:title" content={`${deck.name}`} />
        <meta
          name="og:description"
          content={
            (deck.description || "No Description.") +
            `\n~ by ${deck.user.name || "Unknown"}` +
            `\n\n${views} 👁️ ${deck._count.favouritedBy} ❤️`
          }
        />
        <meta property="og:type" content="article" />

        {/* TODO - this doesn't work */}
        {/*<meta name="twitter:card" content="https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/2e793520-ed64-11eb-89bb-8d69998314a9.png"/>*/}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isSaveDeckModalOpen && (
        <SaveDeckModal userDeck={userDeck} toggleModal={toggleEditDeckModal} />
      )}

      <div
        className={"flex w-full flex-col items-center justify-start gap-5 p-5"}
      >
        {/* Header */}
        <div className={"flex min-w-[300px] flex-wrap justify-center gap-2"}>
          {/* Hero Icon */}
          <div className={"circle w-40"}>
            <Image
              src={getHeroIcon(deck.hero?.name)}
              width={250}
              height={250}
              alt={deck.hero?.name || "No Hero"}
              // objectFit={"contain"}
              // layout={"fill"}
            />
          </div>

          {/* Deck Info */}
          <div className={"p-2"}>
            <div className={"text-2xl font-bold"}>{deck.name}</div>
            <div className={"text-sm"}>by {deck.user.name}</div>

            <p className={"mt-6 max-w-lg italic"}>
              {deck.description || "No description"}
            </p>

            <div className={"mt-5"}>
              <LabelChip label={deck.format} />
            </div>
          </div>
        </div>

        {/* Interaction Section */}
        <div className={"flex flex-wrap justify-center gap-6"}>
          <Link href={{ pathname: "/brew", query: { id: deck.id } }}>
            <Button>
              <BrewIcon />
              Brew
            </Button>
          </Link>

          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          {session?.user?.email == deck.user.email && (
            <Button
              // disabled={!session || userDeckCards.length <= 0 }
              onClick={toggleEditDeckModal}
            >
              <SaveIcon />
              Edit
            </Button>
          )}

          <Button
            onClick={() =>
              exportDeckToClipboard(
                deck.name,
                deck.cards as DeckCard[],
                deck.hero || noHero
              )
            }
          >
            <ExportIcon />
            Export
          </Button>

          {/* Views */}
          <div className={"text-center font-bold text-main-800"}>
            <EyeIcon />

            {views}
          </div>

          {/* Likes */}
          <div
            className={`cursor-pointer text-center font-bold text-main-800 ${
              typeof session?.user !== "undefined" ? "" : "pointer-events-none"
            }`}
            onClick={() => {
              toggleLike();
            }}
          >
            <LikeIcon isLiked={isLiked} />

            {likeCountQuery.data || 0}
          </div>
        </div>

        {/* Deck */}
        <div className={"flex w-2/5 min-w-[300px] justify-between"}>
          {/* Units */}
          <TypeList deck={deck} type={Type.UNIT} />

          {/* Action */}
          <TypeList deck={deck} type={Type.ACTION} />
        </div>
      </div>
    </>
  );
};

export default DeckProfile;
