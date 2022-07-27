import parrot_img from "../../../public/Parroting_Parrot.png"
import Image from "next/image";
import {useSession, signOut, signIn} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";


type SidenavIconProps = {
    label: string,
    link: string,
    children: JSX.Element
}

const SidenavIcon = ({children, label, link}: SidenavIconProps) => {
    return(
        <Link href={link}>
            <div className={"group w-10 h-10 p-2 flex items-center justify-center relative cursor-pointer"}>
                <div className={"bg-main-400 w-10 h-10 absolute z-0 group-hover:rounded-l md:group-hover:scale-x-[2.9] md:group-hover:translate-x-10 duration-300"}>

                </div>
                <div className={"z-10 text-main-800 group-hover:text-blue-500 duration-200"}>
                    {children}
                </div>
                <div className={"z-10 text-main-900 absolute -right-14 opacity-0 scale-x-0 md:group-hover:scale-x-100 md:group-hover:opacity-100 duration-300"}>
                    {label}
                </div>
            </div>
        </Link>

    )
}

export default function Sidenav(){
    const { data: session } = useSession()

    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className={"fixed md:relative z-10 h-full"} onClick={() => setIsOpen(false)}>
            <div className={`bg-main-700 flex-shrink-0 w-16 p-2.5 drop-shadow-xl shadow-2xl h-screen ${isOpen ? "translate-x-0" : "-translate-x-20"} duration-300 md:translate-x-0`}>
                <Image className={"circle"} src={parrot_img} alt={"Parrot Logo"} width={200} height={200}/>

                <nav className={"flex flex-col gap-3 items-center mt-2"}>
                    <SidenavIcon link={"/"} label={"Home"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </SidenavIcon>

                    <SidenavIcon link={"/brew"} label={"Brew"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </SidenavIcon>

                    {session &&
                        <SidenavIcon link={"/mydecks"} label={"Decks"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </SidenavIcon>
                    }

                    <SidenavIcon label={"Credits"} link={"https://github.com/sebakocz/collective-deck-codes#heart-credits"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </SidenavIcon>

                    {!session &&
                        <div onClick={() => signIn('discord')}>
                            <SidenavIcon link={"#"} label={"Sign In"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </SidenavIcon>
                        </div>
                    }

                    {session &&
                    <div onClick={() => signOut()}>
                        <SidenavIcon
                            link={"#"}
                            // link={"/api/auth/signout"}
                            label={"Sign out"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </SidenavIcon>
                    </div>                    }
                </nav>
            </div>

            <div
                className={`block md:hidden text-main-400 hover:text-main-200 absolute bottom-5 left-4 bg-main-600 rounded-2xl ${isOpen ? "rotate-180" : ""}`}
                onClick={(e) => {
                    setIsOpen(!isOpen)
                    e.stopPropagation()
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    )
}