import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";

export default function Player() {
  const [episodeData, setEpisodeData] = useState();

  const { animeId } = useParams();
  const { episodeNo } = useParams();

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!animeId || !episodeNo) return;

    const fetchEpisode = async () => {
      try {
        const data = await getEpisode(animeId, episodeNo);
        console.log("Episode fetched.")
        setEpisodeData(data);
      } catch (error) {
        showBoundary(error);
      }
    }

    setEpisodeData(undefined);
    fetchEpisode();
  }, [animeId, episodeNo])

  if (episodeData)
    return (
      <>
        <p>Episode loaded</p>
      </>
    );
}