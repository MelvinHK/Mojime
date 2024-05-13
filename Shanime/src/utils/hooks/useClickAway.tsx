import { useEffect } from 'react';

const useClickAway = (ref: HTMLElement | null, onClickAway: (condition: boolean) => void) => {
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
        onClickAway(!!ref?.contains(e.target as Node));
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [ref, onClickAway]);
};

export default useClickAway;