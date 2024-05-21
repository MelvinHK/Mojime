import styles from '../../styles/player/time-group.module.css';

import { Time } from '@vidstack/react';

export function TimeGroup() {
  return (
    <div className={styles.group}>
      <Time className={styles.time} type="current" />
      <div className={styles.divider}>/</div>
      <Time className={styles.time} type="duration" />
    </div>
  );
}
