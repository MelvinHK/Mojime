import { useRouteError, isRouteErrorResponse } from "react-router-dom"

interface ErrorProps {
  error?: any;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
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
    } else {
      return (
        <p>Unknown Error: I'm not sure what went wrong!!!</p>
      )
    }
  }

  return (
    <div className="content fl-j-center">
      <p>!!{`(っ °Д °;)っ`}</p>
      {errorMessage()}
      <a href="/">Home</a>
    </div>
  );
}

export default Error;