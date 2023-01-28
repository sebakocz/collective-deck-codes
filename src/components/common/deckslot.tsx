import parrot_img from "@public/Parroting_Parrot.png";
import Image from "next/image";
import Link from "next/link";

import LabelChip from "@/components/common/labelChip";
import EyeIcon from "@/components/icons/eyeIcon";
import LikeIcon from "@/components/icons/likeIcon";
import TrashIcon from "@/components/icons/trashIcon";
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
              backgroundImage: `url(${deck.frontCard || parrot_img.src})`,
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
              />
            </div>
          </div>

          {/* Format Label */}
          {deck.format && (
            <div className={"absolute -top-4"}>
              <LabelChip label={deck.format} />
            </div>
          )}

          {/* Views */}
          <div
            className={
              "absolute bottom-3 left-4 text-center font-bold text-main-800"
            }
          >
            <EyeIcon />

            {views}
          </div>

          {/* Likes */}
          <div
            className={
              "absolute bottom-3 right-4 text-center font-bold text-main-800"
            }
          >
            <LikeIcon />

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
          <TrashIcon />
        </div>
      )}
    </div>
  );
};

export default DeckSlot;
