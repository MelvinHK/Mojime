import styles from '../../styles/player/slider.module.css';

import { TimeSlider } from '@vidstack/react';

export function Time() {
  return (
    <TimeSlider.Root
      className={`time-slider ${styles.slider}`}
      noSwipeGesture
      pauseWhileDragging
    >
      <TimeSlider.Track className={styles.track}>
        <TimeSlider.TrackFill
          className={`${styles.trackFill} ${styles.track}`}
        />
      </TimeSlider.Track>

      <TimeSlider.Thumb className={styles.thumb} />
    </TimeSlider.Root>
  );
}
