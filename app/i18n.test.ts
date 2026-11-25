import { translate } from "./i18n";
import { normalizeSearch } from "./data/persian";
import { searchDemo } from "./demo-search-client";
test("Persian interface strings and English fallback", () => {
  expect(translate("Movies", "fa")).toBe("فیلم‌ها");
  expect(translate("Movies", "en")).toBe("Movies");
  expect(translate("Unknown title", "fa")).toBe("Unknown title");
});
test("local search recognizes Persian titles and Arabic character variants", () => {
  expect(searchDemo({ query: "کازابلانکا" }).hits[0].title).toBe("Casablanca");
  expect(searchDemo({ query: "كازابلانكا" }).hits[0].title).toBe("Casablanca");
  expect(normalizeSearch("چيزهاي عجيب")).toBe("چیزهای عجیب");
});
