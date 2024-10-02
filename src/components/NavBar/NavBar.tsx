import { useHistory } from 'react-router-dom';
import './NavBar.css';
import { useAppSelector } from '@src/store/store';

const NavBar = () => {
    const loadingState = useAppSelector(store => store.podcastSlice.loading)
    const history = useHistory();
    const handleNavbarClick = () => {
        history.push('/');
    }

    return (
        <div className='podcast-navbar-container'>
            <div className="podcast-navbar-title" onClick={handleNavbarClick}>
                Podcaster
            </div>
            <div>
            {loadingState? "Loaded" : "Loadin..." }
            </div>
        </div>
      
    );
}

export default NavBar