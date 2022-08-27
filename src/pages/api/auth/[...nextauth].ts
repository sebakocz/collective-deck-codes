import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

import parrotImg from "/public/Parroting_Parrot.png";

// const confirmPasswordHash = (plainPassword: string, hashedPassword: string) => {
//   return new Promise(resolve => {
//     bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
//       resolve(res);
//     });
//   })
// }

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID || "",
        clientSecret: process.env.DISCORD_CLIENT_SECRET || ""
      }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
  //   CredentialsProvider({
  //     name: "Credentials",
  //     credentials: {
  //       email: {
  //         label: "Email",
  //         type: "text",
  //         placeholder: "Email pls"
  //       },
  //       password: {
  //         label: "Password",
  //         type: "password"
  //       }
  //     },
  //     async authorize(credentials, _req) {
  //
  //       if(typeof credentials == 'undefined'){
  //         console.log("No Credentials? "+credentials)
  //         return
  //       }
  //       try
  //       {
  //         const user = await prisma.user.findFirst({
  //           where: {
  //             email: credentials.email
  //           }
  //         });
  //
  //         if (user !== null)
  //         {
  //           //Compare the hash
  //           const res = await confirmPasswordHash(credentials.password, user.password);
  //           if (res === true)
  //           {
  //             const userAccount:any = {
  //               id: user.id,
  //               email: user.email
  //             };
  //             return {...userAccount};
  //           }
  //           else
  //           {
  //             console.log("Hash not matched logging in");
  //             return null;
  //           }
  //         }
  //         else {
  //           return null;
  //         }
  //       }
  //       catch (err)
  //       {
  //         console.log("Authorize error:", err);
  //       }
  //     },
  //   }),
  ],
  // secret: "asdasd",
  // important if we want to use CredentialsProvider
  // session: {strategy: 'jwt'},
    theme: {
        colorScheme: 'auto', // "auto" | "dark" | "light"
        brandColor: '#E4D6C1', // Hex color code #33FF5D
        logo: parrotImg.src, // Absolute URL to image
    },
    // created to modify the next-auth types to include the custom types: id
    callbacks: {
        // @ts-ignore
        session: async ({session, user}) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        }
    },
};

export default NextAuth(authOptions);
