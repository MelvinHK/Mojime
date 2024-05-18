import { Outlet } from "react-router-dom";
import Header from "./components/Header";

interface RootProps {
  rootErrorOutlet?: JSX.Element;
}

function Root(props: RootProps) {
  return (
    <div className="content">
      <Header />
      {props.rootErrorOutlet || <Outlet />}
    </div>
  );
}

export default Root;