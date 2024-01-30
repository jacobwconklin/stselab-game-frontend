import { useContext, useEffect, useState } from 'react';
import './Session.scss';
import { postRequest } from '../../Utils/Api';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { Button } from 'antd';
// import { UserInformation } from '../../Utils/Types';

// Shows all players in a given session. If the user is the host they can remove players or begin the session.
// other wise players have to wait or leave the session. Also show Hosts the session join code (and maybe link) so they
// can invite players to join their session.
const Session = (props: any) => {

    const [allPlayers, setAllPlayers] = useState<[any] | []>([]);
    // use to make sure user is in a valid session
    const [inValidSession, setInValidSession] = useState(true);

    // check host status and session id / join code from context
    const {isHost, sessionId} = useContext(UserContext) as any;

    // handle showing modal and message
    // const [showModal, setShowModal] = useState(false);
    // const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // Pull all Session players from server 
        const getSession = async () => {
            try {
                const response = await postRequest('session/players', JSON.stringify({sessionId}));
                console.log(response);
                // if response tells us that session is invalid then redirect to home page
                if (!sessionId || response.error === "Players not found") {
                    setInValidSession(false);
                } else if (response.error) {
                    // TODO may need to attempt to exit player from session they are in then redirect them home?
                    alert("Error getting session: " + response.error);
                } else {
                    setAllPlayers(response.players);
                }
            } catch (error) {
                console.log("Error pulling all resulsts: ", error);
            }
        }
        getSession();
    }, [sessionId]);

    // Only allow users to session page if they are registered
    if (!inValidSession) {
        return <Navigate to="/" />
    } else 
        return (
        <div className='Session'>
            {
                isHost ?
                <div className='Instructions'>
                    <h1>Join Code: {sessionId}</h1>
                    <p>
                        As host you control when the tournament starts and each round ends. After starting the tournament players can no 
                        longer join. You must share the join code with other players so that they may enter the tournament. You can also
                        remove players from the tournament by clicking on their row.
                    </p>
                    <Button>
                        Begin Tournament
                    </Button>
                </div>
                :
                <div className='Instructions'>
                    <p>
                        The host controls when the tournament starts and each round ends. You will automatically move to the next screen 
                        as soon as the game begins. if you wish to exit the session you may click 
                        below. You can also click the title in the header to return to the landing page at any time.
                    </p>
                    <Button>
                        Exit Tournament
                    </Button>
                </div>
            }
            <div className='TournamentPlayers'>
                <h2> Players in the Tournament </h2>
            </div>
            {
                allPlayers && allPlayers.length > 0 && 
                <div className='GridHeader'>
                    <p>First Name</p>
                    <p>Golf Ball</p>
                </div>
            }
            {
                // TODO rather than use border color just show the player's golf balls. 
                allPlayers && allPlayers.length > 0 && 
                allPlayers.map((result: any, index: number) => (
                    <div className={`UserResult ${isHost ? 'Clickable' : ''}`}
                        onClick={() => {
                            if (isHost) {
                                // TODO tell backend to remove this player
                                alert("remove not implemented yet")
                            }
                        }}
                    >
                        <p>{result.firstName}</p>
                        <svg className='GolfBall' fill={result.color} stroke={result.color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m14 9a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm0-3a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm-2-4a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8zm5-12a1 1 0 1 0 1 1 1 1 0 0 0 -1-1z"/></svg>
                    </div>
                ))
            }
            {
                // showModal &&
                // <div className='Modal'>
                //     <h2>Are you sure?</h2>
                //     <p>{modalMessage}</p>
                //     <div className='ModalButtons'>
                //         <Button>Yes</Button>
                //         <Button>No</Button>
                //     </div>
                // </div>
            }
        </div>
    )
}

export default Session;