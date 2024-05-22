import styles from '../../styles/player/video-layout.module.css'

import { Controls, Gesture } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Sliders from './sliders'
import { TimeGroup } from './time-group';

export function VideoLayout() {


  return (
    <>
      <Gestures />
      <Controls.Root className={styles.controls}>
        <div className={styles.spacer} />
        <Sliders.Time />
        <Controls.Group className={styles.controlsGroup}>
          <Buttons.Play />
          <TimeGroup />
          <Buttons.Seek seconds={30}/>
          <Buttons.Seek seconds={90}/>
          <div className={styles.spacer} />
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
