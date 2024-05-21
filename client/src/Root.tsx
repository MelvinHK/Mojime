import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./pages/Error";

interface RootProps {
  routeError?: JSX.Element;
}

function Root(props: RootProps) {
  const location = useLocation();

  return (
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
  );
}

export default Root;