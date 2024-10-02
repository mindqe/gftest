import { useAppSelector } from "@src/store/store";
import PodcastInfoBox from "../sharedComponents/PodcastInfoBox/PodcastInfoBox";
import { useRouteMatch } from "react-router-dom";
import PodcastPlayer from "../sharedComponents/PodcastPlayer/PodcastPlayer";
import { PodcastEpisodeModel } from "@domain/models/PodcastEpisodeModel";
import "./PodcastEpisode.css";
import { useState, useEffect } from "react";
const PodcastEpisode = () => {
  const [foundEpisode, setFoundEpisode] = useState<
    PodcastEpisodeModel["data"][number] | undefined
  >();

  const params = useRouteMatch();
  const regexEpisode = /episode\/(\d+)/;
  const regexArtist = /podcast\/(\d+)/;
  const matchEpisode = params?.url?.match(regexEpisode);
  const matchArtist = params?.url?.match(regexArtist);
  const episodeId = matchEpisode?.[1];
  const artistId = matchArtist?.[1];
  console.log(artistId, episodeId, "BUBU");
  const episodes = useAppSelector((state) => state.podcastSlice.episodes);

  useEffect(() => {
    if (episodes?.data && episodes.data.length > 0 && episodeId) {
      const episodeItem = episodes.data.find((item) => item.id === episodeId);
      setFoundEpisode(episodeItem);
    }
  }, [episodes, episodeId]);

  return (
    <div className="podcast-episode-container-player">
      <div className="podcast-episode-main-player">
        <PodcastInfoBox id={artistId} />
        <div className="podcast-episode-inner-player">
          <div className="podcast-episode-name">
            {foundEpisode?.attributes.name}
          </div>
          <div className="podcast-episode-description">
            {foundEpisode?.attributes.description.standard}
          </div>
          <div className="podcast-episode-player">
            <PodcastPlayer url={foundEpisode?.attributes.assetUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastEpisode;
