import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Button from "../components/common/button";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Collective Decks</title>
      </Head>

        <div className={"w-full p-5 flex flex-col justify-start items-center"}>
          <div className={"flex gap-2 items-center text-xl mt-20"}>
            {"Check out the player created card pool and "}
              <Link href={"/brew"}>
                        <a>
                            <Button>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Brew
                            </Button>
                        </a>
                    </Link>
              {" some decks!"}
        </div>
        </div>
    </>
  );
};

export default Home;
