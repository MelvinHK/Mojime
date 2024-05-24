import { useEffect, useState, useRef, createContext, Dispatch, SetStateAction } from "react";
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
  qualities: (string | undefined)[],
  selectedQuality: string | undefined,
  setSelectedQuality: Dispatch<SetStateAction<(string | undefined)>>
}

export const QualityContext = createContext<QualityContextType>({
  qualities: [],
  selectedQuality: undefined,
  setSelectedQuality: () => { }
});

export default function Player(props: PlayerProps) {
  const [sources, setSources] = useState<IVideo[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [qualities, setQualities] = useState<(string | undefined)[]>();
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();

  const playerRef = useRef<MediaPlayerInstance>(null);

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!props.episodeId) return;

    const fetchEpisode = async () => {
      try {
        const data: ISource = await getEpisode(props.episodeId as string);
        setSources(data.sources);
        setQualities(data.sources.map(src => src.quality).filter(src => /\d/.test(src ?? "")));
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchEpisode();
  }, [props.episodeId])

  useEffect(() => {
    handleQuality();
  }, [qualities])

  useEffect(() => {
    if (playerRef.current) {
      setIsLoading(false);
    }
  }, [playerRef.current])

  const handleQuality = () => {
    if (!qualities) return;

    setSelectedQuality(qualities[qualities.length - 1]);

    // If localStorage quality exists, try find it.
    // Return if found, else,
    // check if qualities isn't empty, return qualties[last] if true,
    // else, return "backup"
  }

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
              src={sources?.find(src => src.quality === selectedQuality)?.url}
              playsInline
              autoPlay
              ref={playerRef}
            >
              <MediaProvider />
              <QualityContext.Provider value={{ qualities, selectedQuality, setSelectedQuality }}>
                <VideoLayout />
              </QualityContext.Provider>
            </MediaPlayer>
          )}
        </div>
      </div>
    </div >

  );
}