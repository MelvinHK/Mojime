import { RefObject, useContext } from "react";
import { navigateToEpisode } from "../navigateToEpisode";
import { WatchContext } from "../../contexts/WatchProvider";
import { MediaPlayerInstance } from "@vidstack/react";

export const playerKeyShortcuts = (playerRef: RefObject<MediaPlayerInstance>) => {
  const { hasNext, hasPrevious, episodeNoState, setEpisodeNoState } = useContext(WatchContext);

  const keyShortcuts = {
    togglePaused: 'k Space',
    toggleFullscreen: 'f',
    togglePictureInPicture: 'i',
    seekBackward: 'j J ArrowLeft',
    seekForward: 'l L ArrowRight',
    volumeUp: 'ArrowUp',
    volumeDown: 'ArrowDown',
    nextEp: {
      keys: '.',
      onKeyUp() {
        if (hasNext) {
          navigateToEpisode(Number(episodeNoState) + 1, setEpisodeNoState);
        }
      }
    },
    prevEp: {
      keys: ',',
      onKeyUp() {
        if (hasPrevious) {
          navigateToEpisode(Number(episodeNoState) - 1, setEpisodeNoState);
        }
      }
    },
    seek85: {
      keys: "'",
      onKeyUp() {
        if (playerRef?.current)
          playerRef.current.currentTime += 85;
      }
    },
    seek30: {
      keys: ";",
      onKeyUp() {
        if (playerRef?.current)
          playerRef.current.currentTime += 25;
      }
    }
  }

  return keyShortcuts;
}