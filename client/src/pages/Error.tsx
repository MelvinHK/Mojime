import { isAxiosError } from "axios";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom"

interface ErrorProps {
  error?: any;
}

function Error({ error }: ErrorProps) {
  const routeError = useRouteError();

  const errorMessage = () => {
    if (isRouteErrorResponse(routeError)) {
      return (
        <p className="txt-center">
          {routeError.status} {routeError.data}
        </p>
      );
    } else if (error.status) {
      return (
        <p>{error.status} Error: {error.statusText}</p>
      );
    } else if (isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return <p>Connection Error: Request timed out; it took too long! Reload to try again.</p>
      }
    } else {
      return (
        <p>Unknown Error: I'm not sure what went wrong!</p>
      )
    }
  }

  return (
    <div className="content fl-j-center">
      <p>!!{`(っ °Д °;)っ`}</p>
      {errorMessage()}
      <Link to="/">Home</Link>
    </div>
  );
}

export default Error;