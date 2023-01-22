// src/pages/_app.tsx
import "../styles/globals.css";

import type { AppType } from "next/app";
import { useRouter } from "next/router";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import { api } from "@/utils/api";

import Layout from "../components/layout/layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // https://remybeumier.be/blog/get-web-analytics-in-nextjs-with-goatcounter
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      window.goatcounter?.count({
        path: router.asPath,
      });
    }
  }, [router]);

  return (
    <>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
};
export default api.withTRPC(MyApp);
