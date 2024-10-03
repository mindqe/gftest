import { useState, useEffect } from 'react';

export const useSearchPodcast = (podcasts: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPodcasts, setFilteredPodcasts] = useState(podcasts);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPodcasts(podcasts);
      return;
    }

    const results = podcasts?.filter(
      (podcast: {
        podcastName: { label: string };
        podcastArtist: { label: string };
      }) =>
        podcast.podcastName.label
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        podcast.podcastArtist.label
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredPodcasts(results);
  }, [searchTerm, podcasts]);

  return { filteredPodcasts, searchTerm, setSearchTerm };
};
