import axios from "axios";

export const getSearch = async (query: string, page: number) => {
  try {
    const results = await axios.get(`/api/search/${query}/page/${page}`);
    return results.data;
  } catch (error) {
    alert(`Error: Unable to fetch search results... Try again later.`);
  }
}

export const getAnime = async (id: string) => {
  try {
    const results = await axios.get(`/api/anime/${id}`);
    return results.data;
  } catch (error) {
    throw new Response(
      "Error: Not Found",
      {
        status: 404,
        statusText: `Anime/Episode not found`,
      }
    );
  }
}

export const getEpisode = async (id: string) => {
  try {
    const results = await axios.get(`/api/episode/${id}`);
    return results.data;
  } catch (error) {
    throw new Response(
      "Error: Not Found",
      {
        status: 404,
        statusText: 'Anime/Episode not found'
      }
    );
  }
}
