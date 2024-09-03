import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getSearch = async (query: string, subOrDub: "sub" | "dub", signal?: AbortSignal) => {
  try {
    const response = await axios.get(`${apiUrl}/api/searchV2`, {
      params: { query: query, subOrDub: subOrDub },
      signal: signal
    });
    return response.data;
  } catch (error: any) {
    if (error.code === "ERR_CANCELED") {
      throw error;
    }
    if (error.response?.status === 429) {
      window.alert("Error 429: Submitted too many search requests... Please try again in a few seconds.");
      return;
    }
    window.alert("Unknown Error: An unknown error occured with the search... Maybe try again later.");
  }
}

export const throwNotFoundError = (msg: string) => {
  throw new Response(
    "Error: Not Found",
    {
      status: 404,
      statusText: msg
    }
  );
}

const handlePageContentError = (error: any) => {
  if (error.code === 'ECONNABORTED') {
    throw error;
  } else if (error.code === 'ERR_CANCELED') {
    throw error;
  } else if (error.response && error.response.status === 429) {
    throw new Response(
      "Error: Rate Limit Exceeded",
      {
        status: 429,
        statusText: `Submitted too many requests; please slow down! Reload after 1 minute to try again.`,
      }
    );
  } else {
    throwNotFoundError('Anime/Episode not found');
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

export const getEpisode = async (id: string, signal: AbortSignal) => {
  try {
    const results = await axios.get(`${apiUrl}/api/episode/${id}`, {
      timeout: 15000,
      signal: signal
    });
    return results.data;
  } catch (error) {
    handlePageContentError(error);
  }
}