import { Key, Suspense } from 'react';
import { useAppSelector } from '@src/store/store';
import PodcastCard from '../PodcastCard/PodcastCard';
import PodcastSearch from '../PodcastSearch/PodcastSearch';
import { useSearchPodcast } from '../../hooks/useSearchPodcast';
import './PodcastList.css';
import { useHistory } from 'react-router-dom';

type PodcastMapTypes = {
  podcastImage: { label: any }[];
  podcastName: { label: any };
  podcastArtist: { label: any };
  id: {
    // label: "https://podcasts.apple.com/us/podcast/the-joe-budden-podcast/id1535809341?uo=2",
    attributes: {
      'im:id': string;
    };
  };
};

const PodcastList = () => {
  const podcastsResponseView = useAppSelector((state) => state.podcastSlice);
  const { filteredPodcasts, searchTerm, setSearchTerm } = useSearchPodcast(
    podcastsResponseView.podcasts?.feed?.podcasts
  );

  const history = useHistory();

  const handlePodcastClick = (id: string) => {
    history.push(`/podcast/${id}`);
  };

  return (
    <div className="podcast-main-container">
      <div className="podcast-search-container">
        <PodcastSearch
          filteredPodcasts={filteredPodcasts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="podcast-list-container">
        {filteredPodcasts?.length > 0 ? (
          filteredPodcasts.map((entry: PodcastMapTypes, index: Key) => (
            <Suspense key={index} fallback={<>Loading...</>}>
              <PodcastCard
                image={`${entry.podcastImage[2].label}`}
                name={`${entry.podcastName.label}`}
                artist={`${entry.podcastArtist.label}`}
                onClick={() => handlePodcastClick(entry.id.attributes['im:id'])}
              />
            </Suspense>
          ))
        ) : (
          <p>No podcasts found</p>
        )}
      </div>
    </div>
  );
};

export default PodcastList;
