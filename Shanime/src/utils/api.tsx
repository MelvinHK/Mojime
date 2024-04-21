import { ANIME } from "@consumet/extensions";

const provider = new ANIME.Gogoanime();

export const getAnimeSearch = async (query: string, page: number) => {
  try {
    const results = await provider.search(query, page);
    return results;

  } catch (error) {
    console.log(error);
  }
}

