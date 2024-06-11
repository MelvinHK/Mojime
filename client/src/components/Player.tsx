import { useEffect, useState, useRef, createContext, Dispatch, SetStateAction, RefObject, useContext } from "react";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";
import { ISource, IVideo } from "@consumet/extensions";

import styles from '../styles/player/player.module.css';

import { MediaPlayer, MediaProvider, MediaPlayerInstance } from '@vidstack/react';

import { VideoLayout } from './Player/videoLayout';
import '@vidstack/react/player/styles/base.css';
import LoadingAnimation from "./LoadingAnimation";

import { throttle } from "lodash-es";
import { WatchContext } from "../Root";
import { useParams } from "react-router-dom";

interface PlayerProps {
  episodeId?: string;
}

type PlayerContextType = {
  qualities: (string | undefined)[] | undefined,
  selectedQuality: string | undefined,
  setSelectedQuality: Dispatch<SetStateAction<(string | undefined)>>,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  playerRef: RefObject<MediaPlayerInstance> | undefined
}

export const PlayerContext = createContext<PlayerContextType>({
  qualities: [],
  selectedQuality: undefined,
  setSelectedQuality: () => { },
  setCurrentTime: () => { },
  playerRef: { current: null }
});

type PreloadedEpisode = {
  episodeId: string,
  sources: IVideo[],
  qualities: (string | undefined)[]
}

export default function Player({ episodeId }: PlayerProps) {
  const { animeInfo, isFullscreen } = useContext(WatchContext);
  const { episodeNo } = useParams()

  const [sources, setSources] = useState<IVideo[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [qualities, setQualities] = useState<(string | undefined)[]>();
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();

  const source = sources?.find(src => src.quality === selectedQuality)?.url;

  const [currentTime, setCurrentTime] = useState<number>(0);

  const playerRef = useRef<MediaPlayerInstance>(null);
  const isPreloadThreshold = useRef(false);

  const qualityContextValues: PlayerContextType = {
    qualities,
    selectedQuality,
    setSelectedQuality,
    setCurrentTime,
    playerRef
  }

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!episodeId) { return; }

    const setEpisode = async () => {
      const preloaded = localStorage.getItem("preloadedNextEpisode");
      if (preloaded) {
        const parsed: PreloadedEpisode = JSON.parse(preloaded);
        if (episodeId === parsed.episodeId) {
          setSources(parsed.sources);
          setQualities(parsed.qualities);
          return;
        }
      }

      try {
        const episode: ISource = await getEpisode(episodeId);
        setSources(episode.sources);
        setQualities(episode.sources
          .map(src => src.quality)
          .filter(src => /\d/.test(src ?? ""))
        );
      } catch (error) {
        showBoundary(error);
      } finally {
        setIsLoading(false);
      }
    }

    setEpisode();
  }, [episodeId]);

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

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePreload = async () => {
    if (
      !playerRef.current ||
      isPreloadThreshold.current ||
      !animeInfo?.episodes?.hasOwnProperty(Number(episodeNo))
    ) {
      return;
    }

    const duration = playerRef.current.duration;
    const currentTime = playerRef.current.currentTime;
    const progressPercent = currentTime / duration;

    if (progressPercent >= 0.75) {
      const episodeId = animeInfo.episodes?.[Number(episodeNo)].id

      try {
        const episode: ISource = await getEpisode(episodeId);

        const data: PreloadedEpisode = {
          episodeId: episodeId,
          sources: episode.sources,
          qualities: episode.sources
            .map(src => src.quality)
            .filter(src => /\d/.test(src ?? ""))
        }

        localStorage.setItem("preloadedNextEpisode", JSON.stringify(data));
      } catch (error) {
        console.log("Unable to preload next episode.");
      } finally {
        isPreloadThreshold.current = true;
      }
    }
  }

  return (
    <div id="player-container">
      <div id="player-ratio">
        {isLoading && (
          <span className="abs-center w-100 h-100 flex fl-a-center fl-j-center">
            <LoadingAnimation />
          </span>
        )}
        <div id="player-wrapper">
          {sources && qualities && (
            <MediaPlayer
              className={`${styles.player} player`}
              src={source}
              playsInline
              autoPlay
              ref={playerRef}
              onStarted={() => isFullscreen.current && playerRef.current?.enterFullscreen()}
              onTimeUpdate={throttle(() => handlePreload(), 1000)}
              onFullscreenChange={(detail) => isFullscreen.current = detail}
            >
              <MediaProvider />
              <PlayerContext.Provider value={qualityContextValues}>
                <VideoLayout />
              </PlayerContext.Provider>
            </MediaPlayer>
          )}
        </div>
      </div>
    </div >
  );
}