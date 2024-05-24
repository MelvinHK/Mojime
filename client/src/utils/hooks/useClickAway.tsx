import { useEffect } from 'react';

const useClickAway = (ref: HTMLElement | null, onClickAway: () => void) => {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!ref?.contains(e.target as Node)) {
        onClickAway();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [ref, onClickAway]);
};

export default useClickAway;