import { useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { MediaPlayerInstance, useMediaRemote } from "@vidstack/react";
import { RefObject, useRef } from "react";

export const usePlayerGesture = (playerRef: RefObject<MediaPlayerInstance>) => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }))
  const threshold = 25;
  const bound = threshold * 3;

  const isTapGesture = useRef(false);

  const remote = useMediaRemote(playerRef);

  const bind = useGesture({
    onDrag: ({ down, movement: [_mX, mY], dragging, tap }) => {
      if (isTapGesture.current = tap) { return; }

      if (Math.abs(mY) >= bound) {
        mY = bound * Math.sign(mY);
      }
      if (!dragging) {
        if (Math.abs(mY) >= bound) {
          remote.toggleFullscreen();
        }
        mY = 0;
      }

      api.start({ y: mY, immediate: down });
    },
  }, {
    drag: {
      axis: 'y',
      threshold: threshold,
      filterTaps: true
    }
  })
  return { bind, y, isTapGesture } as const;
}