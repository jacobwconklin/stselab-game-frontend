import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';
import golfLogo from '../Assets/golf-course-blue.svg';

// NavHeader
const NavHeader = (props: any) => {

    const navigate = useNavigate();

    return (
        <div className='NavHeader'>
            <h1 className='Title' onClick={() => navigate('/')}>STSELab Golf</h1>
            <img className='HeaderLogo' src={golfLogo} alt='Golf Hole' />
            {
                // if player is in an ongoing session, will want to ask them if they are sure they want to return home as it will cause 
                // them to leave their session. Do this via the verification modal.
            }
        </div>
    )
}

export default NavHeader;