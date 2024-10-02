import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useEffect } from "react";
import {
  fetchPodcastDetail,
  fetchPodcastEpisodes,
} from "@src/store/reducers/podcastSlice/podcastSlice";
import { useHistory } from "react-router-dom";
import { useConvertTime, useDateFormat } from "@src/hooks/useUtils";
import "./PodcastDetail.css";
import PodcastInfoBox from "../sharedComponents/PodcastInfoBox/PodcastInfoBox";

type QueryParams = { id: string };

const PodcastDetail = (): React.ReactNode => {
  const { id } = useParams<QueryParams>();
  const dispatch = useAppDispatch();
  const podcast = useAppSelector((state) => state.podcastSlice.podcast);
  const podcasts = useAppSelector((state) => state.podcastSlice.podcasts);
  const episode = useAppSelector((state) => state.podcastSlice.episodes);
  const fullObject = useAppSelector((state) => state.podcastSlice);
  const history = useHistory();

  const parentPodcastEntry = podcasts?.feed.podcasts.find(
    (entry) => entry.id.attributes["im:id"] === id
  );
  // const podcastEpisodeTitle = episode?.data.map(element => element.attributes.itunesTitle)
  // const podcastsCollection = podcast?.contents?.results.find(
  //   (element) => String(element.artistId) === id
  // );
  console.log(parentPodcastEntry, "COLLECTION");
  console.log("PodcastList: ", fullObject);

  const handleEpisodeClick = (id: string) => {
    history.push(`/podcast/${parentPodcastEntry?.id.attributes["im:id"]}/episode/${id}`);
  };

  useEffect(() => {
    if (!podcast) {
      dispatch(fetchPodcastDetail(id));
      dispatch(fetchPodcastEpisodes(id));
    }
  }, [dispatch, podcast]);


  return (
    <div className="podcast-detal-container">
      <div className="podcast-detail-main">
        <PodcastInfoBox id={id}/>
        <div className="podcast-detail-episode">
          <div className="podcast-detail-episode-title">
            Episodes of {parentPodcastEntry?.podcastArtist.label}
          </div>
          <table>
            <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Duration</th>
              </tr>
            </thead>
       
            <tbody>
            
            {episode?.data && episode.data.length > 0 ? (
              episode.data.map((item) => (
                <tr className="podcast-episode-item" key={item.id} onClick={() => handleEpisodeClick(item.id)}>
                  <td>{item.attributes.name}</td>
                  <td>{useDateFormat(item.attributes.releaseDateTime)}</td>
                  <td>{useConvertTime(item.attributes.durationInMilliseconds)}</td>
                </tr>
              ))
            ) : (
              <tr><td>Loading Episodes...</td></tr>
            )}
            
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetail;
