import { ANIME } from "@consumet/extensions";

const provider = new ANIME.Gogoanime();

// Switch to AniList or something better. Some results have empty titles such as Oshi No Ko.
export const getAnimeSearch = async (query: string, page: number) => {
  const results = await provider.search(query, page);
  return results;
}