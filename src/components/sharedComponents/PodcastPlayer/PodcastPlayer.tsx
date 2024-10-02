import React, { useRef, useState, useEffect } from 'react';
import "./PodcastPlayer.css";
interface AudioPlayerProps {
    url: string | undefined;
}

const PodcastPlayer: React.FC<AudioPlayerProps> = (props: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (audioRef.current) {
          audioRef.current.currentTime = Number(event.target.value);
      }
  };
    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };
        
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('timeupdate', updateCurrentTime);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('timeupdate', updateCurrentTime);
            }
        };
    }, []);

    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-player-container">
            <audio className="audio-player" ref={audioRef} src={props.url} />
            <div className="audio-controls">
                <button className="audio-button" onClick={togglePlay}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="audio-time">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    className="audio-progress"
                    value={currentTime}
                    onChange={handleTimeChange}
                    max={audioRef.current ? audioRef.current.duration : 0} // Set max value based on duration
                />
            </div>
            <button className="mute-button" onClick={toggleMute}>
                {isMuted ? 'Unmute' : 'Mute'}
            </button>
        </div>
    );
};

export default PodcastPlayer;
