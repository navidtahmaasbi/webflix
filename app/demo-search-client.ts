import { normalizeSearch, persianTitles } from "./data/persian";
import { translate } from "./i18n";
import shows from "./data/demo-shows.json";

type Params = {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  facetFilters?: (string | string[])[];
};

export function searchDemo(params: Params = {}) {
  const query = normalizeSearch(params.query || "");
  const matches = shows.filter((show) => {
    const text = normalizeSearch(
      [
        show.title,
        show.overview,
        persianTitles[show.objectID]?.title || "",
        persianTitles[show.objectID]?.overview || "",
        ...show.genres.flatMap((g) => [g, translate(g, "fa")]),
        ...show.cast.map((actor) => actor.name),
      ].join(" ")
    );
    return (
      text.includes(query) &&
      (params.facetFilters || []).every((filter) =>
        (Array.isArray(filter) ? filter : [filter]).some((value) => {
          const [attribute, name] = value.split(":");
          return attribute !== "genres" || show.genres.includes(name);
        })
      )
    );
  });
  const facets = { genres: {} as Record<string, number> };
  matches.forEach((show) =>
    show.genres.forEach((genre) => {
      facets.genres[genre] = (facets.genres[genre] || 0) + 1;
    })
  );
  const page = params.page || 0;
  const hitsPerPage = params.hitsPerPage ?? 20;
  return {
    hits: matches.slice(page * hitsPerPage, (page + 1) * hitsPerPage),
    nbHits: matches.length,
    page,
    nbPages: hitsPerPage ? Math.ceil(matches.length / hitsPerPage) : 0,
    hitsPerPage,
    facets,
    exhaustiveNbHits: true,
    exhaustiveFacetsCount: true,
    processingTimeMS: 0,
    query,
    params: "",
  };
}

export const demoSearchClient = {
  search(requests: { params?: Params | string }[]) {
    return Promise.resolve({
      results: requests.map(({ params }) =>
        searchDemo(
          typeof params === "string"
            ? Object.fromEntries(new URLSearchParams(params))
            : params
        )
      ),
    });
  },
  searchForFacetValues() {
    return Promise.resolve([
      { facetHits: [], exhaustiveFacetsCount: true, processingTimeMS: 0 },
    ]);
  },
};
