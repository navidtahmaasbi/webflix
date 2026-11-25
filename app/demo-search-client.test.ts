import { searchDemo } from "./demo-search-client";

test("demo catalog supports search, genre filters and pagination", () => {
  expect(searchDemo().nbHits).toBe(10);
  expect(searchDemo({ query: "stranger" }).hits[0].title).toBe("Stranger Things");
  expect(searchDemo({ query: "no-such-show" }).nbHits).toBe(0);
  expect(searchDemo({ hitsPerPage: 1, page: 1 }).hits).toHaveLength(1);
  const filtered = searchDemo({ facetFilters: [["genres:Drama"]] });
  expect(filtered.hits.every((show) => show.genres.includes("Drama"))).toBe(true);
});

