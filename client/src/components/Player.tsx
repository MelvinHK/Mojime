import { useEffect, useState } from "react";
import { getEpisode } from "../utils/api";

import { useErrorBoundary } from "react-error-boundary";
import { ISource, IVideo } from "@consumet/extensions";

interface PlayerProps {
  episodeId?: string;
}

export default function Player(props: PlayerProps) {
  const [sources, setSources] = useState<IVideo[]>();

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (!props.episodeId) return;

    const fetchEpisode = async () => {
      try {
        const data: ISource = await getEpisode(props.episodeId as string);
        setSources(data.sources);
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
          <p>{sources?.find(src => src.quality === "720p")?.url}</p>
        </div>
      </div>
    </div>

  );
}