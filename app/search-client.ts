import type algoliasearch from "algoliasearch/lite";
import { demoSearchClient } from "./demo-search-client";

// Keep the existing UI's search protocol while all queries execute locally.
export const searchClient = demoSearchClient as unknown as ReturnType<typeof algoliasearch>;
