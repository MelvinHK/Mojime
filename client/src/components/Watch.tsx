import { useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent, useContext } from "react";

import { getAnime, throwNotFoundError } from "../utils/api";

import LoadingAnimation from "./LoadingAnimation";
import { WatchContext } from "../contexts/WatchProvider";
import { navigateToEpisode } from "../utils/navigateToEpisode";

import { IAnimeInfo } from "@consumet/extensions";

export default function Watch() {
  const {
    animeInfo,
    setAnimeInfo,
    episodeNoState,
    setEpisodeNoState,
    hasPrevious,
    hasNext,
    episodeIndex
  } = useContext(WatchContext);
  const { animeId, episodeNoParam } = useParams();

  const [episodeInput, setEpisodeInput] = useState<string>(episodeNoState ?? "");
  const episodeInputRef = useRef<HTMLInputElement>(null);
  const [isCheckingNewEpisodes, setIsCheckingNewEpisodes] = useState(false);

  const { showBoundary } = useErrorBoundary();

  const navigateToEpisodeIndex = (index: number | string) => {
    if (index === -1) {
      return;
    }
    if (animeInfo?.episodes) {
      navigateToEpisode(animeInfo.episodes[Number(index)].number, setEpisodeNoState);
    }
  }

  const handleEpInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setEpisodeInput(newValue);
  }

  const getQueueStorage = (): IAnimeInfo[] => {
    const queueString = localStorage.getItem('cachedAnime');
    const queue = queueString ? JSON.parse(queueString) : [];
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
    let queue = getQueueStorage();
    queue.push(animeInfo);

    if (queue.length > limit) {
      queue.shift();
    }

    localStorage.setItem('cachedAnime', JSON.stringify(queue));
  }

  const updateQueue = (animeId: keyof IAnimeInfo, newAnimeInfo: IAnimeInfo) => {
    let queue = getQueueStorage();
    let index = queue.findIndex(obj => obj.id === animeId);

    if (index !== -1) {
      console.log(index);
      queue[index] = newAnimeInfo;
      localStorage.setItem('cachedAnime', JSON.stringify(queue));
    }
  };

  const pushToBack = (animeId: keyof IAnimeInfo) => {
    let queue = getQueueStorage();
    let index = queue.findIndex(obj => obj.id === animeId);

    if (index !== -1) {
      const animeToMove = queue.splice(index, 1)[0];
      queue.push(animeToMove);
      localStorage.setItem('cachedAnime', JSON.stringify(queue));
    }
  };

  useEffect(() => {
    if (!animeId) {
      return;
    }

    const fetchAnime = async () => {
      const cachedAnime = getStoredAnime(animeId);

      if (cachedAnime) {
        setAnimeInfo(cachedAnime);
        pushToBack(animeId);
        if (cachedAnime.status === "Completed") {
          return cachedAnime;
        }
        setIsCheckingNewEpisodes(true);
        const updatedAnime: IAnimeInfo = await getAnime(animeId);
        if (JSON.stringify(cachedAnime) !== JSON.stringify(updatedAnime)) {
          updateQueue(animeId, updatedAnime);
          setAnimeInfo(updatedAnime);
        }
        setIsCheckingNewEpisodes(false);
        return updatedAnime;
      }

      const freshAnime: IAnimeInfo = await getAnime(animeId);
      addAnimeToStorage(freshAnime);
      setAnimeInfo(freshAnime);
      return freshAnime;
    }

    const redirectIfNoEpisodeParam = (animeInfo: IAnimeInfo) => {
      if (!episodeNoParam && animeInfo?.episodes) {
        history.replaceState(null, "", `${animeId}/${animeInfo.episodes[0].number}`);
        setEpisodeNoState(`${animeInfo.episodes[0].number}`);
      }
    }

    fetchAnime()
      .then(redirectIfNoEpisodeParam)
      .catch(showBoundary);
  }, [animeId]);

  useEffect(() => {
    if (!episodeNoState || !animeInfo) {
      return;
    }

    if (animeInfo.episodes?.findIndex(ep => String(ep.number) === episodeNoState) === -1) {
      showBoundary(throwNotFoundError('Anime/Episode not found'));
    }

    setEpisodeInput(episodeNoState);

    document.title = `${animeInfo?.title} Ep.${episodeNoState} - Mojime`;
  }, [episodeNoState, animeInfo]);

  const episodeInputStyle = {
    width: episodeInput.length + 'ch'
  };

  return (animeInfo && episodeNoState && animeInfo.id === animeId ? (
    <>
      <p>{animeInfo.title as string}</p>
      <div className="flex gap fl-a-center pb-1p5r">
        <button
          onClick={() => navigateToEpisodeIndex(episodeIndex - 1)}
          disabled={!hasPrevious}
        >
          &lt; Prev
        </button>
        <div
          className="flex fl-a-center ul-hover"
          onClick={() => episodeInputRef.current?.focus()}
        >
          <form
            spellCheck="false"
            autoComplete="off"
            onSubmit={(e) => (
              e.preventDefault(),
              navigateToEpisodeIndex(animeInfo.episodes
                ?.findIndex(ep => String(ep.number) === episodeInput) || 0
              )
            )}
          >
            <input
              id='episode-input'
              className="ul-hover"
              type="text"
              ref={episodeInputRef}
              value={episodeInput}
              onChange={(e) => handleEpInputChange(e)}
              onBlur={() => setEpisodeInput(episodeNoState)}
              style={episodeInputStyle}
            />
          </form>
          <p className="m-0">&nbsp;/ {animeInfo.totalEpisodes ?? "?"}</p>
        </div>
        <button
          onClick={() => navigateToEpisodeIndex(episodeIndex + 1)}
          disabled={!hasNext}
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