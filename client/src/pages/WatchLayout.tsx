import Watch from "../components/Watch"
import { kaomojis } from "./Home"
import { Link } from "react-router-dom"

const randomIndex = Math.floor(Math.random() * kaomojis.length);

export default function WatchLayout() {
  return (
    <>
      <Watch />
      <Link to="/" id="home">
        {kaomojis[randomIndex]}
      </Link>
    </>
  )
}