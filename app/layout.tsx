import "./globals.css";
import "../styles/tokens.css";
import type { Metadata } from "next";
import TopbarActive from "./_components/TopbarActive";

export const metadata: Metadata = {
  title: "AI Studio B2BcAI",
  description: "Демо-сайт студии: AI KP, AI TOK, AI DOC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <TopbarActive />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
