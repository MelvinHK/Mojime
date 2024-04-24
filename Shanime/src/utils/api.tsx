import { ANIME } from "@consumet/extensions";

const provider = new ANIME.Gogoanime();

export const getAnimeSearch = async (query: string, page: number) => {
  const results = await provider.search(query, page);
  return results;
}