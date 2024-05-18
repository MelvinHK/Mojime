import { useRouteError } from "react-router-dom"

export default function Error() {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="content fl-j-center">
      <p>!!{`(っ °Д °;)っ`}</p>
      <p className="txt-center">
        Error {error.status}:
        <br></br>
        {error.error.message}
      </p>
      <a href="/">Home</a>
    </div>
  );
}