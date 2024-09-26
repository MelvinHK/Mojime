import { Dispatch, SetStateAction } from "react";

/** 
 * Used in place of react-router's useNavigate() to prevent re-rendering of video player;
 * allowing navigation whilst in fullscreen.
 * 
 * To reference the episode number url parameter, use episodeNoState in '../contexts/WatchProvider.tsx'.
 * 
 * @param episodeNo - The episode number to navigate to.
 * @param setEpisodeNoState - Pass the setEpisodeNoState function in '../contexts/WatchProvider.tsx'.
*/
export const navigateToEpisode = (
  episodeNo: string | number,
  setEpisodeNoState: Dispatch<SetStateAction<string | undefined>>
) => {
  history.pushState(null, "", String(episodeNo));
  setEpisodeNoState(String(episodeNo));
}