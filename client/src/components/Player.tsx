import { useEffect, useRef, createContext, RefObject, useContext, useMemo, MutableRefObject } from "react";
import { getEpisode } from "../utils/api";

import { ISource, IVideo } from "@consumet/extensions";

import plStyles from '../styles/player/player.module.css';
import vlStyles from '../styles/player/video-layout.module.css'

import { MediaPlayer, MediaProvider, MediaPlayerInstance } from '@vidstack/react';

import { VideoLayout } from "./Player/VideoLayout";
import '@vidstack/react/player/styles/base.css';

import { throttle } from "lodash-es";
import { WatchContext, PreloadedEpisode } from "../contexts/WatchProvider";
import { useErrorBoundary } from "react-error-boundary";
import { isAxiosError } from "axios";
import LoadingAnimation from "./LoadingAnimation";

import { animated } from "@react-spring/web";
import { isMobile } from "react-device-detect";
import { usePlayerGesture } from "../utils/player/usePlayerGesture";
import { playerKeyShortcuts } from "../utils/player/playerKeyShortcuts";
import { useParams } from "react-router-dom";

type PlayerContextType = {
  playerRef: RefObject<MediaPlayerInstance> | undefined,
  isTapGesture: MutableRefObject<boolean>,
  startTime: MutableRefObject<Number>
}

export const PlayerContext = createContext<PlayerContextType>({
  playerRef: { current: null },
  isTapGesture: { current: false },
  startTime: { current: 0 }
});

export default function Player() {
  const {
    animeInfo,
    qualities,
    setQualities,
    sources,
    setSources,
    selectedQuality,
    setSelectedQuality,
    isLoadingEpisode,
    setIsLoadingEpisode,
    episodeNoState,
    episodeId,
    nextEpisodeId,
  } = useContext(WatchContext);

  const { animeId } = useParams();

  const { showBoundary } = useErrorBoundary();

  const source = useMemo(() =>
    "https://mojime-proxy.vercel.app/proxy/" + encodeURIComponent(sources?.find(src => src.quality === selectedQuality)?.url ?? ""),
    [sources, selectedQuality]
  );

  const startTime = useRef(0);

  const playerRef = useRef<MediaPlayerInstance>(null);
  const keyShortcuts = playerKeyShortcuts(playerRef);
  const { bind, y, isTapGesture } = usePlayerGesture(playerRef);

  const playerContextValues: PlayerContextType = { playerRef, isTapGesture, startTime };

  const isPreloadingAllowed = useRef(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const getEpisodeWithAbort = async (episodeId: string) => {
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    try {
      const episode: ISource = await getEpisode(episodeId, newAbortController.signal);
      return episode;
    } catch (error) {
      throw error;
    }
  }

  const abortPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const setEpisode = async (epId: string | undefined) => {
    if (!epId || !playerRef.current || animeId !== animeInfo?.id) { return; }

    const setStates = (sources: IVideo[], qualities: (string | undefined)[]) => {
      setSources(sources);
      setQualities(qualities);
    }

    const preloaded = sessionStorage.getItem(epId);
    if (preloaded) {
      const parsed: PreloadedEpisode = JSON.parse(preloaded);
      setStates(parsed.sources, parsed.qualities);
    } else {
      try {
        isPreloadingAllowed.current = false;
        const episode: ISource = await getEpisodeWithAbort(epId);
        const sources = episode.sources;
        const qualities = episode.sources
          .map(src => src.quality)
          .filter(src => /\d/.test(src ?? ""))

        setStates(sources, qualities);
        const episodeCache: PreloadedEpisode = {
          sources: sources,
          qualities: qualities
        }
        sessionStorage.setItem(epId, JSON.stringify(episodeCache));
      } catch (error) {
        if (isAxiosError(error) && error.code === "ERR_CANCELED") {
          isPreloadingAllowed.current = true;
          return;
        }
        showBoundary(error);
      }
    }
    setIsLoadingEpisode(false);
  }

  useEffect(() => {
    abortPreviousRequest();

    setIsLoadingEpisode(true);
    setEpisode(episodeId);

    return () => {
      abortPreviousRequest();
    };
  }, [episodeNoState, animeInfo?.id]);

  useEffect(() => {
    if (qualities) {
      const storedQuality = localStorage.getItem("preferredVideoQuality");
      if (storedQuality && qualities.includes(storedQuality)) {
        setSelectedQuality(storedQuality);
      } else {
        setSelectedQuality(qualities[qualities.length - 1] || "default");
      }
    }
  }, [qualities]);

  const applyStartTime = () => {
    if (playerRef?.current && startTime.current > 0) {
      playerRef.current.currentTime = startTime.current;
      startTime.current = 0;
    }
  }

  const handlePreloadNextEpisode = async () => {
    if (!playerRef.current ||
      !isPreloadingAllowed.current ||
      !nextEpisodeId) {
      return;
    }

    const progressPercent = playerRef.current.currentTime / playerRef.current.duration;
    if (progressPercent >= 0.75) {

      abortPreviousRequest();
      isPreloadingAllowed.current = false;

      try {
        const episode: ISource = await getEpisodeWithAbort(nextEpisodeId);
        const episodeCache: PreloadedEpisode = {
          sources: episode.sources,
          qualities: episode.sources
            .map(src => src.quality)
            .filter(src => /\d/.test(src ?? ""))
        }
        sessionStorage.setItem(nextEpisodeId, JSON.stringify(episodeCache));
      } catch (error) {
        console.log("Error preloading next episode: ", error);
        return;
      }
    }
  };

  return (
    <div id="player-container">
      <div id="player-ratio">
        <div id="player-wrapper">
          <MediaPlayer
            className={`${plStyles.player} player`}
            src={source}
            playsInline
            autoPlay
            ref={playerRef}
            onTimeUpdate={throttle(() => handlePreloadNextEpisode(), 1000)}
            onCanPlay={() => {
              isPreloadingAllowed.current = true;
              applyStartTime();
            }}
            volume={Number(localStorage.getItem("preferredVolume")) * 0.01 || 1}
            keyShortcuts={keyShortcuts}
            controlsDelay={1000}
          >
            {isMobile || window.matchMedia("(pointer: coarse)").matches ? (
              <animated.div {...bind()} style={{ y, touchAction: "none" }} id="animated-player">
                <MediaProvider />
              </animated.div>
            ) : (
              <MediaProvider />
            )}
            <PlayerContext.Provider value={playerContextValues}>
              <VideoLayout />
            </PlayerContext.Provider>
            {isLoadingEpisode && (
              <span className="abs-center w-100 h-100 flex fl-a-center fl-j-center pointer-none">
                <div className={vlStyles.loadingBackground}></div>
                <LoadingAnimation />
              </span>
            )}
          </MediaPlayer>
        </div>
      </div>
    </div >
  );
}