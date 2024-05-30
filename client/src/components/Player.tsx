import { useEffect, useState, useRef, createContext, Dispatch, SetStateAction, RefObject } from "react";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";
import { ISource, IVideo } from "@consumet/extensions";

import styles from '../styles/player/player.module.css';

import { MediaPlayer, MediaProvider, MediaPlayerInstance } from '@vidstack/react';

import { VideoLayout } from './Player/videoLayout';
import '@vidstack/react/player/styles/base.css';
import LoadingAnimation from "./LoadingAnimation";

interface PlayerProps {
  episodeId?: string;
}

type QualityContextType = {
  qualities: (string | undefined)[] | undefined,
  selectedQuality: string | undefined,
  setSelectedQuality: Dispatch<SetStateAction<(string | undefined)>>,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  playerRef: RefObject<MediaPlayerInstance> | undefined
}

export const QualityContext = createContext<QualityContextType>({
  qualities: [],
  selectedQuality: undefined,
  setSelectedQuality: () => { },
  setCurrentTime: () => { },
  playerRef: undefined
});

export default function Player({ episodeId }: PlayerProps) {
  const [sources, setSources] = useState<IVideo[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [qualities, setQualities] = useState<(string | undefined)[]>();
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();

  const source = sources?.find(src => src.quality === selectedQuality)?.url;

  const [currentTime, setCurrentTime] = useState<number>(0);

  const playerRef = useRef<MediaPlayerInstance>(null);

  const qualityContextValues: QualityContextType = {
    qualities,
    selectedQuality,
    setSelectedQuality,
    setCurrentTime,
    playerRef
  }

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!episodeId) { return; }

    const fetchEpisode = async () => {
      try {
        const data: ISource = await getEpisode(episodeId as string);
        setSources(data.sources);
        setQualities(data.sources
          .map(src => src.quality)
          .filter(src => /\d/.test(src ?? ""))
        );
      } catch (error) {
        showBoundary(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEpisode();
  }, [episodeId])

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
            >
              <MediaProvider />
              <QualityContext.Provider value={qualityContextValues}>
                <VideoLayout />
              </QualityContext.Provider>
            </MediaPlayer>
          )}
        </div>
      </div>
    </div >
  );
}