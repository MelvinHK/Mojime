import { useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

export const usePlayerGesture = () => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }))
  const threshold = 25;
  const bound = threshold * 3;

  const bind = useGesture({
    onDrag: ({ down, movement: [_mX, mY], dragging }) => {
      if (Math.abs(mY) >= bound) {
        mY = bound * Math.sign(mY);
      }
      if (!dragging) {
        if (Math.abs(mY) >= bound) {
          dispatchEvent(new CustomEvent('playerdrag'));
        }
        mY = 0;
      }
      api.start({ y: mY, immediate: down });
    },
  }, {
    drag: {
      axis: 'y',
      threshold: threshold
    }
  })
  return { bind, y } as const;
}