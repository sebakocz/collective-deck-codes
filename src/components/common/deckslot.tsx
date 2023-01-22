import Image from "next/image";
import Link from "next/link";

import { useViews } from "@/lib/hooks/useViews";
import { DeckSlot } from "@/lib/types";
import { getHeroIcon } from "@/lib/utils";

type DeckSlotProps = {
  index: number;
  deck: DeckSlot;
  onDelete?: (deck: DeckSlot) => void;
  publicView?: boolean;
};

const DeckSlot = ({
  deck,
  index,
  onDelete,
  publicView = false,
}: DeckSlotProps) => {
  const { views } = useViews(deck.id);

  return (
    <div
      className={"fade-up group"}
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      <Link href={`/decks/${deck.id}`}>
        <div
          className={
            "relative mx-4 my-20 flex h-[381px] w-[265px] flex-col items-center rounded-xl bg-main-500 p-5 shadow-xl duration-300 hover:scale-105"
          }
        >
          {/* Front Card */}
          <div
            className={
              "h-[206px] w-[235px] rounded-xl bg-cover bg-center bg-no-repeat drop-shadow-xl"
            }
            style={{
              backgroundImage: `url(${
                deck.frontCard ||
                "https://s3.us-east-2.amazonaws.com/files.collective.gg/p/canvas-images/a54332d0-3e5c-11eb-b033-73172d333e79.png"
              })`,
            }}
          />

          {/* Deck Name */}
          <div
            className={
              "mt-3 w-full overflow-hidden overflow-ellipsis whitespace-nowrap rounded-xl bg-main-400 p-1 text-center text-lg font-bold text-main-800 drop-shadow"
            }
          >
            {deck.name || "Untitled Deck"}
          </div>

          {/* Deck Owner */}
          {publicView && (
            <div
              className={
                "w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-lg font-bold text-main-700"
              }
            >
              {deck.user.name || "Nobody"}
            </div>
          )}

          {/* Hero Circle */}
          <div
            className={
              "absolute -bottom-24 mx-auto w-44 rounded-full bg-main-400 drop-shadow-xl"
            }
          >
            <div className={"deck-slot-hero-circle mx-auto w-40"}>
              <Image
                src={getHeroIcon(deck.hero?.name)}
                width={180}
                height={180}
                alt={deck.hero?.name || "No Hero"}
                // objectFit={"fill"}
                // layout={"fill"}
              />
            </div>
          </div>

          {/* Views */}
          <div
            className={
              "absolute bottom-3 left-4 text-center font-bold text-main-800"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>

            {views}
          </div>

          {/* Likes */}
          <div
            className={
              "absolute bottom-3 right-4 text-center font-bold text-main-800"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>

            {deck._count.favouritedBy}
          </div>
        </div>
      </Link>

      {/* Delete Icon */}
      {onDelete && (
        <div
          className={
            "absolute left-5 top-1 rounded-full bg-main-300 p-1 opacity-0 drop-shadow-xl duration-200 hover:text-red-600 group-hover:opacity-100"
          }
          onClick={(e) => {
            if (onDelete) onDelete(deck);
            e.stopPropagation();
          }}
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DeckSlot;
