import { useHistory } from "react-router-dom";
import "./NavBar.css";
import { useAppSelector } from "@src/store/store";

const NavBar = () => {
  const loadingPodcast = useAppSelector((store) => store.podcastSlice.loadingPodcast);
  const loadingPodcasts = useAppSelector((store) => store.podcastSlice.loadingPodcasts);
  const loadingEpisodes = useAppSelector((store) => store.podcastSlice.loadingEpisodes);
  const history = useHistory();
  const handleNavbarClick = () => {
    history.push("/");
  };

  return (
    <div className="podcast-navbar-container">
      <div className="podcast-navbar-title" onClick={handleNavbarClick}>
        Podcaster
      </div>
      <div>
        <div className="dot-container">
          <div className={`dot ${loadingPodcast || loadingEpisodes || loadingPodcasts ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
