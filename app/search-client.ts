import algoliasearch from "algoliasearch/lite";

import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } from "~/constants";

const applicationHost = ALGOLIA_APP_ID.toLowerCase();

export const searchClient = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY,
  {
    hosts: [
      `${applicationHost}-2.algolianet.com`,
      `${applicationHost}-3.algolianet.com`,
      `${applicationHost}-dsn.algolia.net`,
      `${applicationHost}-1.algolianet.com`,
    ],
  }
);
