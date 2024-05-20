import { json } from "react-router-dom";
import axios from "axios";

export const getSearch = async (query: string, page: number) => {
  try {
    const results = await axios.get(`/api/search/${query}/page/${page}`);
    return results.data;
  } catch (error) {
    alert(`Error: Unable to fetch results... Try again later.`);
  }
}

export const getEpisode = async (id: string) => {
  try {
    const results = await axios.get(`/api/episode/${id}`);
    console.log(results.data);
    return results.data;
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
