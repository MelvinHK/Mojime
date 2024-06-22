import styles from '../../styles/player/video-layout.module.css'
import { Controls, useMediaState } from '@vidstack/react';

import * as Buttons from './Buttons';
import * as Sliders from './Sliders'
import { TimeGroup } from './TimeGroup';
import { Gestures, TapHoldQuickControls } from './Gestures';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { WatchContext } from '../../contexts/WatchProvider';
import { isDesktop } from 'react-device-detect';

type VidLayoutContextType = {
  draggedTime: string,
  setDraggedTime: Dispatch<SetStateAction<string>>
}

export const VidLayoutContext = createContext<VidLayoutContextType>({
  draggedTime: "",
  setDraggedTime: () => { }
});

export function VideoLayout() {
  const { animeInfo, episodeNoState } = useContext(WatchContext);
  const isFullscreen = useMediaState('fullscreen');

  const [draggedTime, setDraggedTime] = useState("");

  const VidLayoutContextValues = {
    draggedTime, setDraggedTime
  }

  return (
    <VidLayoutContext.Provider value={VidLayoutContextValues}>
      <Controls.Root className={styles.controls}>
        {isFullscreen && (
          <p className={styles.playerTitle}>
            {animeInfo?.title as string} - Episode {episodeNoState}
          </p>
        )}
        <div className={styles.spacer} />
        <Sliders.Time />
        <Controls.Group className={styles.controlsGroup}>
          <div className={styles.playbackControls}>
            <Buttons.Previous />
            <Buttons.Play />
            <Buttons.Next />
          </div>
          <TimeGroup />
          <Buttons.Seek seconds={25} />
          <Buttons.Seek seconds={85} />
          <div className={styles.spacer} />
          {isDesktop && (
            <Buttons.Mute />
          )}
          <Buttons.Quality />
          <Buttons.Fullscreen />
        </Controls.Group>
      </Controls.Root>
      <Gestures />
      <TapHoldQuickControls />
    </VidLayoutContext.Provider>
  );
}
