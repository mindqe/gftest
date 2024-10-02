import './NavBar.css';
import { selectLoadingEpisodes } from '@src/store/reducers/podcastSlice/podcastSlice';

const NavBar = () => {
    const load = selectLoadingEpisodes
    return (
        <div className='podcast-navbar-container'>
            <div className="podcast-navbar-title">
                Podcaster
            </div>
            <div>
            {!load ? "Loaded" : "Loadin..." }
            </div>
        </div>
      
    );
}

export default NavBar