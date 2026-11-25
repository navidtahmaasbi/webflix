import { useEffect, useState } from "react";

const key = "webflix-library-v1";
export type Library = { saved: string[]; liked: string[]; recent: string[] };
const empty: Library = { saved: [], liked: [], recent: [] };
export function updateLibrary(
  library: Library,
  action: "saved" | "liked" | "recent",
  id: string
): Library {
  const values = library[action];
  return {
    ...library,
    [action]:
      action === "recent"
        ? [id, ...values.filter((value) => value !== id)].slice(0, 20)
        : values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
  };
}
export function useLibrary() {
  const [library, setLibrary] = useState<Library>(empty);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "null");
      if (stored)
        setLibrary({
          saved: Array.isArray(stored.saved)
            ? stored.saved.filter((v: unknown) => typeof v === "string")
            : [],
          liked: Array.isArray(stored.liked)
            ? stored.liked.filter((v: unknown) => typeof v === "string")
            : [],
          recent: Array.isArray(stored.recent)
            ? stored.recent.filter((v: unknown) => typeof v === "string")
            : [],
        });
    } catch {
      /* A private browser or invalid saved data starts with an empty library. */
    }
  }, []);
  function update(action: "saved" | "liked" | "recent", id: string) {
    setLibrary((previous) => {
      const next = updateLibrary(previous, action, id);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Browsing still works without storage. */
      }
      return next;
    });
  }
  return { library, update };
}
