import { ANIME } from "@consumet/extensions";

const provider = new ANIME.Gogoanime();

export const getAnimeSearch = async (query: string) => {
  try {
    const results = await provider.search(query);
    
    return results;
  } catch (error) {
    console.log(error);
  }
}

