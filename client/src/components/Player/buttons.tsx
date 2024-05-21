import buttonStyles from '../../styles/player/button.module.css';

import {
  FullscreenButton,
  PlayButton,
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
    <PlayButton className={`play-button ${buttonStyles.button}`}>
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
