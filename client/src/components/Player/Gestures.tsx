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
            setIsSeeking={setIsBackSeeking}
            setSeekedTime={setBackedTime}
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
            setIsSeeking={setIsForwardSeeking}
            setSeekedTime={setForwardedTime}
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
  setIsSeeking: (value: boolean) => void;
  setSeekedTime: (value: number) => void;
}

function SeekTenFeedback({ active, seekType, seekedTime, setIsSeeking, setSeekedTime }: seekFeedbackProps) {
  const { playerRef } = useContext(PlayerContext);

  const handleSubsequentTaps = () => {
    if (playerRef?.current) {
      setIsSeeking(true);
      setSeekedTime(seekedTime + 10);
      playerRef.current.currentTime += seekType ? 10 : -10;
    }
  }

  return (
    <button
      className={`flex fl-a-center fl-j-center ${styles.seekTenFeedback}`}
      data-triggered={active.toString()}
      data-seek-type={seekType.toString()}
      onClick={() => handleSubsequentTaps()}
    >
      {seekType ? "+" : "-"}{seekedTime}s
    </button>
  )
}
