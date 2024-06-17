import styles from '../../styles/player/video-layout.module.css'
import { Controls, Gesture, useMediaRemote } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Sliders from './sliders'
import { TimeGroup } from './timeGroup';
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { WatchContext } from '../../contexts/WatchProvider';
import { isDesktop, isMobile } from 'react-device-detect';
import { debounce } from 'lodash-es';

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

  const [draggedTime, setDraggedTime] = useState("");

  const VidLayoutContextValues = {
    draggedTime, setDraggedTime
  }

  return (
    <VidLayoutContext.Provider value={VidLayoutContextValues}>
      <Controls.Root className={styles.controls} hideOnMouseLeave={true}>
        <p className={styles.playerTitle}>
          {animeInfo?.title as string} - Episode {episodeNoState}
        </p>
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
    </VidLayoutContext.Provider>
  );
}

function Gestures() {
  const [isForward, setIsForward] = useDebouncedState(false, 500);
  const [isBackward, setIsBackward] = useDebouncedState(false, 500);

  const remote = useMediaRemote();

  useEffect(() => {
    if (isMobile) {
      const toggleFullscreen = () => {
        remote.toggleFullscreen();
      }

      window.addEventListener('playerdrag', toggleFullscreen);
      return () => window.removeEventListener('playerdrag', toggleFullscreen);
    }
  }, [])

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
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:-10"
        onTrigger={() => setIsBackward(true)}
        children={<SeekTenFeedback active={isBackward} seekType={false} />}
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:10"
        onTrigger={() => setIsForward(true)}
        children={<SeekTenFeedback active={isForward} seekType={true} />}
      />
    </>
  );
}

const useDebouncedState = (initialValue: boolean, delay: number) => {
  const [state, setState] = useState(initialValue);

  const debouncedSetState = useCallback(
    debounce(() => setState(false), delay),
    [delay]
  );

  useEffect(() => {
    if (state) {
      debouncedSetState();
    }
  }, [state, debouncedSetState]);

  return [state, setState] as const;
};

interface seekFeedbackProps {
  active: boolean;
  seekType: boolean; // false = -10s, true = +10s.
}

function SeekTenFeedback({ active, seekType }: seekFeedbackProps) {
  return (
    <div
      className={`flex fl-a-center fl-j-center ${styles.seekTenFeedback}`}
      data-triggered={active.toString()}
      data-seek-type={seekType.toString()}
    >
      {seekType ? "+" : "-"}10s
    </div>
  )
}
