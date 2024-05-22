import buttonStyles from '../../styles/player/button.module.css';

import {
  FullscreenButton,
  PlayButton,
  SeekButton,
  useMediaState,
} from '@vidstack/react';
import {
  FullscreenExitIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
} from '@vidstack/react/icons';

export function Play() {
  const isPaused = useMediaState('paused');
  return (
    <PlayButton className={`play-button ${buttonStyles.button} ${buttonStyles.mobile}`}>
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
