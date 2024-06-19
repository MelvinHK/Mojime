import { useEffect } from "react";
import { useDebouncedState } from "../../utils/hooks/useDebouncedState";
import { isMobile } from "react-device-detect";
import { useMediaRemote, Gesture } from "@vidstack/react";
import styles from '../../styles/player/video-layout.module.css'

export default function Gestures() {
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
