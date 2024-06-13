import styles from '../../styles/player/video-layout.module.css'
import { Controls, Gesture } from '@vidstack/react';

import * as Buttons from './buttons';
import * as Sliders from './sliders'
import { TimeGroup } from './timeGroup';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { WatchContext } from '../../contexts/WatchProvider';

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
          <Buttons.Quality />
          <Buttons.Fullscreen />
        </Controls.Group>
      </Controls.Root>
      <Gestures />
    </VidLayoutContext.Provider>
  );
}

function Gestures() {
  // const [isForward, setIsForward] = useState(false);
  // const [isBackward, setIsBackward] = useState(false);

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
      {/* <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:-10"
        onTrigger={() => setIsBackward(true)}
        children={<SeekTenFeedback active={isBackward} setActive={setIsBackward} seekType={false} />}
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:10"
        onTrigger={() => setIsForward(true)}
        children={<SeekTenFeedback active={isForward} setActive={setIsForward} seekType={true} />}
      /> */}
    </>
  );
}

// interface seekFeedbackProps {
//   active: boolean;
//   setActive: Dispatch<SetStateAction<boolean>>;
//   seekType: boolean; // false = -10s, true = +10s.
// }

// function SeekTenFeedback({ active, setActive, seekType }: seekFeedbackProps) {
//   useEffect(() => {
//     setTimeout(() => setActive(false), 500);
//   }, [active, setActive])

//   return (
//     <div
//       className={`flex fl-a-center fl-j-center ${styles.seekTenFeedback}`}
//       data-triggered={active.toString()}
//       data-seek-type={seekType.toString()}
//     >
//       {seekType ? "+" : "-"}10s
//     </div>
//   )
// }
