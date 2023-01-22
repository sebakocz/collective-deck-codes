import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

import Button from "@/components/common/button";
import DeckSlot from "@/components/common/deckslot";
import { api } from "@/utils/api";

const Mydecks: NextPage = () => {
  const userDecksImport = api.decks.getAllBySession.useQuery();

  const deckDeleteMutation = api.decks.deleteById.useMutation({
    onSuccess: async () => {
      await userDecksImport.refetch();
    },
  });

  return (
    <>
      <Head>
        <title>My Decks</title>
      </Head>
      <div
        className={
          "flex h-screen w-full flex-wrap justify-center overflow-hidden overflow-y-scroll p-8 will-change-transform"
        }
      >
        {userDecksImport.isLoading ? (
          <div className={"flex items-center text-lg"}>
            <BeatLoader size={50} color={"#99816A"} />
          </div>
        ) : userDecksImport?.data?.length || 0 > 0 ? (
          userDecksImport.data?.map((deck, i: number) => {
            return (
              <div
                key={i}
                className={`${
                  deckDeleteMutation.isLoading
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                <DeckSlot
                  key={i}
                  deck={deck}
                  index={i}
                  onDelete={(deck) => {
                    deckDeleteMutation.mutate({ id: deck.id });
                  }}
                />
              </div>
            );
          })
        ) : (
          <span className={"flex items-center gap-2 text-lg"}>
            {"It seems like you didn't create any decks yet. Go and "}
            <Link href={"/brew"}>
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Brew
              </Button>
            </Link>
            {" some!"}
          </span>
        )}
      </div>
    </>
  );
};

export default Mydecks;
