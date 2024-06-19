import { useContext } from 'react';
import styles from '../../styles/player/time-group.module.css';

import { Time } from '@vidstack/react';
import { VidLayoutContext } from './VideoLayout';

export function TimeGroup() {
  const { draggedTime } = useContext(VidLayoutContext)

  return (
    <div className={styles.group}>
      {draggedTime !== "" ? (
        <div className={styles.time}>{draggedTime}</div>
      ) : (
        <Time className={styles.time} type="current" />
      )}
      <div className={styles.divider}>/</div>
      <Time className={styles.time} type="duration" />
    </div>
  );
}
