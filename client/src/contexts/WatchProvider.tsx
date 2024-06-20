import { createContext, Dispatch, SetStateAction, useState, useMemo, useEffect } from "react"
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
  setIsLoadingEpisode: Dispatch<SetStateAction<boolean>>,

  episodeId: string | undefined,
  nextEpisodeId: string | undefined,
  hasNext: boolean | undefined,
  hasPrevious: boolean | undefined
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
  setIsLoadingEpisode: () => { },

  episodeId: undefined,
  nextEpisodeId: undefined,
  hasNext: undefined,
  hasPrevious: undefined
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

  const { episodeNoParam, animeId } = useParams();
  const [episodeNoState, setEpisodeNoState] = useState(episodeNoParam);
  // Pseudo episode number url parameter (see '../utils/navigateToEpisode.tsx')

  const [sources, setSources] = useState<IVideo[]>([]);
  const [qualities, setQualities] = useState<(string | undefined)[]>([undefined]);
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);

  useEffect(() => {
    setEpisodeNoState(episodeNoParam);
  }, [episodeNoParam]);

  const episodeId = useMemo(() =>
    animeInfo?.episodes?.[Number(episodeNoState) - 1]?.id,
    [animeInfo, episodeNoState]
  );
  const nextEpisodeId = useMemo(() =>
    animeInfo?.episodes?.[Number(episodeNoState)]?.id,
    [animeInfo, episodeNoState]
  );
  const hasNext = useMemo(() =>
    animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState)),
    [animeInfo, episodeNoState]
  );
  const hasPrevious = useMemo(() =>
    animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState) - 2),
    [animeInfo, episodeNoState]
  );

  useEffect(() => {
    if (animeId !== animeInfo?.id) {
      setSources([]);
      setQualities([undefined]);
    }
  }, [animeId, animeInfo])

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
    setIsLoadingEpisode,
    episodeId,
    nextEpisodeId,
    hasNext,
    hasPrevious
  }

  return (
    <WatchContext.Provider value={GlobalContextValues}>
      {props.children}
    </WatchContext.Provider>
  )
}