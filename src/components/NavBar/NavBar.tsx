import { useAppSelector } from '@src/store/store';
import './NavBar.css';

const NavBar = () => {
    const load = useAppSelector((state) => state.podcastSlice);
    return (
        <div className='podcast-navbar-container'>
            <div className="podcast-navbar-title">
                Podcaster
            </div>
            <div>
            {load.loading && "loading" }
            </div>
        </div>
      
    );
}

export default NavBar