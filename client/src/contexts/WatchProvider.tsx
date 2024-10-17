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

  episodeNoState: string | undefined,
  setEpisodeNoState: Dispatch<SetStateAction<string | undefined>>,

  isLoadingEpisode: boolean,
  setIsLoadingEpisode: Dispatch<SetStateAction<boolean>>,

  episodeId: string | undefined,
  nextEpisodeId: string | undefined,
  hasNext: boolean | undefined,
  hasPrevious: boolean | undefined

  episodeIndex: number;
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

  episodeNoState: undefined,
  setEpisodeNoState: () => { },

  isLoadingEpisode: true,
  setIsLoadingEpisode: () => { },

  episodeId: undefined,
  nextEpisodeId: undefined,
  hasNext: undefined,
  hasPrevious: undefined,

  episodeIndex: -1
})

interface WatchProps {
  children: React.ReactNode;
}

export type PreloadedEpisode = {
  sources: IVideo[],
  qualities: (string | undefined)[]
}

export const WatchProvider = (props: WatchProps) => {
  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>();

  const { episodeNoParam, animeId } = useParams();
  const [episodeNoState, setEpisodeNoState] = useState(episodeNoParam);
  // 1a. Pseudo episode number url parameter (see '../utils/navigateToEpisode.tsx').

  const [sources, setSources] = useState<IVideo[]>([]);
  const [qualities, setQualities] = useState<(string | undefined)[]>([undefined]);
  const [selectedQuality, setSelectedQuality] = useState<(string | undefined)>();
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(true);

  // 1b. Synchronise pseudo ep param with useParam().
  useEffect(() => {
    setEpisodeNoState(episodeNoParam);
  }, [episodeNoParam]);

  // 1c. Update pseudo ep param during popstate events, i.e. forward/back page navigation.
  useEffect(() => {
    const handlePop = () => {
      // Ensure episodeNoParam exists to confirm user is on an episode route,
      // then synchronise with useParam() if not already.
      if (episodeNoParam && episodeNoParam !== episodeNoState) {
        setEpisodeNoState(episodeNoParam);
      }
    }
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [episodeNoParam, episodeNoState]);

  const getEpIndexFromEpNo = (epNo: string) => {
    return animeInfo?.episodes?.findIndex(ep => String(ep.number) === epNo) || 0;
  }

  const episodeIndex = useMemo(() =>
    episodeNoState ?
      getEpIndexFromEpNo(episodeNoState) :
      -1,
    [animeInfo, episodeNoState]
  );
  const episodeId = useMemo(() =>
    episodeNoState ?
      animeInfo?.episodes?.[episodeIndex]?.id :
      undefined,
    [animeInfo, episodeNoState]
  );
  const nextEpisodeId = useMemo(() =>
    episodeNoState ?
      animeInfo?.episodes?.[episodeIndex + 1]?.id :
      undefined,
    [animeInfo, episodeNoState]
  );
  const hasNext = useMemo(() =>
    episodeNoState ?
      animeInfo?.episodes?.hasOwnProperty(episodeIndex + 1) :
      undefined,
    [animeInfo, episodeNoState]
  );
  const hasPrevious = useMemo(() =>
    episodeNoState ?
      animeInfo?.episodes?.hasOwnProperty(episodeIndex - 1) :
      undefined,
    [animeInfo, episodeNoState]
  );

  useEffect(() => {
    if (animeId !== animeInfo?.id) {
      setSources([]);
      setQualities([undefined]);
    }
  }, [animeId, animeInfo]);

  const WatchContextValues = {
    animeInfo,
    setAnimeInfo,
    sources,
    setSources,
    qualities,
    setQualities,
    selectedQuality,
    setSelectedQuality,
    episodeNoState,
    setEpisodeNoState,
    isLoadingEpisode,
    setIsLoadingEpisode,
    episodeId,
    nextEpisodeId,
    hasNext,
    hasPrevious,
    episodeIndex
  }

  return (
    <WatchContext.Provider value={WatchContextValues}>
      {props.children}
    </WatchContext.Provider>
  )
}