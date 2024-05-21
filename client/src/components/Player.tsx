import { useEffect, useState } from "react";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";
import { ISource, IVideo } from "@consumet/extensions";

import { MediaPlayer, MediaProvider } from '@vidstack/react';
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
        setQualities(data.sources.map(src => src.quality));
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchEpisode();
  }, [props.episodeId])

  return (
    <div id="player-container">
      <div id="player-ratio">
        <div id="iframe">
          <MediaPlayer
            src={sources?.find(src => src.quality === "720p")?.url}
          >
            <MediaProvider />
          </MediaPlayer>
        </div>
      </div>
    </div >

  );
}