import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

import Button from "@/components/common/button";
import DeckSlot from "@/components/common/deckslot";
import BrewIcon from "@/components/icons/brewIcon";
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
                <BrewIcon />
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
