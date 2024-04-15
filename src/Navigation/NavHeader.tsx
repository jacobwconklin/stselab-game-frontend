import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';
import stselabGamesLogo from '../Assets/stselab-games-logo.svg';
import VerificationModal from '../ReusableComponents/VerificationModal';
import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { UserContextType } from '../Utils/Types';

// NavHeader
const NavHeader = () => {

    const navigate = useNavigate();
    const [showReturnHomeModal, setShowReturnHomeModal] = useState(false);
    const { sessionId } = useContext(UserContext) as UserContextType;

    return (
        <div className='NavHeader top-font'>
            <div
                className='HeaderContainer Clickable'
                onClick={() => {
                    if (window.location.pathname !== '/') {
                        setShowReturnHomeModal(true)
                    } else {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    }
                }}
            >
                <h1 className='Title'>STSELAB GAMES</h1>
                <img className='HeaderLogo' src={stselabGamesLogo} alt='Stselab games logo: a golfball in a gear' />

            </div>
            {
                // show session join code so others can join ongoing session
                sessionId &&
                <div className='SessionJoinCode'>
                    <p>
                        Session Join Code: 
                    </p>
                    <p>
                        {sessionId}
                    </p>
                </div>
            }
            {
                // if player is in an ongoing session, will want to ask them if they are sure they want to return home as it will cause 
                // them to leave their session. Do this via the verification modal.
                showReturnHomeModal &&
                <VerificationModal
                    title='Are you sure you want to return Home?'
                    message='Returning home will cause you to lose all progress and data if you are in a session. Are you sure you want to go?'
                    confirm={() => {
                        navigate('/')
                        // TODO exit player from session?
                    }}
                    cancel={() => setShowReturnHomeModal(false)}
                />
            }
        </div>
    )
}

export default NavHeader;