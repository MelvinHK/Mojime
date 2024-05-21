import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent } from "react";

import { IAnimeInfo } from "@consumet/extensions";
import { getAnime } from "../utils/api";

import Player from "../components/Player";

export default function Watch() {
  const location = useLocation();
  const { animeState } = location.state || {};

  const { animeId, episodeNo } = useParams();
  const episodeNumber = Number(episodeNo);

  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>(animeState);
  const [episodeInput, setEpisodeInput] = useState<string>(episodeNo ?? "");

  const episodeInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const handleEpisodeNavigate = (ep: number | string) => {
    if (!ep || !animeInfo.episodes?.hasOwnProperty(Number(ep) - 1))
      return;
    navigate(`/${animeId}/${ep}`, { state: { animeState: animeInfo } });
  }

  const handleEpInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === '' || /^[0-9]*$/.test(newValue)) {
      setEpisodeInput(newValue);
    }
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

  useEffect(() => {
    if (animeInfo && !animeInfo.episodes?.hasOwnProperty(episodeNumber - 1)) {
      throw new Response(
        "Error: Not Found",
        {
          status: 404,
          statusText: `Anime/Episode not found`,
        }
      );
    }
  }, [animeInfo])

  const episodeInputStyle = {
    width: episodeInput.length + 'ch', // Set width based on the length of the value
  };

  return (animeInfo && animeInfo.episodes?.hasOwnProperty(episodeNumber - 1) && episodeNo && (
    <>
      <Player episodeId={animeInfo.episodes[episodeNumber - 1].id} />
      <p>{animeInfo.title as string}</p>
      <div
        className="flex fl-a-center"
        onClick={() => episodeInputRef.current?.focus()}
      >
        <form onSubmit={(e) => (
          e.preventDefault(),
          handleEpisodeNavigate(episodeInput)
        )}
        >
          <input
            ref={episodeInputRef}
            type="number"
            value={episodeInput}
            onKeyDown={(e) => [',', '.', '+', '-'].includes(e.key) && e.preventDefault()}
            onChange={(e) => handleEpInputChange(e)}
            onBlur={() => setEpisodeInput(episodeNo)}
            style={episodeInputStyle}
            min={1}
            max={animeInfo.episodes.length}
          />
        </form>
        <p>&nbsp;/ {animeInfo.episodes.length ?? "?"}</p>
      </div>
      <div className="flex gap fl-a-center">
        <button
          onClick={() => handleEpisodeNavigate(episodeNumber - 1)}
          disabled={animeInfo.episodes?.map(ep => ep.id).indexOf(`${animeId}-episode-${episodeNo}`) === 0}
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
  ));
}