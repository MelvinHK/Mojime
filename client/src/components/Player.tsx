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

export default function Player(props: PlayerProps) {
  const [sources, setSources] = useState<IVideo[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [qualities, setQualities] = useState<(string | undefined)[]>();
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();

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
    if (!props.episodeId) { return; }

    const fetchEpisode = async () => {
      try {
        const data: ISource = await getEpisode(props.episodeId as string);
        setSources(data.sources);
        setQualities(data.sources
          .map(src => src.quality)
          .filter(src => /\d/.test(src ?? ""))
        );
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchEpisode();
  }, [props.episodeId])

  useEffect(() => {
    if (playerRef.current) {
      setIsLoading(false);
    }
  }, [playerRef.current])

  const handleQuality = () => {
    if (!qualities) { return };

    const storedQuality = localStorage.getItem("preferredVideoQuality");

    if (storedQuality !== null && qualities.includes(storedQuality)) {
      setSelectedQuality(storedQuality);
    } else if (qualities.length > 0) {
      setSelectedQuality(qualities[qualities.length - 1]);
    } else {
      setSelectedQuality("default");
    }
  }

  useEffect(() => {
    handleQuality();
  }, [qualities])

  useEffect(() => {
    if (!playerRef.current) { return; }

    playerRef.current.currentTime = currentTime;
  }, [currentTime])

  return (
    <div id="player-container">
      <div id="player-ratio">
        {isLoading && (
          <div className="abs-center w-100 h-100 flex fl-a-center fl-j-center">
            <LoadingAnimation />
          </div>
        )}
        <div id="player-wrapper">
          {sources && qualities && (
            <MediaPlayer
              className={`${styles.player} player`}
              src={sources.find(src => src.quality === selectedQuality)?.url}
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