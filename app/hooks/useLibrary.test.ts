import { updateLibrary } from "./useLibrary";
const initial = { saved: [], liked: [], recent: [] };
test("saved titles toggle without changing likes", () => {
  const added = updateLibrary(initial, "saved", "movie_289");
  expect(added.saved).toEqual(["movie_289"]);
  expect(updateLibrary(added, "saved", "movie_289").saved).toEqual([]);
  expect(added.liked).toEqual([]);
});
test("recent titles move to the front without duplicates", () => {
  const state = { ...initial, recent: ["a", "b"] };
  expect(updateLibrary(state, "recent", "b").recent).toEqual(["b", "a"]);
});
