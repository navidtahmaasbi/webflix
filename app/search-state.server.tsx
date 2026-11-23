import { useContext } from "react";
import type { ReactNode } from "react";
import type { InstantSearch } from "instantsearch.js";
import { InstantSearchServerContext } from "react-instantsearch-hooks-web";
import { getServerState } from "react-instantsearch-hooks-server";

// This InstantSearch version emits search errors outside getServerState's promise.
export async function getSearchServerState(children: ReactNode) {
  let search: InstantSearch | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let reportError: (error: unknown) => void;
  const failure = new Promise<never>((_, reject) => {
    reportError = reject;
    timeout = setTimeout(() => reject(new Error("Search timed out")), 8000);
  });

  function CaptureSearch() {
    const context = useContext(InstantSearchServerContext)!;
    return (
      <InstantSearchServerContext.Provider
        value={{
          notifyServer(params) {
            search = params.search;
            search.on("error", reportError);
            context.notifyServer(params);
          },
        }}
      >
        {children}
      </InstantSearchServerContext.Provider>
    );
  }

  try {
    return await Promise.race([getServerState(<CaptureSearch />), failure]);
  } catch (error) {
    console.warn("Search unavailable during server rendering:", error);
    // Render the page shell and let the browser retry search after hydration.
    return { initialResults: {} };
  } finally {
    clearTimeout(timeout);
    const helper = search?.mainHelper;
    search?.dispose();
    // dispose() removes listeners, but cannot cancel an in-flight HTTP request.
    // Its eventual rejection still emits on this helper after the page returns.
    helper?.on("error", () => {});
  }
}
