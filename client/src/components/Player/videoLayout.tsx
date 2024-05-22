import styles from '../../styles/player/video-layout.module.css'

import { Controls, Gesture } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Sliders from './sliders'
import { TimeGroup } from './timeGroup';

interface VideoProps {
  quality?: string;
  qualities?: (string | undefined)[];
}

export function VideoLayout(props: VideoProps) {
  return (
    <>
      <Gestures />
      <Controls.Root className={styles.controls}>
        <div className={styles.spacer} />
        <Sliders.Time />
        <Controls.Group className={styles.controlsGroup}>
          <Buttons.Play />
          <TimeGroup />
          <Buttons.Seek seconds={25}/>
          <Buttons.Seek seconds={85}/>
          <div className={styles.spacer} />
          {/* <Buttons.Quality quality={props.quality}/> */}
          <Buttons.Fullscreen />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture
        className={styles.gesture}
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className={styles.gesture}
        event="pointerup"
        action="toggle:controls"
      />
    </>
  );
}
