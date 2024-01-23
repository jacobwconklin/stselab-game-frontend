import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';
import golfLogo from '../Assets/golf-course-blue.svg';

// NavHeader
const NavHeader = (props: any) => {

    const navigate = useNavigate();

    return (
        <div className='NavHeader'>
            <h1 className='Title' onClick={() => navigate('/')}>Demo App</h1>
            <img className='HeaderLogo' src={golfLogo} alt='Golf Hole' />
        </div>
    )
}

export default NavHeader;