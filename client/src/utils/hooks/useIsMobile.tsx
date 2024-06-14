import { useEffect, useState } from 'react';

const useIsMobileMatchMedia = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkDeviceType = () => setIsMobile(window.matchMedia('(max-width: 1368px)').matches);

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return isMobile;
};

export default useIsMobileMatchMedia;