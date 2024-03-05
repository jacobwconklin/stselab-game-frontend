import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';
import golfLogo from '../Assets/golf-course-blue.svg';
import VerificationModal from '../ReusableComponents/VerificationModal';
import { useState } from 'react';
import GolfBall from '../ReusableComponents/GolfBall';

// NavHeader
const NavHeader = () => {

    const navigate = useNavigate();
    const [showReturnHomeModal, setShowReturnHomeModal] = useState(false);

    return (
        <div className='NavHeader top-font'>
            <h1 className='Title' onClick={() => {
                if (window.location.pathname !== '/') {
                    setShowReturnHomeModal(true)
                } else {
                    window.location.reload();
                }
            }}>STSELAB G<GolfBall size={28} />LF</h1>
            <img className='HeaderLogo' src={golfLogo} alt='Golf Hole' />
            {
                // if player is in an ongoing session, will want to ask them if they are sure they want to return home as it will cause 
                // them to leave their session. Do this via the verification modal.
            }
            {
                showReturnHomeModal &&
                <VerificationModal
                    title='Are you sure you want to return Home?'
                    message='Returning home will cause you to lose all progress and data if you are in a session. Are you sure you want to go?'
                    confirm={() => navigate('/')}
                    cancel={() => setShowReturnHomeModal(false)}
                />
            }
        </div>
    )
}

export default NavHeader;