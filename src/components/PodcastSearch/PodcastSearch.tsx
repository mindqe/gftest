import './PodcastSearch.css'

const PodcastSearch = ({filteredPodcasts, searchTerm, setSearchTerm }: {filteredPodcasts: []; searchTerm: string; setSearchTerm: (term: string) => void }) => {
  return (
    <div className="podcast-search-main">        
      <span className="podcast-search-badge">
        {filteredPodcasts.length}
      </span>
      <input
        type="text"
        placeholder="Search podcasts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default PodcastSearch;
