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

    fetchEpisode();
  }, [animeId, episodeNo])

  return (
    <div id="player-container">
      <div id="player-ratio">
        <div id="iframe">
          {episodeData &&
            <p>Episode loaded</p>
          }
        </div>
      </div>
    </div>

  );
}