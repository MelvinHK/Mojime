import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getSearch = async (query: string, page: number) => {
  try {
    const results = await axios.get(`${apiUrl}/api/search/${query}/page/${page}`, {
      timeout: 10000
    });
    return results.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      alert('Error: Request timed out; the search took too long. Maybe try again.');
    } else {
      alert(`Error: Unable to fetch search results... Try again later.`);
    }
  }
}

const handlePageContentError = (error: any) => {
  if (error.code === 'ECONNABORTED') {
    throw error;
  } else {
    throw new Response(
      "Error: Not Found",
      {
        status: 404,
        statusText: `Anime/Episode not found`,
      }
    );
  }
}

export const getAnime = async (id: string) => {
  try {
    const results = await axios.get(`${apiUrl}/api/anime/${id}`, {
      timeout: 15000
    });
    return results.data;
  } catch (error) {
    handlePageContentError(error);
  }
}

export const getEpisode = async (id: string) => {
  try {
    const results = await axios.get(`${apiUrl}/api/episode/${id}`, {
      timeout: 15000
    });
    return results.data;
  } catch (error) {
    handlePageContentError(error);
  }
}