import Watch from "../components/Watch"
import { kaomojis } from "./Home"
import { Link } from "react-router-dom"

export default function WatchLayout() {
  return (
    <>
      <Watch />
      <Link to="/" id="home">
        {kaomojis[Math.floor(Math.random() * kaomojis.length)]}
      </Link>
    </>
  )
}