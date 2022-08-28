import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/collective_icon.png" />
                <meta property={"og:site_name"} content={"Collective Deck"} />
                <link href="https://fonts.googleapis.com/css2?family=Laila:wght@700&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Acme&display=swap" rel="stylesheet"/>
                <script data-goatcounter="https://collectivedeckcodes.goatcounter.com/count"
                        data-goatcounter-settings='{"no_onload": true, "allow_local": false}'
                        async src="//gc.zgo.at/count.js"></script>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}