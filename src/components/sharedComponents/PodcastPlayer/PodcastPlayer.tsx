import "./PodcastPlayer.css";

const PodcastPlayer = (props: { url: string | undefined }) => {

  if (!props.url) {
    return <div>No podcast URL available.</div>;
  }

  return (
    <div className="audio-player-container">
      
          <audio className="audio-player" controls>
            <source src={props.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
      
  
    </div>
  );
};

export default PodcastPlayer;
