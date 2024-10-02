import "./PodcastCard.css";

type SingleCardProps = React.HTMLAttributes<HTMLElement> & {
    image: string;
    artist: string;
    name: string;
};



const PodcastCard = (props: SingleCardProps) => {
    return (
        <div className="single-card-container" onClick={props.onClick}>
            <div className='single-card-image'>
                <img width="128" height="128" src={props.image}/>           
            </div>
            <div className="single-card-content">
            <div className='single-card-name'>
                <p>{props.artist}</p>
            </div>
            <div className='single-card-author'>
                <span>Author: </span><span>{props.name}</span>
            </div>
            </div>
        
        </div>
    );
};

export default PodcastCard;

