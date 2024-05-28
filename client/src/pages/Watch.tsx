import { useParams, useNavigate, Link } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent, useContext } from "react";

import { getAnime } from "../utils/api";

import Player from "../components/Player";
import LoadingAnimation from "../components/LoadingAnimation";
import { WatchContext } from "../Root";
import { kaomojis } from "./Home";

interface WatchProps {
  kaomojiIndex: number,
}

export default function Watch({ kaomojiIndex }: WatchProps) {
  const { animeInfo, setAnimeInfo } = useContext(WatchContext);

  const { animeId, episodeNo } = useParams();
  const episodeNumber = Number(episodeNo);

  const [episodeInput, setEpisodeInput] = useState<string>(episodeNo ?? "");

  const episodeInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const handleEpisodeNavigate = (ep: number | string) => {
    if (!ep || !animeInfo?.episodes?.hasOwnProperty(Number(ep) - 1)) {
      return;
    }
    navigate(`/${animeId}/${ep}`);
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
    if (!animeId) { return };

    const fetchAnime = async () => {
      try {
        const data = await getAnime(animeId);
        if (!data.episodes?.hasOwnProperty(episodeNumber - 1)) {
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
  }, [animeId])

  const episodeInputStyle = {
    width: episodeInput.length + 'ch', // Set width based on the length of the value
  };

  return (animeInfo && episodeNo ? (
    <>
      <Player episodeId={animeInfo.episodes?.[episodeNumber - 1].id} />
      <p>{animeInfo.title as string}</p>
      <div className="flex gap fl-a-center pb-1p5r">
        <button
          onClick={() => handleEpisodeNavigate(episodeNumber - 1)}
          disabled={episodeNumber === 1}
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
              onBlur={() => setEpisodeInput(episodeNo)}
              style={episodeInputStyle}
              min={1}
              max={animeInfo.episodes?.length}
            />
          </form>
          <p className="m-0">&nbsp;/ {animeInfo.episodes?.length ?? "?"}</p>
        </div>
        <button
          onClick={() => handleEpisodeNavigate(episodeNumber + 1)}
          disabled={episodeNumber >= (animeInfo.totalEpisodes ?? episodeNumber + 1)}
        >
          Next &gt;
        </button>
      </div>
      <Link to="/" className="mt-auto m-0 txt-dec-none">{kaomojis[kaomojiIndex]}</Link>
    </>
  ) : (
    <div className="abs-center flex fl-a-center fl-j-center">
      <LoadingAnimation />
    </div>
  ));
}