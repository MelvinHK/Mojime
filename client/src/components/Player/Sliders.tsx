import { useContext, useRef } from 'react';
import styles from '../../styles/player/slider.module.css';

import { TimeSlider, TimeSliderInstance, VolumeSlider } from '@vidstack/react';
import { PlayerContext } from '../Player';
import { VidLayoutContext } from './videoLayout';

export function Time() {
  const { playerRef } = useContext(PlayerContext);
  const { setDraggedTime } = useContext(VidLayoutContext);

  const sliderRef = useRef<TimeSliderInstance>(null);

  const handleDraggedTime = (progressPercent: number) => {
    if (!playerRef?.current) { return; }

    const draggedSeconds = progressPercent * 0.01 * playerRef?.current?.duration;

    let minutes = Math.floor(draggedSeconds / 60);
    let seconds = String(Math.floor(draggedSeconds % 60));

    seconds = String(seconds).padStart(2, '0');

    setDraggedTime(`${minutes}:${seconds}`);
  }

  return (
    <TimeSlider.Root
      className={`time-slider ${styles.slider}`}
      noSwipeGesture
      pauseWhileDragging
      onDragValueChange={(detail) => handleDraggedTime(detail)}
      onDragEnd={() => setDraggedTime("")}
      ref={sliderRef}
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

export function Volume() {
  const handleSaveVolume = (value: number) => {
    localStorage.setItem("preferredVolume", String(value));
  }

  return (
    <VolumeSlider.Root
      className={`volume-slider ${styles.slider} ${styles.sliderSmall}`}
      orientation='vertical'
      onDragEnd={(detail) => handleSaveVolume(detail)}
    >
      <VolumeSlider.Track className={styles.track} />
      <VolumeSlider.TrackFill className={`${styles.trackFill} ${styles.track}`} />
      <VolumeSlider.Thumb className={styles.thumb} />
    </VolumeSlider.Root>
  );
}
