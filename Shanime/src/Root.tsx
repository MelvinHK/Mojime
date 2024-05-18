import { Outlet } from "react-router-dom";
import Header from "./components/Header";

interface IRootRoute {
  outlet?: any;
}

function Root(props: IRootRoute) {
  return (
    <div className="content">
      <Header />
      {props.outlet || <Outlet />}
    </div>
  );
}

export default Root;