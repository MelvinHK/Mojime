import { useEffect, useState } from 'react';

const useMatchMobileMedia = (): boolean => {
  const [isMobileMedia, setIsMobileMedia] = useState<boolean>(false);

  useEffect(() => {
    const checkDeviceType = () => setIsMobileMedia(window.matchMedia('(max-width: 1368px)').matches);

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return isMobileMedia;
};

export default useMatchMobileMedia;