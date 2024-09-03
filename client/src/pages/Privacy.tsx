import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="content fl-j-center">
      <p>Privacy Policy</p>
      <p className="txt-center">This website does not use cookies, collect visitor/usage information, nor analyse its traffic.</p>
      <Link to="/">Home</Link>
    </div>
  )
}