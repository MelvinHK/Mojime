import buttonStyles from '../../styles/player/button.module.css';

import {
  FullscreenButton,
  Menu,
  RadioGroup,
  PlayButton,
  SeekButton,
  useMediaState
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
import useMatchMobileMedia from '../../utils/hooks/useMatchMobileMedia';
import { Volume } from './Sliders';

export function Play() {
  const { isLoadingEpisode } = useContext(WatchContext);
  const isPaused = useMediaState('paused');
  const isMobileMedia = useMatchMobileMedia();

  return (
    <PlayButton
      data-mobile-ep-loading={isLoadingEpisode && isMobileMedia ? "true" : "false"}
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

export function Seek({ seconds }: { seconds: number }) {
  return (
    <SeekButton
      seconds={seconds}
      className={buttonStyles.seek}
    >
      +{seconds}s
    </SeekButton>
  );
}

export function Quality() {
  const {
    playerRef,
    startTime
  } = useContext(PlayerContext);

  const {
    qualities,
    selectedQuality,
    setSelectedQuality,
  } = useContext(WatchContext);

  const handleSelect = (quality: string | undefined) => {
    if (!quality) { return; }

    setSelectedQuality(quality);
    localStorage.setItem("preferredVideoQuality", quality);

    if (playerRef?.current) {
      startTime.current = playerRef.current.currentTime;
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
        <RadioGroup.Root value={selectedQuality}>
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
  const { animeInfo, episodeIndex, setEpisodeNoState, hasNext } = useContext(WatchContext);

  const handleNavigate = () => {
    if (animeInfo?.episodes) {
      navigateToEpisode(animeInfo.episodes[episodeIndex + 1].number, setEpisodeNoState);
    }
  }

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
  const { animeInfo, episodeIndex, setEpisodeNoState, hasPrevious } = useContext(WatchContext);

  const handleNavigate = () => {
    if (animeInfo?.episodes) {
      navigateToEpisode(animeInfo.episodes[episodeIndex - 1].number, setEpisodeNoState);
    }
  }

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

