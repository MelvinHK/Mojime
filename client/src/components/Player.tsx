import { useEffect, useState } from "react";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";
import { ISource, IVideo } from "@consumet/extensions";

import styles from '../styles/player/player.module.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';

import { VideoLayout } from './Player/videoLayout';
import '@vidstack/react/player/styles/base.css';

interface PlayerProps {
  episodeId?: string;
}

export default function Player(props: PlayerProps) {
  const [sources, setSources] = useState<IVideo[]>();
  const [qualities, setQualities] = useState<(string | undefined)[]>();

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

  const getQuality = () => {
    if (!qualities) return;

    // If localStorage quality exists, try find it.
    // Return if found, else,
    // check if qualities isn't empty, return qualties[last] if true,
    // else, return "backup"
  }

  return (
    <div id="player-container">
      <div id="player-ratio">
        <div id="player-wrapper">
          {sources && qualities && (
            <MediaPlayer
              className={`${styles.player} player`}
              src={sources?.find(src => src.quality === qualities[qualities.length - 1])?.url}
              playsInline
              autoPlay
            >
              <MediaProvider />
              <VideoLayout
                quality={qualities[qualities.length - 1]}
                qualities={qualities}
              />
            </MediaPlayer>
          )}
        </div>
      </div>
    </div >

  );
}