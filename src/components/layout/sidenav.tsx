import collective_icon from "@public/collective_icon.png";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import BrewIcon from "@/components/icons/brewIcon";
import CreditsIcon from "@/components/icons/creditsIcon";
import DecksIcon from "@/components/icons/decksIcon";
import ExploreIcon from "@/components/icons/exploreIcon";
import HomeIcon from "@/components/icons/homeIcon";
import MobileNavIcon from "@/components/icons/mobileNavIcon";
import SignInIcon from "@/components/icons/signInIcon";
import SignOutIcon from "@/components/icons/signOutIcon";

type SidenavIconProps = {
  label: string;
  link: string;
  children: JSX.Element;
};

const SidenavIcon = ({ children, label, link }: SidenavIconProps) => {
  return (
    <Link href={link}>
      <div
        className={
          "group relative flex h-10 w-10 cursor-pointer items-center justify-center p-2"
        }
      >
        <div
          className={
            "absolute z-0 h-10 w-10 bg-main-400 duration-300 group-hover:rounded-l md:group-hover:translate-x-10 md:group-hover:scale-x-[2.9]"
          }
        ></div>
        <div
          className={
            "z-10 text-main-800 duration-200 group-hover:text-blue-500"
          }
        >
          {children}
        </div>
        <div
          className={
            "absolute -right-14 z-10 scale-x-0 text-main-900 opacity-0 duration-300 md:group-hover:scale-x-100 md:group-hover:opacity-100"
          }
        >
          {label}
        </div>
      </div>
    </Link>
  );
};

export default function Sidenav() {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={"fixed z-10 h-full md:relative"}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`h-screen w-16 flex-shrink-0 bg-main-700 p-2.5 shadow-2xl drop-shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-20"
        } duration-300 md:translate-x-0`}
      >
        <Image
          className={"circle"}
          src={collective_icon}
          alt={"Yellow Collective Logo"}
          width={200}
          height={200}
        />

        <nav className={"mt-2 flex flex-col items-center gap-3"}>
          <SidenavIcon link={"/"} label={"Home"}>
            <HomeIcon />
          </SidenavIcon>

          <SidenavIcon link={"/brew"} label={"Brew"}>
            <BrewIcon />
          </SidenavIcon>

          {session && (
            <SidenavIcon link={"/mydecks"} label={"Decks"}>
              <DecksIcon />
            </SidenavIcon>
          )}

          <SidenavIcon label={"Explore"} link={"/explore"}>
            <ExploreIcon />
          </SidenavIcon>

          <SidenavIcon
            label={"Credits"}
            link={
              "https://github.com/sebakocz/collective-deck-codes#heart-credits"
            }
          >
            <CreditsIcon />
          </SidenavIcon>

          {!session && (
            <div onClick={() => signIn("discord")}>
              <SidenavIcon link={"#"} label={"Sign In"}>
                <SignInIcon />
              </SidenavIcon>
            </div>
          )}

          {session && (
            <div onClick={() => signOut()}>
              <SidenavIcon link={"#"} label={"Sign out"}>
                <SignOutIcon />
              </SidenavIcon>
            </div>
          )}
        </nav>
      </div>

      <div
        className={`absolute bottom-5 left-4 block rounded-2xl bg-main-600 text-main-400 hover:text-main-200 md:hidden ${
          isOpen ? "rotate-180" : ""
        }`}
        onClick={(e) => {
          setIsOpen(!isOpen);
          e.stopPropagation();
        }}
      >
        <MobileNavIcon />
      </div>
    </div>
  );
}
