import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"
import { IAnimeInfo, IVideo } from "@consumet/extensions";
import { useParams } from "react-router-dom";

type GlobalContextType = {
  animeInfo: IAnimeInfo | undefined,
  setAnimeInfo: Dispatch<SetStateAction<IAnimeInfo | undefined>>,
  sources: IVideo[],
  setSources: Dispatch<SetStateAction<IVideo[]>>,
  qualities: (string | undefined)[],
  setQualities: Dispatch<SetStateAction<(string | undefined)[]>>,
  selectedQuality: string | undefined,
  setSelectedQuality: Dispatch<SetStateAction<(string | undefined)>>,
  currentTime: number,
  setCurrentTime: Dispatch<SetStateAction<number>>,
  episodeNoState: string | undefined,
  setEpisodeNoState: Dispatch<SetStateAction<string | undefined>>,
  isLoadingEpisode: boolean,
  setIsLoadingEpisode: Dispatch<SetStateAction<boolean>>
}

export const WatchContext = createContext<GlobalContextType>({
  animeInfo: undefined,
  setAnimeInfo: () => { },
  sources: [],
  setSources: () => { },
  qualities: [undefined],
  setQualities: () => { },
  selectedQuality: undefined,
  setSelectedQuality: () => { },
  currentTime: 0,
  setCurrentTime: () => { },
  episodeNoState: undefined,
  setEpisodeNoState: () => { },
  isLoadingEpisode: true,
  setIsLoadingEpisode: () => { }
})

interface GPProps {
  children: React.ReactNode;
}

export type PreloadedEpisode = {
  sources: IVideo[],
  qualities: (string | undefined)[]
}

export const WatchProvider = (props: GPProps) => {
  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>();

  const { episodeNoParam } = useParams();

  // Pseudo episode number url parameter (see '../utils/navigateToEpisode.tsx').
  const [episodeNoState, setEpisodeNoState] = useState(episodeNoParam);

  useEffect(() => {
    const handleEpisodeParam = () => {
      setEpisodeNoState(location.href.substring(location.href.lastIndexOf('/') + 1));
    }

    window.addEventListener('popstate', handleEpisodeParam);
    return () => window.removeEventListener('popstate', handleEpisodeParam);
  }, [])

  useEffect(() => {
    setEpisodeNoState(episodeNoParam);
  }, [episodeNoParam])

  const [sources, setSources] = useState<IVideo[]>([]);
  const [qualities, setQualities] = useState<(string | undefined)[]>([undefined]);
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);

  const GlobalContextValues = {
    animeInfo,
    setAnimeInfo,
    sources,
    setSources,
    qualities,
    setQualities,
    selectedQuality,
    setSelectedQuality,
    currentTime,
    setCurrentTime,
    episodeNoState,
    setEpisodeNoState,
    isLoadingEpisode,
    setIsLoadingEpisode
  }

  return (
    <WatchContext.Provider value={GlobalContextValues}>
      {props.children}
    </WatchContext.Provider>
  )
}