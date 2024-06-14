import { useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent, useContext } from "react";

import { getAnime } from "../utils/api";

import LoadingAnimation from "./LoadingAnimation";
import { WatchContext } from "../contexts/WatchProvider";
import { navigateToEpisode } from "../utils/navigateToEpisode";

import Player from "./Player";

export default function Watch() {
  const { animeInfo, setAnimeInfo, episodeNoState, setEpisodeNoState } = useContext(WatchContext);

  const { animeId } = useParams();

  const [episodeInput, setEpisodeInput] = useState<string>(episodeNoState ?? "");

  const episodeInputRef = useRef<HTMLInputElement>(null);

  const { showBoundary } = useErrorBoundary();

  const handleEpisodeNavigate = (ep: number | string) => {
    if (!ep || !animeInfo?.episodes?.hasOwnProperty(Number(ep) - 1)) {
      return;
    }
    navigateToEpisode(ep, setEpisodeNoState);
  }

  const handleEpInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length > String(animeInfo?.episodes?.length).length) {
      return;
    }
    if (newValue === '' || /^[0-9]*$/.test(newValue)) {
      setEpisodeInput(newValue);
    }
  }

  useEffect(() => {
    if (!animeId || animeId === animeInfo?.id || !episodeNoState) {
      return;
    }

    const fetchAnime = async () => {
      try {
        const data = await getAnime(animeId);
        if (!data.episodes?.hasOwnProperty(Number(episodeNoState) - 1)) {
          throw new Response(
            "Error: Not Found",
            {
              status: 404,
              statusText: `Anime/Episode not found`
            }
          );
        }
        setAnimeInfo(data);
      } catch (error) {
        showBoundary(error);
      }
    }

    setAnimeInfo(undefined);
    fetchAnime();
  }, [animeInfo, animeId, episodeNoState])

  useEffect(() => {
    if (episodeNoState && animeInfo)
      document.title = `${animeInfo?.title} Ep.${episodeNoState} - Mojime`
  }, [episodeNoState, animeInfo])

  useEffect(() => {
    if (episodeNoState)
      setEpisodeInput(episodeNoState);
  }, [episodeNoState])

  const episodeInputStyle = {
    width: episodeInput.length + 'ch', // Set width based on the length of the value
  };

  return (animeInfo && episodeNoState ? (
    <>
      <Player />
      <p>{animeInfo.title as string}</p>
      <div className="flex gap fl-a-center pb-1p5r">
        <button
          onClick={() => handleEpisodeNavigate(Number(episodeNoState) - 1)}
          disabled={Number(episodeNoState) === 1}
        >
          &lt; Prev
        </button>
        <div
          className="flex fl-a-center ul-hover"
          onClick={() => episodeInputRef.current?.focus()}
        >
          <form onSubmit={(e) => (
            e.preventDefault(),
            handleEpisodeNavigate(episodeInput)
          )}
          >
            <input
              className="ul-hover"
              ref={episodeInputRef}
              type="number"
              value={episodeInput}
              onKeyDown={(e) => [',', '.', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e) => handleEpInputChange(e)}
              onBlur={() => setEpisodeInput(episodeNoState)}
              style={episodeInputStyle}
              min={1}
              max={animeInfo.episodes?.length}
            />
          </form>
          <p className="m-0">&nbsp;/ {animeInfo.episodes?.length ?? "?"}</p>
        </div>
        <button
          onClick={() => handleEpisodeNavigate(Number(episodeNoState) + 1)}
          disabled={Number(episodeNoState) >= (animeInfo.episodes?.length ?? Number(episodeNoState) + 1)}
        >
          Next &gt;
        </button>
      </div>
    </>
  ) : (
    <span className="abs-center flex fl-a-center fl-j-center">
      <LoadingAnimation />
    </span>
  ));
}