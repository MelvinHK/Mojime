import buttonStyles from '../../styles/player/button.module.css';

import {
  FullscreenButton,
  Menu,
  RadioGroup,
  PlayButton,
  SeekButton,
  useMediaState,
} from '@vidstack/react';
import {
  FullscreenExitIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  NextIcon,
  PreviousIcon,
  MuteIcon,
  VolumeHighIcon,
  VolumeLowIcon
} from '@vidstack/react/icons';
import { PlayerContext } from '../Player';
import { useContext } from 'react';
import { WatchContext } from '../../contexts/WatchProvider';
import { navigateToEpisode } from '../../utils/navigateToEpisode';
import useIsMobileMatchMedia from '../../utils/hooks/useIsMobile';
import { Volume } from './sliders';

export function Play() {
  const { isLoadingEpisode } = useContext(WatchContext);
  const isPaused = useMediaState('paused');
  const isMobileMatchMedia = useIsMobileMatchMedia();

  return (
    <PlayButton
      data-mobile-ep-loading={isLoadingEpisode && isMobileMatchMedia ? "true" : "false"}
      className={`play-button ${buttonStyles.button} ${buttonStyles.playButtonMobile}`}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </PlayButton>
  );
}

export function Mute() {
  const volume = useMediaState('volume');

  return (<Menu.Root>
    <Menu.Button className={`${buttonStyles.button} ${buttonStyles.volume}`}>
      {volume == 0 ? (
        <MuteIcon />
      ) : volume < 0.5 ? (
        <VolumeLowIcon />
      ) : (
        <VolumeHighIcon />
      )}
    </Menu.Button>
    <Menu.Items
      placement="top"
      offset={20}
      className={`flex fl-col fl-a-center ${buttonStyles.radioWrapper}`}
    >
      <Volume />
      {Math.floor(volume * 10)}
    </Menu.Items>
  </Menu.Root>);
}

export function Fullscreen() {
  const isActive = useMediaState('fullscreen');

  return (
    <FullscreenButton className={`fullscreen-button ${buttonStyles.button}`}>
      {isActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </FullscreenButton>
  );
}

interface SeekProps {
  seconds?: number;
}

export function Seek(props: SeekProps) {
  return (
    <SeekButton
      seconds={props.seconds}
      className={buttonStyles.seek}
    >
      +{props.seconds}s
    </SeekButton>
  );
}

export function Quality() {
  const {
    playerRef
  } = useContext(PlayerContext);

  const {
    qualities,
    selectedQuality,
    setSelectedQuality,
    setCurrentTime
  } = useContext(WatchContext);

  const handleSelect = (p: string | undefined) => {
    if (!p) { return; }

    setSelectedQuality(p);
    localStorage.setItem("preferredVideoQuality", p);

    if (playerRef && playerRef.current) {
      setCurrentTime(playerRef.current.currentTime);
    }
  }

  return (
    <Menu.Root>
      <Menu.Button className={`${buttonStyles.button} ${buttonStyles.quality}`}>
        {selectedQuality}
      </Menu.Button>
      <Menu.Items
        placement="top"
        offset={20}
        className={buttonStyles.radioWrapper}
      >
        <RadioGroup.Root>
          {qualities?.map((p, index) => (
            <RadioGroup.Item
              key={index}
              value={p}
              className={`${buttonStyles.radioChild} ${p === selectedQuality ? "o-disabled pointer-none" : ""}`}
              onSelect={() => handleSelect(p)}
            >
              {p}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </Menu.Items>
    </Menu.Root>
  )
}

export function Next() {
  const { animeInfo, episodeNoState, setEpisodeNoState, setIsLoadingEpisode } = useContext(WatchContext);

  const handleNavigate = () => {
    navigateToEpisode(Number(episodeNoState) + 1, setEpisodeNoState);
    setIsLoadingEpisode(true);
  }

  const hasNext = animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState));

  return (
    <button
      onClick={() => handleNavigate()}
      className={`${buttonStyles.button}`}
      disabled={!hasNext}
    >
      <NextIcon />
    </button>
  );
}


export function Previous() {
  const { animeInfo, episodeNoState, setEpisodeNoState, setIsLoadingEpisode } = useContext(WatchContext);

  const handleNavigate = () => {
    navigateToEpisode(Number(episodeNoState) - 1, setEpisodeNoState);
    setIsLoadingEpisode(true);
  }

  const hasPrevious = animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState) - 2);

  return (
    <button
      onClick={() => handleNavigate()}
      className={`${buttonStyles.button}`}
      disabled={!hasPrevious}
    >
      <PreviousIcon />
    </button>
  );
}

