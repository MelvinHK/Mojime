import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom"

export default function Error() {
  const error = useRouteError();
  console.log(error);

  const errorMessage = () => {
    if (isRouteErrorResponse(error)) {
      return (
        <p className="txt-center">
          {error.status} {error.data}
        </p>
      );
    } else {
      return (
        <p>Unknown Error</p>
      );
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