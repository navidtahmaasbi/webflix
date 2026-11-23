import { InstantSearch, useHits } from "react-instantsearch-hooks-web";
import { getSearchServerState } from "./search-state.server";

function Hits() {
  useHits();
  return null;
}

test("a rejected search renders a fallback instead of crashing the server", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const searchClient = {
    search: vi.fn().mockRejectedValue(new Error("Network unavailable")),
    searchForFacetValues: vi.fn().mockResolvedValue([]),
  };

  try {
    const state = await getSearchServerState(
      <InstantSearch searchClient={searchClient} indexName="movies">
        <Hits />
      </InstantSearch>
    );
    expect(state).toEqual({ initialResults: {} });
    expect(searchClient.search).toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  } finally {
    warn.mockRestore();
  }
});

test("a search failing after the render timeout does not crash", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  let rejectSearch!: (error: Error) => void;
  const pending = new Promise((_, reject) => { rejectSearch = reject; });
  const searchClient = {
    search: vi.fn().mockReturnValue(pending),
    searchForFacetValues: vi.fn().mockResolvedValue([]),
  };

  try {
    const state = await getSearchServerState(
      <InstantSearch searchClient={searchClient} indexName="movies">
        <Hits />
      </InstantSearch>
    );
    expect(state).toEqual({ initialResults: {} });
    rejectSearch(new Error("Late network failure"));
    await new Promise((resolve) => setTimeout(resolve, 20));
  } finally {
    warn.mockRestore();
  }
}, 15000);
