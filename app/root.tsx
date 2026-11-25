import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LanguageProvider, useI18n } from "~/i18n";
import type { Locale } from "~/i18n";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import type { ReturnedGetFavoriteShows } from "~/models/show.server";
import { getFavoriteShows } from "~/models/show.server";

import type { User } from "@prisma/client";
import type { ReturnedGetUser } from "~/session.server";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import appStylesheetUrl from "./styles/app.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: appStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Webflix",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: ReturnedGetUser;
  favoriteShowsWithNewSeasons?: ReturnedGetFavoriteShows;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale: Locale = /(?:^|;\s*)webflix-locale=fa(?:;|$)/.test(
    request.headers.get("Cookie") || ""
  )
    ? "fa"
    : "en";
  const today = new Date();

  const user = await getUser(request);

  if (user) {
    const favoriteShows = await getFavoriteShows(user as User);
    const favoriteShowsWithNewSeasons = favoriteShows.filter((show) => {
      return show.seasons.find((season) => {
        const viewed = season.episodes.find((episode) =>
          episode.viewedBy.includes(user as User)
        );
        const { airDate } = season.episodes[0] || { airDate: null };
        const releaseDate = airDate && new Date(airDate);

        if (!releaseDate) {
          return true;
        }

        return releaseDate.getFullYear() >= today.getFullYear() && !viewed;
      });
    });

    return json({ user, favoriteShowsWithNewSeasons, locale });
  }

  return json({ user, locale });
};

export default function App() {
  const { locale } = useLoaderData<{ locale: Locale }>();
  return (
    <LanguageProvider initialLocale={locale}>
      <Document />
    </LanguageProvider>
  );
}

function Document() {
  const { locale } = useI18n();
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="h-full"
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-x-hidden bg-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
