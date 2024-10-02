import "./PodcastInfoBox.css";
import { useAppSelector } from "@src/store/store";
const PodcastInfoBox = (props: { id: string | undefined }) => {
  const podcasts = useAppSelector((state) => state.podcastSlice.podcasts);

  const parentPodcastEntry = podcasts?.feed?.podcasts.find(
    (entry) => entry.id.attributes["im:id"] === props.id
  );

  return (
    <div className="podcast-detail-main-info">
      <div className="podcast-detail-main-image">
        <img alt="podcast-image" src={`${parentPodcastEntry?.podcastImage[2].label}`} />
      </div>
      <div className="podcast-detail-main-title">
        {parentPodcastEntry?.podcastArtist.label}
      </div>
      <div className="podcast-detail-main-description">
        {parentPodcastEntry?.summary.label}
      </div>
    </div>
  );
};

export default PodcastInfoBox;
