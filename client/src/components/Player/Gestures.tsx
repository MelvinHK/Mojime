import { useContext } from "react";
import { useDebouncedState } from "../../utils/hooks/useDebouncedState";
import { Gesture, GestureWillTriggerEvent } from "@vidstack/react";
import styles from '../../styles/player/video-layout.module.css'
import { PlayerContext } from "../Player";

export default function Gestures() {
  const { isTapGesture } = useContext(PlayerContext);

  const [isForwardSeeking, setIsForwardSeeking] = useDebouncedState(false, 500);
  const [forwardedTime, setForwardedTime] = useDebouncedState(0, 750);

  const [isBackSeeking, setIsBackSeeking] = useDebouncedState(false, 500);
  const [backedTime, setBackedTime] = useDebouncedState(0, 750);

  const onControlsWillToggle = (e: GestureWillTriggerEvent) => {
    if (!isTapGesture.current) {
      e.preventDefault();
    }
  }

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
        onWillTrigger={(_, nativeEvent) =>
          onControlsWillToggle(nativeEvent)
        }
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:-10"
        onTrigger={() => (
          setIsBackSeeking(true),
          setBackedTime(backedTime + 10)
        )}
        children={
          <SeekTenFeedback
            active={isBackSeeking}
            seekType={false}
            seekedTime={backedTime}
          />
        }
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:10"
        onTrigger={() => (
          setIsForwardSeeking(true),
          setForwardedTime(forwardedTime + 10)
        )}
        children={
          <SeekTenFeedback
            active={isForwardSeeking}
            seekType={true}
            seekedTime={forwardedTime}
          />
        }
      />
    </>
  );
}

interface seekFeedbackProps {
  active: boolean;
  seekType: boolean; // false = -10s, true = +10s.
  seekedTime: number;
}

function SeekTenFeedback({ active, seekType, seekedTime }: seekFeedbackProps) {
  return (
    <div
      className={`flex fl-a-center fl-j-center ${styles.seekTenFeedback}`}
      data-triggered={active.toString()}
      data-seek-type={seekType.toString()}
    >
      {seekType ? "+" : "-"}{seekedTime}s
    </div>
  )
}
