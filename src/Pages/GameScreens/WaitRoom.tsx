import { useContext, useState } from 'react';
import './WaitRoom.scss';
import { UserContext } from '../../App';
import { Button } from 'antd';
import { postRequest } from '../../Utils/Api';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../ReusableComponents/VerificationModal';
import GolfBall from '../../ReusableComponents/GolfBall';

// Shows all players in a given session. If the user is the host they can remove players or begin the session.
// other wise players have to wait or leave the session. Also show Hosts the session join code (and maybe link) so they
// can invite players to join their session.
const WaitRoom = (props: any) => {

    // all players come from session status from GameController rather than storing in state it should be
    // available through props
    // const [allPlayers, setAllPlayers] = useState<[any] | []>([]);

    // check host status and session id / join code from context
    const {isHost, sessionId, playerId} = useContext(UserContext) as any;
    // Ensure host doesn't click button multiple times
    const [beginningTournament, setBeginningTournament] = useState(false);

    // handle showing modal and message
    // const [showModal, setShowModal] = useState(false);
    // const [modalMessage, setModalMessage] = useState('');

    const navigate = useNavigate();

    const hostBeginTournament = async () => {
        setBeginningTournament(true);
        const response = await postRequest("session/advance", JSON.stringify({sessionId}));
        if (!response.success) {
            setBeginningTournament(false);
            alert("Error beginning tournament, please try again.");
            console.error(response);
        }
    }

    // tells backend to remove a player from their session
    const removePlayer = async (playerId: any) => {
        const response = await postRequest("player/remove", JSON.stringify({ playerId }));
        if (!response.success) {
            alert("Error removing player from session, please try again.");
            console.error(response);
        }
    }

    // functionality for modal
    const [showModal, setShowModal] = useState(false);
    const [playerIdToRemove, setPlayerIdToRemove] = useState('');
    const [modalTitle, setModalTitle] = useState('Are you sure?');
    const [modalMessage, setModalMessage] = useState('Action cannot be undone');
    
    const cancelModal = () => {
        setShowModal(false);
    }

    const confirmModal = () => {
        removePlayer(playerIdToRemove);
        setShowModal(false);
    }

    return (
        <div className='WaitRoom'>
            {
                isHost ?
                <div className='Instructions'>
                    <h1>Join Code: {sessionId}</h1>
                    <h3 style={{color: 'blue'}}>
                        {process.env.NODE_ENV === 'production' ? 
                        "https://stselab.azurewebsites.net/register/join/" + sessionId : 
                        "localhost:3000/register/join/" + sessionId}
                    </h3>
                    <p>
                        As host you control when the tournament starts and each round ends. After starting the tournament players can no 
                        longer join. You must share the join code with other players so that they may enter the tournament. You can also share
                        the link above for players to join your session. You can remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={beginningTournament}
                        onClick={hostBeginTournament}
                    >
                        Begin Tournament
                    </Button>
                </div>
                :
                <div className='Instructions'>
                    <h1>Join Code: {sessionId}</h1>
                    <p>
                        The host controls when the tournament starts and each round ends. You will automatically move to the next screen 
                        as soon as the game begins. if you wish to exit the session you may click 
                        below. You can also click the title in the header to return to the landing page at any time.
                    </p>
                    <Button
                        onClick={() => {
                            removePlayer(playerId);
                            navigate("/");  
                        }}
                    >
                        Exit Tournament
                    </Button>
                </div>
            }
            <div className='TournamentPlayers'>
                <h2> Players in the Tournament: {props.players && props.players.length > 0? props.players.length : "..."} </h2>
            </div>
            {
                props.players && props.players.length > 0 && 
                <div className='GridHeader'>
                    <p>Player Number</p>
                    <p>First Name</p>
                    <p>Golf Ball</p>
                </div>
            }
            {
                // TODO rather than use border color just show the player's golf balls. 
                props.players && props.players.length > 0 && 
                props.players.reverse().map((result: any, index: number) => (
                    <div key={index} 
                    className={`UserResult 
                        ${isHost && result?.id?.toLowerCase() !== playerId?.toLowerCase() ? 'Clickable' : ''}
                        ${result?.id?.toLowerCase() === playerId?.toLowerCase() ? 'MatchingPlayer' : ''}`}
                        onClick={() => {
                            if (isHost && result.id?.toLowerCase() !== playerId?.toLowerCase()) {
                                // tell backend to remove this player from the session
                                setPlayerIdToRemove(result.id);
                                setModalTitle('Are you sure you want to remove: ' + result.name + '?');
                                setModalMessage('The player will be removed from the Tournament including all of their information');
                                setShowModal(true);
                            }
                        }}
                    >
                        <p>{index + 1}</p>
                        <p>{result.name}</p>
                        <GolfBall color={result.color} />
                    </div>
                ))
            }
            {
                (!props.players || props.players.length === 0) &&
                <div className='Loading'>
                    <h3>Loading Player Information... </h3>
                </div>
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
            {
                showModal && 
                <VerificationModal 
                    cancel={cancelModal}
                    confirm={confirmModal}
                    title={modalTitle}
                    message={modalMessage}
                />
            }
        </div>
    )
}

export default WaitRoom;