import Link from "next/link";
import { BeatLoader } from "react-spinners";

import Button from "@/components/common/button";
import DeckSlot from "@/components/common/deckslot";
import { api } from "@/utils/api";

export default function TopDecksSection({ count }: { count: number }) {
  const topDecksImport = api.decks.getTopX.useQuery({ count: count });

  return (
    <>
      <div
        className={
          "-mt-10 flex w-full flex-wrap justify-center sm:justify-start"
        }
      >
        {topDecksImport.isLoading ? (
          <div className={"mt-16 flex w-full justify-center text-lg"}>
            <BeatLoader size={50} color={"#99816A"} />
          </div>
        ) : topDecksImport?.data?.length || 0 > 0 ? (
          topDecksImport.data?.map((deck, i: number) => {
            return (
              <div key={i}>
                <DeckSlot key={i} deck={deck} index={i} publicView={true} />
              </div>
            );
          })
        ) : (
          <span className={"flex items-center gap-2 text-lg"}>
            {"It seems like nobody created any decks yet. Go and "}
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
}
