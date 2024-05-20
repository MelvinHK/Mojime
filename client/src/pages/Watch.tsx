import { useParams, useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";

import { IAnimeInfo } from "@consumet/extensions";
import { getAnime } from "../utils/api";

import Player from "../components/Player";

export default function Watch() {
  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>();

  const { animeId } = useParams();
  const { episodeNo } = useParams();

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!animeId) return;

    const fetchAnime = async () => {
      try {
        const data = await getAnime(animeId)
        setAnimeInfo(data);
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchAnime();
  }, [animeId])

  return (
    <>
      <Player />
      {animeInfo && (animeInfo.id === animeId) && (
        <>
          <p>{animeInfo.title as string}</p>
          <p>Episode {episodeNo} / {animeInfo?.totalEpisodes}</p>
          <div className="flex gap fl-a-center">
            <button onClick={() => navigate(`/${animeId}/${Number(episodeNo) - 1}`)}>
              &lt; Prev.
            </button>

            <button onClick={() => (navigate(`/${animeId}/${Number(episodeNo) + 1}`))}>
              Next &gt;
            </button>
          </div>
        </>
      )}
    </>
  );
}