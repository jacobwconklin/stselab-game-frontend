import { useContext, useState } from 'react';
import './WaitRoom.scss';
import { UserContext } from '../../App';
import { Button, Table } from 'antd';
import { postRequest } from '../../Utils/Api';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../ReusableComponents/VerificationModal';
import GolfBall from '../../ReusableComponents/GolfBall';
import { PlayerBrief } from '../../Utils/Types';

// Shows all players in a given session. If the user is the host they can remove players or begin the session.
// other wise players have to wait or leave the session. Also show Hosts the session join code (and maybe link) so they
// can invite players to join their session.
const WaitRoom = (props: { players: Array<PlayerBrief> }) => {

    // all players come from session status from GameController rather than storing in state it should be
    // available through props
    // const [allPlayers, setAllPlayers] = useState<[any] | []>([]);

    // check host status and session id / join code from context
    const { isHost, sessionId, playerId } = useContext(UserContext) as any;
    // Ensure host doesn't click button multiple times
    const [beginningTournament, setBeginningTournament] = useState(false);

    const navigate = useNavigate();

    const hostBeginTournament = async () => {
        setBeginningTournament(true);
        const response = await postRequest("session/advance", JSON.stringify({ sessionId }));
        if (!response.success) {
            setBeginningTournament(false);
            alert("Error beginning tournament, please try again.");
            console.error(response);
        }
    }

    // tells backend to remove a player from their session
    const removePlayer = async (playerIdToRemove: any) => {
        const response = await postRequest("player/remove", JSON.stringify({ playerId: playerIdToRemove }));
        if (playerId === playerIdToRemove) {
            navigate('/');
        }
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

    const columns = [
        {
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Golf Ball',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <GolfBall color={color} ></GolfBall>
        },
    ];

    const data = props?.players?.map((player, index) => (
        {
            key: player.id,
            number: index + 1,
            name: player.name,
            color: player.color,
        }
    ))



    return (
        <div className='WaitRoom'>
            {
                isHost ?
                    <div className='Instructions'>
                        <h1>Join Code: {sessionId}</h1>
                        <h3>
                            <span>Join Link: </span>
                            <span style={{ color: 'blue' }}>
                                {process.env.NODE_ENV === 'production' ?
                                    "https://stselab.azurewebsites.net/register/join/" + sessionId :
                                    "localhost:3000/register/join/" + sessionId}
                            </span>
                        </h3>
                        <p>
                            As host you control when the tournament starts and each round ends. After starting the tournament players can no
                            longer join. You must share the join code or join link with other players so that they may enter the tournament. You can remove players from the tournament by clicking on their row.
                        </p>

                        <h2> Players in the Tournament: {props.players && props.players.length > 0 ? props.players.length : "..."} </h2>
                        <Button
                            disabled={beginningTournament}
                            onClick={hostBeginTournament}
                            type='primary'
                        >
                            Begin Tournament
                        </Button>
                    </div>
                    :
                    <div className='Instructions'>
                        <h1>Join Code: {sessionId}</h1>
                        <h3>
                            <span>Join Link: </span>
                            <span style={{ color: 'blue' }}>
                                {process.env.NODE_ENV === 'production' ?
                                    "https://stselab.azurewebsites.net/register/join/" + sessionId :
                                    "localhost:3000/register/join/" + sessionId}
                            </span>
                        </h3>
                        <p>
                            The host controls when the tournament starts and each round ends. You will automatically move to the next screen
                            as soon as the game begins. if you wish to exit the session you may click
                            below. You can also click the title in the header to return to the landing page at any time.
                            Share the join code or join link to help other players join the tournament.
                        </p>
                        <h2> Players in the Tournament: {props.players && props.players.length > 0 ? props.players.length : "..."} </h2>
                        <Button
                            onClick={() => {
                                setPlayerIdToRemove(playerId);
                                setModalTitle('Are you sure you want to exit the tournament?');
                                setModalMessage('You will leave the tournament.');
                                setShowModal(true);
                            }}
                        >
                            Exit Tournament
                        </Button>
                    </div>
            }

            <div className='ResultTable'>
                <Table
                    pagination={{ pageSize: 10, position: ['none', props.players.length > 10 ? 'bottomCenter' : "none"] }}
                    columns={columns}
                    dataSource={data}
                    rowClassName={(record, index) => {
                        if (isHost && record.key && record.key.toLowerCase() !== playerId.toLowerCase()) {
                            return 'Clickable';
                        } else if (record.key?.toLowerCase() === playerId.toLowerCase()) {
                            return 'MatchingPlayer';
                        } else {
                            return 'HighlightRow'
                        }
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                if (isHost && record.key && record.key.toLowerCase() !== playerId.toLowerCase()) {
                                    setPlayerIdToRemove(record.key);
                                    setModalTitle('Are you sure you want to remove: ' + record.name + '?');
                                    setModalMessage('The player will be removed from the Tournament including all of their information');
                                    setShowModal(true);
                                }
                            },
                        }
                    }}
                />
            </div>
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