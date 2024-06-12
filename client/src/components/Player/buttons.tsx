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
  NextIcon
} from '@vidstack/react/icons';
import { PlayerContext } from '../Player';
import { useContext } from 'react';
import { WatchContext } from '../../contexts/WatchProvider';
import { navigateToEpisode } from '../../utils/navigateToEpisode';
import useIsMobile from '../../utils/hooks/useIsMobile';

export function Play() {
  const { isLoadingEpisode } = useContext(WatchContext);
  const isPaused = useMediaState('paused');
  const isMobile = useIsMobile();

  return (
    <PlayButton
      data-mobile-ep-loading={isLoadingEpisode && isMobile ? "true" : "false"}
      className={`play-button ${buttonStyles.button} ${buttonStyles.playButtonMobile}`}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </PlayButton>
  );
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
              className={`${buttonStyles.radioChild} ${p === selectedQuality ? buttonStyles.radioChildSelected : ""}`}
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

  return (animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState)) && (
    <button
      onClick={() => handleNavigate()}
      className={`${buttonStyles.button}`}
    >
      <NextIcon />
    </button>
  ));
}
