import { useEffect } from 'react';

const useClickAway = (ref: HTMLElement | null, onClickAway: () => void) => {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!ref?.contains(e.target as Node))
        onClickAway();
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [ref, onClickAway]);
};

export default useClickAway;