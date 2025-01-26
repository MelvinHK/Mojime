import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Header from "./components/Header";
import Error from "./pages/Error";
import { WatchProvider } from "./contexts/WatchProvider";
import { useEffect } from "react";

interface RootProps {
  routeError?: JSX.Element;
}

function Root(props: RootProps) {

  useEffect(() => {
    alert("Announcement:\nThe video sources that this site extracts from have become broken/unavailable, so you will be unable to view any anime at this time. A refactor to extract from a different source is planned. Thank you for using Mojime!\n<(＿　＿)>~gomennasai");
  }, []);

  const location = useLocation();

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