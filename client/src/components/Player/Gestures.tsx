import { useContext, useEffect, useRef } from "react";
import { useDebouncedState } from "../../utils/hooks/useDebouncedState";
import { isMobile } from "react-device-detect";
import { useMediaRemote, Gesture, useMediaState, GestureWillTriggerEvent } from "@vidstack/react";

import { PlayerContext } from "../Player";

import vlStyles from '../../styles/player/video-layout.module.css'
import { Next, Previous, Seek } from "./Buttons";

export function Gestures() {
  const [isForwardSeeking, setIsForwardSeeking] = useDebouncedState(false, 500);
  const [forwardedTime, setForwardedTime] = useDebouncedState(0, 750);

  const [isBackSeeking, setIsBackSeeking] = useDebouncedState(false, 500);
  const [backedTime, setBackedTime] = useDebouncedState(0, 750);

  const remote = useMediaRemote();

  const isCancelControlsToggle = useRef(false);

  useEffect(() => {
    if (isMobile || window.matchMedia("(pointer: coarse)").matches) {
      const cancelControlsToggle = () => {
        isCancelControlsToggle.current = true;
      }
      const toggleFullscreen = () => {
        remote.toggleFullscreen();
      }

      window.addEventListener('playerfullscreen', toggleFullscreen);
      window.addEventListener('cancelcontrolstoggle', cancelControlsToggle);
      return () => {
        window.removeEventListener('playerfullscreen', toggleFullscreen);
        window.removeEventListener('cancelcontrolstoggle', cancelControlsToggle);
      };
    }
  }, [])

  const onControlsWillTrigger = (nativeEvent: GestureWillTriggerEvent) => {
    if (isCancelControlsToggle.current) {
      nativeEvent.preventDefault();
      isCancelControlsToggle.current = false;
    }
  }

  return (
    <>
      <Gesture
        className={vlStyles.gesture}
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className={vlStyles.gesture}
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className={vlStyles.gesture}
        event="pointerup"
        action="toggle:controls"
        onWillTrigger={(_, nativeEvent) => onControlsWillTrigger(nativeEvent)}
      />
      <Gesture
        className={vlStyles.gesture}
        event="dblpointerup"
        action="seek:-10"
        onTrigger={() => (setIsBackSeeking(true), setBackedTime(backedTime + 10))}
        children={<SeekTenFeedback active={isBackSeeking} seekType={false} seekedTime={backedTime} />}
      />
      <Gesture
        className={vlStyles.gesture}
        event="dblpointerup"
        action="seek:10"
        onTrigger={() => (setIsForwardSeeking(true), setForwardedTime(forwardedTime + 10))}
        children={<SeekTenFeedback active={isForwardSeeking} seekType={true} seekedTime={forwardedTime} />}
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
      className={`flex fl-a-center fl-j-center ${vlStyles.seekTenFeedback}`}
      data-triggered={active.toString()}
      data-seek-type={seekType.toString()}
    >
      {seekType ? "+" : "-"}{seekedTime}s
    </div>
  );
}

export function TapHoldQuickControls() {
  const { tapHoldXY, setTapHoldXY } = useContext(PlayerContext);
  const isFullscreen = useMediaState('fullscreen');

  var tapHoldSeekStyle: React.CSSProperties = {
    position: "absolute",
    left: `${tapHoldXY[0]}px`,
    top: `${tapHoldXY[1]}px`,
    transform: `translate(-50%, -200%)`,
    flexWrap: "nowrap",
    visibility: isFullscreen && tapHoldXY.length !== 0 ? "visible" : "hidden"
  }

  return (
    <div
      className={vlStyles.quickControls}
      style={tapHoldSeekStyle}
    >
      <Previous />
      <Next />
      <div onClick={() => setTapHoldXY([])}>
        <Seek seconds={25} />
      </div>
      <div onClick={() => setTapHoldXY([])}>
        <Seek seconds={85} />
      </div>
    </div >
  );
}
