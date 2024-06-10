import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./pages/Error";
import { Dispatch, SetStateAction, createContext, useState, useRef, MutableRefObject } from "react";
import { IAnimeInfo } from "@consumet/extensions";

interface RootProps {
  routeError?: JSX.Element;
}

type WatchContextType = {
  animeInfo: IAnimeInfo | undefined,
  setAnimeInfo: Dispatch<SetStateAction<IAnimeInfo | undefined>>,
  isFullscreen: MutableRefObject<boolean>,
  isAutoFullscreen: MutableRefObject<boolean>,
}

export const WatchContext = createContext<WatchContextType>({
  animeInfo: undefined,
  setAnimeInfo: () => { },
  isFullscreen: { current: false },
  isAutoFullscreen: { current: false }
});

function Root(props: RootProps) {
  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>();
  const isFullscreen = useRef(false);
  const isAutoFullscreen = useRef(false);

  const WatchContextValues: WatchContextType = {
    animeInfo,
    setAnimeInfo,
    isFullscreen,
    isAutoFullscreen
  }

  const location = useLocation();

  return (
    <div className="content">
      <Header />
      {props.routeError ||
        <ErrorBoundary
          key={location.pathname}
          FallbackComponent={Error}
        >
          <WatchContext.Provider value={WatchContextValues}>
            <Outlet />
          </WatchContext.Provider>
        </ErrorBoundary>
      }
    </div>
  );
}

export default Root;