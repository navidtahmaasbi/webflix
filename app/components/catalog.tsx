import { persianTitles } from "~/data/persian";
import { useI18n } from "~/i18n";
import { Dialog } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import catalogData from "~/data/demo-shows.json";
import { useLibrary } from "~/hooks/useLibrary";
import { Main } from "~/layout/main";
import {
  useOptionalUser,
  useOptionalFavoriteShowsWithNewSeasons,
} from "~/utils";
type Title = typeof catalogData[number];
type Mode = "home" | "movies" | "shows" | "list";

const image = (item: Title, poster = false) =>
  `/catalog/original${poster ? item.poster_path : item.backdrop_path}`;

const trailer = (item: Title) =>
  item.videos.find((video) => video.site === "YouTube");

export function Catalog({
  mode = "home",
  initialTitle,
}: {
  mode?: Mode;
  initialTitle?: string;
}) {
  const { t, locale, number } = useI18n();
  const catalog = catalogData.map((item) =>
    locale === "fa" && persianTitles[item.objectID]
      ? { ...item, ...persianTitles[item.objectID] }
      : item
  );
  const duration = (item: Title) =>
    item.record_type === "movie"
      ? number(item.runtime || 0) + (locale === "fa" ? " دقیقه" : " min")
      : number(item.number_of_seasons) +
        (locale === "fa" ? " فصل" : " seasons");
  const user = useOptionalUser();
  const favorites = useOptionalFavoriteShowsWithNewSeasons();
  const { library, update } = useLibrary();
  const [selectedOriginal, setSelected] = useState<Title | null>(
    catalog.find((item) => item.objectID === initialTitle) || null
  );
  const [playing, setPlaying] = useState(false);
  const [genre, setGenre] = useState("All genres");
  const [sort, setSort] = useState("featured");
  const [season, setSeason] = useState(0);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const featured = catalog[0];
  const selected =
    selectedOriginal &&
    catalog.find((item) => item.objectID === selectedOriginal.objectID);
  let items = catalog.filter(
    (item) =>
      (mode !== "movies" || item.record_type === "movie") &&
      (mode !== "shows" || item.record_type === "show") &&
      (mode !== "list" || library.saved.includes(item.objectID)) &&
      (genre === "All genres" || item.genres.includes(genre))
  );
  if (sort === "title")
    items = [...items].sort((a, b) => a.title.localeCompare(b.title, locale));
  if (sort === "year")
    items = [...items].sort(
      (a, b) =>
        (b.release_date || b.first_air_date || 0) -
        (a.release_date || a.first_air_date || 0)
    );

  function open(item: Title, play = false) {
    setSelected(item);
    setPlaying(play);
    setSeason(0);
    update("recent", item.objectID);
  }

  function save(item: Title) {
    update("saved", item.objectID);
    setNotice(
      library.saved.includes(item.objectID)
        ? locale === "fa"
          ? `${item.title} از فهرست من حذف شد`
          : `${item.title} removed from My List`
        : locale === "fa"
        ? `${item.title} به فهرست من اضافه شد`
        : `${item.title} added to My List`
    );
  }

  const card = (item: Title, rank?: number) => (
    <article className="nf-card" key={item.objectID}>
      <button
        className="nf-card-art"
        onClick={() => open(item)}
        aria-label={
          locale === "fa"
            ? `جزئیات ${item.title}`
            : `More info about ${item.title}`
        }
      >
        {rank && <span className="nf-rank">{number(rank)}</span>}
        <img src={image(item)} alt="" loading="lazy" />
        <span className="nf-card-type">
          {item.record_type === "movie" ? t("FILM") : t("SERIES")}
        </span>
      </button>
      <div className="nf-card-info">
        <button className="nf-card-title" onClick={() => open(item)}>
          {item.title}
        </button>
        <button
          className="nf-round"
          aria-label={
            locale === "fa"
              ? `${library.saved.includes(item.objectID) ? "حذف" : "ذخیره"} ${
                  item.title
                } در فهرست من`
              : `${library.saved.includes(item.objectID) ? "Remove" : "Add"} ${
                  item.title
                } ${
                  library.saved.includes(item.objectID) ? "from" : "to"
                } My List`
          }
          aria-pressed={library.saved.includes(item.objectID)}
          onClick={() => save(item)}
        >
          {library.saved.includes(item.objectID) ? "✓" : "+"}
        </button>
      </div>
      <p className="nf-card-meta">
        {duration(item)} <span>•</span> {t(item.genres[0])}
      </p>
    </article>
  );

  const rows = [
    {
      title: t("Your next discovery"),
      subtitle: t("A little mystery. A lot to explore."),
      items: catalog,
      ranked: true,
    },
    {
      title: t("Recently explored"),
      subtitle: t("Pick up where your curiosity left off"),
      items: library.recent
        .map((id) => catalog.find((item) => item.objectID === id)!)
        .filter(Boolean),
    },
    {
      title: t("My List"),
      subtitle: t("The titles you saved for later"),
      items: catalog.filter((item) => library.saved.includes(item.objectID)),
    },
    {
      title: t("Binge-worthy series"),
      subtitle: t("Meet your next favorite characters"),
      items: catalog.filter((item) => item.record_type === "show"),
    },
    {
      title: t("Movie night"),
      subtitle: t("Classics that stand the test of time"),
      items: catalog.filter((item) => item.record_type === "movie"),
    },
    {
      title: t("Dark & suspenseful"),
      subtitle: t("Keep the lights on"),
      items: catalog.filter((item) =>
        item.genres.some((g) => ["Horror", "Thriller", "Mystery"].includes(g))
      ),
    },
  ];
  return (
    <Main user={user} favoriteShows={favorites}>
      <main className="nf-page">
        {mode === "home" ? (
          <>
            <section className="nf-hero" aria-label={t("Featured title")}>
              <img className="nf-hero-art" src={image(featured)} alt="" />
              <div className="nf-hero-shade" />
              <div className="nf-hero-copy">
                <p className="nf-eyebrow">
                  {t("WEBFLIX \u2022 FEATURED SERIES")}
                </p>
                <h1>{featured.title}</h1>
                <p className="nf-tagline">{featured.tagline}</p>
                <p className="nf-overview">{featured.overview}</p>
                <div className="nf-actions">
                  <button
                    className="nf-primary"
                    onClick={() => open(featured, true)}
                  >
                    {t("\u25B6 Watch trailer")}
                  </button>
                  <button
                    className="nf-secondary"
                    onClick={() => open(featured)}
                  >
                    {t("\u24D8 More info")}
                  </button>
                  <button
                    className="nf-round"
                    onClick={() => save(featured)}
                    aria-label={t("Save featured title")}
                    aria-pressed={library.saved.includes(featured.objectID)}
                  >
                    {library.saved.includes(featured.objectID) ? "✓" : "+"}
                  </button>
                </div>
                <p className="nf-hero-note">
                  {featured.genres.map(t).join(" · ")}{" "}
                  <span> • {duration(featured)}</span>
                </p>
              </div>
            </section>
            <div className="nf-rows">
              {rows
                .filter((row) => row.items.length)
                .map((row) => (
                  <TitleRow
                    key={row.title}
                    title={row.title}
                    subtitle={row.subtitle}
                  >
                    {row.items.map((item, index) =>
                      card(item, row.ranked ? index + 1 : undefined)
                    )}
                  </TitleRow>
                ))}
            </div>
          </>
        ) : (
          <section className="nf-browse">
            <div className="nf-browse-heading">
              <div>
                <p className="nf-eyebrow">
                  {t("YOUR PERSONAL SCREENING ROOM")}
                </p>
                <h1>
                  {mode === "list"
                    ? t("My List")
                    : mode === "movies"
                    ? t("Movies")
                    : t("TV Shows")}
                </h1>
                <p>
                  {number(items.length)}
                  {t("titles")}{" "}
                  {mode === "list"
                    ? t("saved on this browser")
                    : t("in the local collection")}
                </p>
              </div>
              <div className="nf-selects">
                <label>
                  {t("Genre")}
                  <select
                    value={genre}
                    onChange={(event) => setGenre(event.target.value)}
                  >
                    <option value="All genres">{t("All genres")}</option>
                    {Array.from(new Set(catalog.flatMap((item) => item.genres)))
                      .sort()
                      .map((g) => (
                        <option key={g} value={g}>
                          {t(g)}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  {t("Sort by")}
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="featured">{t("Featured")}</option>
                    <option value="title">{t("Title A\u2013Z")}</option>
                    <option value="year">{t("Release year")}</option>
                  </select>
                </label>
              </div>
            </div>
            {items.length ? (
              <div className="nf-grid">{items.map((item) => card(item))}</div>
            ) : (
              <div className="nf-empty">
                <span>＋</span>
                <h2>
                  {mode === "list" && genre === "All genres"
                    ? t("Make room for your favorites")
                    : t("No titles in this selection")}
                </h2>
                <p>
                  {t(
                    "Use the + button on any title to save it, or try another genre."
                  )}
                </p>
                <Link className="nf-primary" to="/">
                  {t("Explore titles")}
                </Link>
              </div>
            )}
          </section>
        )}
        <footer className="nf-footer">
          <strong>{t("WEBFLIX")}</strong>
          <p>{t("A small collection. A big-screen feeling.")}</p>
          <p>
            {t(
              "10 sample titles \xB7 Local search & saved list \xB7 Original cover artwork"
            )}
          </p>
          <p>
            {t(
              "Trailers require internet. Full movies and episodes are not included."
            )}
          </p>
        </footer>
        <p className="nf-status" role="status">
          {notice}
        </p>
      </main>
      <Dialog
        open={selected !== null}
        onClose={() => {
          setSelected(null);
          setPlaying(false);
        }}
        className="nf-dialog"
      >
        <div className="nf-dialog-backdrop" aria-hidden="true" />
        <div className="nf-dialog-scroll">
          <Dialog.Panel className="nf-dialog-panel">
            {selected && (
              <>
                <button
                  className="nf-close"
                  aria-label={t("Close title details")}
                  onClick={() => {
                    setSelected(null);
                    setPlaying(false);
                  }}
                >
                  ×
                </button>
                <div className="nf-detail-art">
                  {playing && trailer(selected) ? (
                    <iframe
                      title={`${selected.title} trailer`}
                      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                        trailer(selected)!.key
                      )}?autoplay=1`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img src={image(selected)} alt="" />
                  )}
                </div>
                <div className="nf-detail-body">
                  <p className="nf-eyebrow">
                    {selected.record_type === "movie"
                      ? t("FEATURE FILM")
                      : t("TV SERIES")}
                  </p>
                  <Dialog.Title as="h2">{selected.title}</Dialog.Title>
                  <div className="nf-actions">
                    {trailer(selected) ? (
                      <button
                        className="nf-primary"
                        onClick={() => setPlaying(true)}
                      >
                        ▶ {playing ? t("Trailer playing") : t("Watch trailer")}
                      </button>
                    ) : (
                      <span className="nf-unavailable">
                        {t("Trailer unavailable for this sample")}
                      </span>
                    )}
                    <button
                      className="nf-secondary"
                      onClick={() => save(selected)}
                      aria-pressed={library.saved.includes(selected.objectID)}
                    >
                      {library.saved.includes(selected.objectID)
                        ? t("\u2713 In My List")
                        : t("+ My List")}
                    </button>
                    <button
                      className="nf-round"
                      aria-label={
                        locale === "fa"
                          ? `پسندیدن ${selected.title}`
                          : `Like ${selected.title}`
                      }
                      aria-pressed={library.liked.includes(selected.objectID)}
                      onClick={() => update("liked", selected.objectID)}
                    >
                      {library.liked.includes(selected.objectID) ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="nf-detail-columns">
                    <div>
                      <p className="nf-detail-meta">
                        {duration(selected)} ·{" "}
                        {selected.vote_average
                          ? `${number(selected.vote_average)}/${number(10)}`
                          : t("Classic cinema")}
                      </p>
                      <Dialog.Description>
                        {selected.overview}
                      </Dialog.Description>
                    </div>
                    <div className="nf-detail-facts">
                      <p>
                        <span>{t("Genres:")}</span>{" "}
                        {selected.genres.map(t).join(", ")}
                      </p>
                      {selected.cast.length > 0 && (
                        <p>
                          <span>{t("Cast:")}</span>{" "}
                          {selected.cast
                            .slice(0, 6)
                            .map((actor) => actor.name)
                            .join(", ")}
                        </p>
                      )}
                      <p>
                        <span>{t("Collection:")}</span>
                        {t("Local demo catalog")}
                      </p>
                    </div>
                  </div>
                  {selected.seasons.length > 0 && (
                    <section className="nf-seasons">
                      <div>
                        <h3>{t("Seasons")}</h3>
                        <select
                          aria-label={t("Choose a season")}
                          value={season}
                          onChange={(event) =>
                            setSeason(Number(event.target.value))
                          }
                        >
                          {selected.seasons.map((s, index) => (
                            <option key={s.season_number} value={index}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <h4>
                        {locale === "fa"
                          ? `فصل ${number(
                              selected.seasons[season]?.season_number || 0
                            )}`
                          : selected.seasons[season]?.name}
                      </h4>
                      <p>
                        {number(selected.seasons[season]?.episode_count || 0)}
                        {t("episodes \xB7")}{" "}
                        {(locale === "fa"
                          ? ""
                          : selected.seasons[season]?.overview) ||
                          t("Explore the next chapter of this series.")}
                      </p>
                    </section>
                  )}
                  <h3 className="nf-similar-heading">{t("More like this")}</h3>
                  <div className="nf-similar">
                    {catalog
                      .filter(
                        (item) =>
                          item.objectID !== selected.objectID &&
                          item.genres.some((g) => selected.genres.includes(g))
                      )
                      .slice(0, 3)
                      .map((item) => (
                        <button key={item.objectID} onClick={() => open(item)}>
                          <img src={image(item)} alt="" />
                          <span>{item.title}</span>
                        </button>
                      ))}
                  </div>
                  <p className="nf-disclaimer">
                    {t(
                      "Sample title information and trailers. Full video playback is not available."
                    )}
                  </p>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Main>
  );
}

function TitleRow({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { t, locale, number } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section className="nf-row">
      <div className="nf-row-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="nf-row-controls">
          <button
            aria-label={
              locale === "fa" ? `قبلی در ${title}` : `Scroll ${title} left`
            }
            onClick={() =>
              ref.current?.scrollBy({
                left:
                  (locale === "fa" ? 1 : -1) * ref.current.clientWidth * 0.8,
                behavior: "smooth",
              })
            }
          >
            {locale === "fa" ? "›" : "‹"}
          </button>
          <button
            aria-label={
              locale === "fa" ? `بعدی در ${title}` : `Scroll ${title} right`
            }
            onClick={() =>
              ref.current?.scrollBy({
                left:
                  (locale === "fa" ? -1 : 1) * ref.current.clientWidth * 0.8,
                behavior: "smooth",
              })
            }
          >
            {locale === "fa" ? "‹" : "›"}
          </button>
        </div>
      </div>
      <div
        className="nf-carousel genre-filter__scroll"
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        {children}
      </div>
    </section>
  );
}
