import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./pages/Error";

interface RootProps {
  rootErrorOutlet?: JSX.Element;
}

function Root(props: RootProps) {
  return (
    <div className="content">
      <Header />
      {props.rootErrorOutlet ||
        <ErrorBoundary
          FallbackComponent={Error}
        >
          <Outlet />
        </ErrorBoundary>
      }
    </div>
  );
}

export default Root;