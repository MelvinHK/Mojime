import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Header from "./components/Header";
import Error from "./pages/Error";
import { WatchProvider } from "./contexts/WatchProvider";
import { connectToDatabase } from "./utils/api";
import { useEffect } from "react";

interface RootProps {
  routeError?: JSX.Element;
}

function Root(props: RootProps) {
  const location = useLocation();

  useEffect(() => {
    connectToDatabase();
  }, [])

  return (
    <WatchProvider>
      <div className="content">
        <Header />
        {props.routeError ||
          <ErrorBoundary
            key={location.pathname}
            FallbackComponent={Error}
          >
            <Outlet />
          </ErrorBoundary>
        }
      </div>
    </WatchProvider>
  );
}

export default Root;