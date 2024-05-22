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

interface QualityProps {
  quality?: string;
  qualities?: (string | undefined)[];
}

export function Quality(props: QualityProps) {
  return (
    <Menu.Root>
      <Menu.Button className={`${buttonStyles.button} ${buttonStyles.quality}`}>
        {props.quality}
      </Menu.Button>
      <Menu.Items>
        <RadioGroup.Root>
          {props.qualities?.map(p => (
            <RadioGroup.Item value={p}>{p}HW</RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </Menu.Items>
    </Menu.Root>
  )
}
