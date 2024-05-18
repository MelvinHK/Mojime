import { ANIME } from "@consumet/extensions"
import { json } from "react-router-dom";

const provider = new ANIME.Gogoanime();

export const getSearch = async (query: string, page: number) => {
  try {
    const results = await provider.search(query, page);
    return results;
  } catch (error) {
    throw error;
  }
}

export const getEpisode = async (id: string) => {
  try {
    const episodes = await provider.fetchEpisodeSources(id);
    return episodes;
  } catch (error) {
    throw json(
      "Error: Episode not Found",
      {
        status: 404,
        statusText: "Not Found"
      }
    );
  }
}
