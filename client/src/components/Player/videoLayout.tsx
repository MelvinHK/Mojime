import styles from '../../styles/player/video-layout.module.css'
import buttonStyles from '../../styles/player/button.module.css';

import { Controls, Gesture } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Sliders from './sliders'
import { TimeGroup } from './timeGroup';
import { useParams } from 'react-router-dom';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { WatchContext } from '../../Root';

type VidLayoutContextType = {
  draggedTime: string,
  setDraggedTime: Dispatch<SetStateAction<string>>
}

export const VidLayoutContext = createContext<VidLayoutContextType>({
  draggedTime: "",
  setDraggedTime: () => { }
});

export function VideoLayout() {
  const { animeInfo } = useContext(WatchContext);
  const { episodeNo } = useParams();

  const [draggedTime, setDraggedTime] = useState("");

  const VidLayoutContextValues = {
    draggedTime, setDraggedTime
  }

  return (
    <VidLayoutContext.Provider value={VidLayoutContextValues}>
      <Gestures />
      <Controls.Root className={styles.controls} hideOnMouseLeave={true}>
        <p className={styles.playerTitle}>
          {animeInfo?.title as string} - Episode {episodeNo}
        </p>
        <div className={styles.spacer} />
        <Sliders.Time />
        <Controls.Group className={styles.controlsGroup}>
          <div className={styles.playbackControls}>
            <div className={`${buttonStyles.playbackSpacer} ${buttonStyles.button}`}></div>
            <Buttons.Play />
            <Buttons.Next />
          </div>
          <TimeGroup />
          <Buttons.Seek seconds={25} />
          <Buttons.Seek seconds={85} />
          <div className={styles.spacer} />
          <Buttons.Quality />
          <Buttons.Fullscreen />
        </Controls.Group>
      </Controls.Root>
    </VidLayoutContext.Provider>
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
