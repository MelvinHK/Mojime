import { useContext } from "react";
import { useDebouncedState } from "../../utils/hooks/useDebouncedState";
import { Gesture, GestureWillTriggerEvent } from "@vidstack/react";
import styles from '../../styles/player/video-layout.module.css'
import { PlayerContext } from "../Player";

export default function Gestures() {
  const { isTapGesture } = useContext(PlayerContext);

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
      <SeekTenGesture />
      <SeekTenGesture isForward={false} />
    </>
  );
}

function SeekTenGesture({ isForward = true }: { isForward?: boolean }) {
  const { playerRef } = useContext(PlayerContext);

  const [isSeeking, setIsSeeking] = useDebouncedState(false, 500);
  const [seekedTime, setSeekedTime] = useDebouncedState(0, 750);

  const feedbackStyle: React.CSSProperties = {
    opacity: isSeeking ? "1" : "0",
    pointerEvents: isSeeking ? "auto" : "none",
    color: isSeeking ? "var(--white)" : "transparent",
    backgroundImage: isForward ?
      "linear-gradient(to left, rgba(0, 0, 0, 0.314) 70%, rgba(0, 0, 0, 0))"
      :
      "linear-gradient(to right, rgba(0, 0, 0, 0.314) 70%, rgba(0, 0, 0, 0))"
  }

  const handleSubsequentTaps = () => {
    if (playerRef?.current) {
      setIsSeeking(true);
      setSeekedTime(seekedTime + 10);
      playerRef.current.currentTime += isForward ? 10 : -10;
    }
  }

  const feedbackArea = (): JSX.Element => {
    return (
      <button
        className={`flex fl-a-center fl-j-center ${styles.seekTenFeedback}`}
        style={feedbackStyle}
        onClick={() => handleSubsequentTaps()}
      >
        {isForward ? "+" : "-"}{seekedTime}s
      </button>
    );
  }

  return (
    <Gesture
      className={styles.gesture}
      event="dblpointerup"
      action={`seek:${isForward ? "" : "-"}10`}
      onTrigger={() => (
        setIsSeeking(true),
        setSeekedTime(seekedTime + 10)
      )}
      children={feedbackArea()}
    />
  );
}
