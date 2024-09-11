import { useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent, useContext } from "react";

import { getAnime, throwNotFoundError } from "../utils/api";

import LoadingAnimation from "./LoadingAnimation";
import { WatchContext } from "../contexts/WatchProvider";
import { navigateToEpisode } from "../utils/navigateToEpisode";

import { IAnimeInfo } from "@consumet/extensions";

export default function Watch() {
  const { animeInfo, setAnimeInfo, episodeNoState, setEpisodeNoState } = useContext(WatchContext);
  const { animeId } = useParams();

  const [episodeInput, setEpisodeInput] = useState<string>(episodeNoState ?? "");
  const episodeInputRef = useRef<HTMLInputElement>(null);
  const [isCheckingNewEpisodes, setIsCheckingNewEpisodes] = useState(false);

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

  const getQueueStorage = (): IAnimeInfo[] | undefined => {
    const queueString = localStorage.getItem('cachedAnime');
    const queue = queueString ? JSON.parse(queueString) : undefined;
    return queue;
  }

  const getStoredAnime = (animeId: keyof IAnimeInfo): IAnimeInfo | undefined => {
    const queue = getQueueStorage();
    if (queue) {
      return queue.find(obj => obj.id === animeId);
    }
    return undefined;
  };

  const addAnimeToStorage = (animeInfo: IAnimeInfo, limit: number = 100) => {
    let queue = getQueueStorage() ?? [];
    queue.push(animeInfo);

    if (queue.length > limit) {
      queue.shift();
    }

    localStorage.setItem('cachedAnime', JSON.stringify(queue));
  }

  const updateAndPushToBack = (animeId: keyof IAnimeInfo, newAnimeInfo: IAnimeInfo) => {
    let queue = getQueueStorage() ?? [];
    let index = queue.findIndex(obj => obj.id === animeId);

    if (index !== -1) {
      let updatedAnime = { ...queue[index], ...newAnimeInfo };
      queue.splice(index, 1);
      queue.push(updatedAnime);
      localStorage.setItem('cachedAnime', JSON.stringify(queue));
    }
  }

  useEffect(() => {
    if (!animeId || animeId === animeInfo?.id || !episodeNoState) {
      return;
    }

    const fetchAnime = async () => {
      const cachedAnime = getStoredAnime(animeId);

      if (cachedAnime) {
        setAnimeInfo(cachedAnime);
        if (cachedAnime.status !== "Completed") {
          setIsCheckingNewEpisodes(true);
        } else {
          return cachedAnime;
        }
      }

      const fetchedAnime: IAnimeInfo = await getAnime(animeId);

      if (cachedAnime) {
        updateAndPushToBack(animeId, fetchedAnime);
        setIsCheckingNewEpisodes(false);
      } else {
        addAnimeToStorage(fetchedAnime);
      }

      setAnimeInfo(fetchedAnime);

      return fetchedAnime;
    }

    fetchAnime()
      .then((animeInfo) => {
        if (!animeInfo.episodes?.hasOwnProperty(Number(episodeNoState) - 1)) {
          throwNotFoundError('Anime/Episode not found');
        }
      })
      .catch((error) => {
        showBoundary(error)
      });

  }, [animeInfo?.id, animeId, episodeNoState])

  useEffect(() => {
    if (episodeNoState && animeInfo)
      document.title = `${animeInfo?.title} Ep.${episodeNoState} - Mojime`
  }, [episodeNoState, animeInfo])

  useEffect(() => {
    if (episodeNoState)
      setEpisodeInput(episodeNoState);
  }, [episodeNoState])

  const episodeInputStyle = {
    width: episodeInput.length + 'ch'
  };

  return (animeInfo && episodeNoState && animeInfo.id === animeId ? (
    <>
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
          disabled={Number(episodeNoState) >= (animeInfo.episodes?.length ?? Number(episodeNoState))}
        >
          Next &gt;
        </button>
      </div>
      {isCheckingNewEpisodes && (
        <p className="o-disabled">Checking for new episodes...</p>
      )}
    </>
  ) : (
    <span className="abs-center flex fl-a-center fl-j-center">
      <LoadingAnimation />
    </span>
  ));
}