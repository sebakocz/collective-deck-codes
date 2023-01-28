import Link from "next/link";

import Button from "@/components/common/button";
import BrewIcon from "@/components/icons/brewIcon";
import ExploreIcon from "@/components/icons/exploreIcon";

export default function CallToActionSection() {
  return (
    <>
      <div
        className={
          "mt-10 flex flex-wrap content-center items-center gap-3 text-2xl"
        }
      >
        <p>Check out the player created cardpool and get ready to</p>

        <Link href={"/brew"}>
          <Button>
            <BrewIcon />
            Brew
          </Button>
        </Link>
      </div>

      <div
        className={
          "mt-10 flex flex-wrap content-center items-center gap-3 text-2xl"
        }
      >
        <p>Or see what the community has been brewing and go</p>

        <Link href={"/explore"}>
          <Button>
            <ExploreIcon />
            Explore
          </Button>
        </Link>
      </div>
    </>
  );
}
