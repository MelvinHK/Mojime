import { useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

export const usePlayerGesture = () => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }))
  const dragThreshold = 25;
  const bound = dragThreshold * 3;

  var tapHoldTimer: NodeJS.Timeout;

  const [tapHoldXY, setTapHoldXY] = useState<number[]>([]);
  const pointerMoving = useRef(false);

  const bind = useGesture({
    onDrag: ({ down, movement: [_mX, mY], dragging, tap }) => {
      if (tap) {
        if (tapHoldXY.length !== 0) {
          dispatchEvent(new CustomEvent('cancelcontrolstoggle'));
        }
        return;
      }

      pointerMoving.current = true;
      if (Math.abs(mY) >= bound) {
        mY = bound * Math.sign(mY);
      }
      if (!dragging) {
        if (Math.abs(mY) >= bound) {
          dispatchEvent(new CustomEvent('playerfullscreen'));
        }
        mY = 0;
        pointerMoving.current = false;
      }

      api.start({ y: mY, immediate: down });
    },
    onPointerDown: ({ event: e }) => {
      if (tapHoldXY.length !== 0) {
        setTimeout(() => setTapHoldXY([]), 100); // This is needed.
      } else {
        tapHoldTimer = setTimeout(() => {
          if (!pointerMoving.current) {
            setTapHoldXY([Math.round(e.clientX), Math.round(e.clientY)]);
            dispatchEvent(new CustomEvent('cancelcontrolstoggle'));
          }
        }, 500)
      }
    },
    onPointerUp: () => {
      clearTimeout(tapHoldTimer);
    },
  }, {
    drag: {
      axis: 'y',
      threshold: dragThreshold,
      filterTaps: true
    }
  })

  return { bind, y, tapHoldXY, setTapHoldXY } as const;
}