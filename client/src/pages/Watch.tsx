import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";

import { IAnimeInfo } from "@consumet/extensions";
import { getAnime } from "../utils/api";

import Player from "../components/Player";

export default function Watch() {
  const location = useLocation();
  const { animeState } = location.state || {};

  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>(animeState);

  const { animeId, episodeNo } = useParams();
  const episodeNumber = Number(episodeNo);

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const handleEpisodeNavigate = (ep: number) => {
    navigate(`/${animeId}/${ep}`, { state: { animeState: animeInfo } });
  }

  useEffect(() => {
    if (!animeId || animeInfo) return;

    const fetchAnime = async () => {
      try {
        const data = await getAnime(animeId);
        setAnimeInfo(data);
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchAnime();
  }, [animeId, animeInfo])

  return (
    <>
      <Player />
      {animeInfo && (
        <>
          <p>{animeInfo.title as string}</p>
          <p>Episode {episodeNo} / {animeInfo.totalEpisodes ?? "?"}</p>
          <div className="flex gap fl-a-center">
            <button
              onClick={() => handleEpisodeNavigate(episodeNumber - 1)}
              disabled={episodeNumber <= 1}
            >
              &lt; Prev.
            </button>
            <button
              onClick={() => handleEpisodeNavigate(episodeNumber + 1)}
              disabled={episodeNumber >= (animeInfo.totalEpisodes ?? episodeNumber + 1)}
            >
              Next &gt;
            </button>
          </div>
        </>
      )}
    </>
  );
}