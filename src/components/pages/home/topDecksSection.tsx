import { Format } from "@prisma/client";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

import Button from "@/components/common/button";
import DeckSlot from "@/components/common/deckslot";
import BrewIcon from "@/components/icons/brewIcon";
import { api } from "@/utils/api";

type TopDecksSectionProps = {
  count?: number;
  format?: Format;
};

export default function TopDecksSection({
  count,
  format = Format.STANDARD,
}: TopDecksSectionProps) {
  const topDecksImport = api.decks.getTopX.useQuery(
    { count: count, format: format },
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div className={"flex flex-wrap justify-center"}>
        {topDecksImport.isLoading ? (
          <div className={"flex w-full justify-center text-lg"}>
            <BeatLoader size={50} color={"#99816A"} className={"mt-20"} />
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
}
