import { ANIME } from "@consumet/extensions";

const provider = new ANIME.Gogoanime();

export const getAnimeSearch = async (query: string) => {
  const results = await provider.search(query);
  return results;
}

