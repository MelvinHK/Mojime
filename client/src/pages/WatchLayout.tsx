import Watch from "../components/Watch"
import Player from "../components/Player"
import { kaomojis } from "./Home"
import { Link, useParams } from "react-router-dom"
import { useContext, useMemo } from "react"
import { WatchContext } from "../contexts/WatchProvider"

export default function WatchLayout() {
  const { animeInfo, episodeNoState } = useContext(WatchContext);
  const { animeId } = useParams();

  const kaomoji = useMemo(() =>
    kaomojis[Math.floor(Math.random() * kaomojis.length)], []
  );

  return (
    <>
      {animeInfo && episodeNoState && animeInfo.id === animeId && (
        <Player />
      )}
      <Watch />
      <Link to="/" id="home">
        {kaomoji}
      </Link>
    </>
  )
}