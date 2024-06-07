import { useContext, useEffect, useState } from 'react';
import './WaitRoom.scss';
import { UserContext } from '../../App';
import { Button, FloatButton, Table, Tooltip, message } from 'antd';
import { advanceSession, postRequest } from '../../Utils/Api';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../ReusableComponents/VerificationModal';
import GolfBall from '../../ReusableComponents/GolfBall';
import { PlayerBrief, UserContextType } from '../../Utils/Types';
import { CopyOutlined } from '@ant-design/icons';
import DiceSelectGame from '../DiceSelectGame/DiceSelectGame';
import { clearObjectFromStorage, getObjectFromStorage } from '../../Utils/Utils';

// Shows all players in a given session. If the user is the host they can remove players or begin the session.
// other wise players have to wait or leave the session. Also show Hosts the session join code (and maybe link) so they
// can invite players to join their session.
const WaitRoom = (props: { 
    onboardingCompleted: () => void
}) => {

    // check host status and session id / join code from context
    const { isHost, sessionId, playerId, setPlayerId, setSessionId, setPlayerColor } = useContext(UserContext) as UserContextType;

    // make user play dice onboarding game before they can join the session
    const [finishedDiceGame, setFinishedDiceGame] = useState(false);

    // if user refreshes page, check if they have already played the dice game for THIS session
    useEffect(() => {
        const diceGameFinished = getObjectFromStorage('diceGameFinished');
        if (diceGameFinished) {
            if (diceGameFinished.sessionId === sessionId && diceGameFinished.playerId === playerId && diceGameFinished.onboarding) {
                props.onboardingCompleted();
                setFinishedDiceGame(true);
            }
        }
    }, [sessionId, playerId, props])

    // Ensure host doesn't click button multiple times
    const [beginningTournament, setBeginningTournament] = useState<Boolean>(false);
    const [players, setPlayers] = useState<Array<PlayerBrief> | []>([]);
    const [completedOnboarding, setCompletedOnboarding] = useState<Array<string> | []>([]);

    const navigate = useNavigate();

    // Poll for all players in session
    useEffect(() => {
        // Pull all session information from the server, which checks the database, which is the Single Source of Truth.
        // Interval will regularly poll back-end for updates 
        const interval = setInterval(async () => {
            try {
                const response = await postRequest('session/players', JSON.stringify({ sessionId }));
                if (response.success) {
                    setPlayers(response.players);
                    setCompletedOnboarding(response.completedOnboarding);
                } else {
                    console.error("Error pulling players in session in wait room: ", response);
                }
            } catch (error) {
                console.error("Error pulling players in session in wait room: ", error);
            }
        }, 2500); // This is the frequency of the polling in milliseconds.

        // clear interval when component unmounts
        return () => {
            clearInterval(interval);
        }
    }, [sessionId]);

    // tells backend to remove a player from their session
    const removePlayer = async (playerIdToRemove: string) => {
        const response = await postRequest("player/remove", JSON.stringify({ playerId: playerIdToRemove }));
        if (playerId === playerIdToRemove) {
            clearObjectFromStorage('essentialPlayerInformation');
            setPlayerId(''); 
            setPlayerColor('');
            setSessionId(0);
            navigate('/');
        }
        if (!response.success) {
            alert("Error removing player from session, please try again.");
            console.error(response);
        }
    }

    // functionality for modals
    const [showBeginModal, setShowBeginModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [playerIdToRemove, setPlayerIdToRemove] = useState('');
    const [removeModalTitle, setRemoveModalTitle] = useState('Are you sure?');
    const [removeModalMessage, setRemoveModalMessage] = useState('Action cannot be undone');
    const [showJumpToMechanicalArmMission, setShowJumpToMechanicalArmMission] = useState(false);

    const cancelRemoveModal = () => {
        setShowRemoveModal(false);
    }

    const confirmRemoveModal = () => {
        removePlayer(playerIdToRemove);
        setShowRemoveModal(false);
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
        {
            title: 'Onboarded?',
            dataIndex: 'onboarded',
            key: 'onboarded',
            render: (onboarded: boolean) => onboarded ? 'Yes' : 'No'
        },
    ];

    const data = players.map((player, index) => (
        {
            key: player.id,
            number: index + 1,
            name: player.name,
            color: player.color,
            onboarded: player.completedOnboarding
        }
    ))

    const [messageApi, contextHolder] = message.useMessage();


    return (
        <>
            {
                !finishedDiceGame ?
                    <DiceSelectGame isOnboarding={true} finished={() => {
                            setFinishedDiceGame(true);
                            props.onboardingCompleted();
                        }}
                    />
                    :
                    <div className='WaitRoom'>
                        <div className='StaticBackground'>
                            <div className='StaticBackgroundImages'></div>
                        </div>
                        {contextHolder}
                        {
                            isHost ?
                                <div className='Instructions'>
                                    <h1>Join Code: {sessionId}</h1>
                                    <div className='JoinLinkContainer'>
                                        <h3>
                                            <span>Join Link: </span>
                                            <span style={{ color: 'blue' }}>
                                                {process.env.NODE_ENV === 'production' ?
                                                    "https://stselab-games.azurewebsites.net/register/join/" + sessionId :
                                                    "localhost:3000/register/join/" + sessionId}
                                            </span>
                                        </h3>
                                        <Tooltip title="Copy Join Link" placement="top">
                                            <FloatButton
                                                className='CopyJoinLinkButton'
                                                icon={<CopyOutlined />}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(process.env.NODE_ENV === 'production' ?
                                                        "https://stselab-games.azurewebsites.net/register/join/" + sessionId :
                                                        "localhost:3000/register/join/" + sessionId);
                                                    messageApi.open({
                                                        type: 'success',
                                                        content: 'Join Link Copied',
                                                    });
                                                }}
                                            >
                                                Copy Join Link
                                            </FloatButton>
                                        </Tooltip>
                                    </div>
                                    <p>
                                        As host you control when the tournament starts and each round ends. After starting the tournament players can no
                                        longer join. You must share the join code or join link with other players so that they may enter the tournament. You can remove players from the tournament by clicking on their row.
                                    </p>

                                    <h2> Players in the Tournament: {players && players.length > 0 ? players.length : "..."} </h2>
                                    <h2>
                                        {
                                            // Show how many players have completed onboarding:
                                            completedOnboarding.length === players.length ?
                                            "All players have completed onboarding" 
                                            :
                                            `${completedOnboarding.length} players have completed onboarding`
                                        }
                                    </h2>
                                    <Button
                                        disabled={!!beginningTournament || players.length < 1}
                                        onClick={() => setShowBeginModal(true)}
                                        type='primary'
                                    >
                                        Begin STSELab Golf
                                    </Button>
                                    <br></br>
                                    <Button
                                        disabled={!!beginningTournament}
                                        onClick={() => {setShowJumpToMechanicalArmMission(true)}}
                                    >
                                        Skip Golf and Jump To Mechanical Arm Mission
                                    </Button>
                                </div>
                                :
                                <div className='Instructions'>
                                    <h1>Join Code: {sessionId}</h1>
                                    <div className='JoinLinkContainer'>
                                        <h3>
                                            <span>Join Link: </span>
                                            <span style={{ color: 'blue' }}>
                                                {process.env.NODE_ENV === 'production' ?
                                                    "https://stselab-games.azurewebsites.net/register/join/" + sessionId :
                                                    "localhost:3000/register/join/" + sessionId}
                                            </span>
                                        </h3>
                                        <Tooltip title="Copy Join Link" placement="top">
                                            <FloatButton
                                                className='CopyJoinLinkButton'
                                                icon={<CopyOutlined />}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(process.env.NODE_ENV === 'production' ?
                                                        "https://stselab-games.azurewebsites.net/register/join/" + sessionId :
                                                        "localhost:3000/register/join/" + sessionId);
                                                    messageApi.open({
                                                        type: 'success',
                                                        content: 'Join Link Copied',
                                                    });
                                                }}
                                            >
                                                Copy Join Link
                                            </FloatButton>
                                        </Tooltip>
                                    </div>
                                    <p>
                                        The host controls when the tournament starts and each round ends. You will automatically move to the next screen
                                        as soon as the game begins. if you wish to exit the session you may click Exit Tournament
                                        below. You can also click the title in the header to exit the session and return to the 
                                        home page at any time.
                                        Share the join code or join link to help other players join the tournament.
                                    </p>
                                    <h2> Players in the Tournament: {players && players.length > 0 ? players.length : "..."} </h2>
                                    <h2>
                                        {
                                            // Show how many players have completed onboarding:
                                            completedOnboarding.length === players.length ?
                                            "All players have completed onboarding" 
                                            :
                                            `${completedOnboarding.length} players have completed onboarding`
                                        }
                                    </h2>
                                    <Button
                                        onClick={() => {
                                            setPlayerIdToRemove(playerId ? playerId : '');
                                            setRemoveModalTitle('Are you sure you want to exit the tournament?');
                                            setRemoveModalMessage('You will leave the tournament.');
                                            setShowRemoveModal(true);
                                        }}
                                    >
                                        Exit Tournament
                                    </Button>
                                </div>
                        }

                        <div className='ResultTable'>
                            <Table
                                pagination={{ 
                                    position: ['none', players.length > 10 ? 'bottomCenter' : "none"],
                                    showSizeChanger: true,
                                    defaultPageSize: 10,
                                }}
                                columns={columns}
                                dataSource={data}
                                rowKey={(record) => record.key ? record.key : 'row-key'}
                                rowClassName={(record, index) => {
                                    if (playerId && isHost && record.key && record.key.toLowerCase() !== playerId.toLowerCase()) {
                                        return 'Clickable';
                                    } else if (playerId && record.key?.toLowerCase() === playerId.toLowerCase()) {
                                        return 'MatchingPlayer';
                                    } else {
                                        return 'HighlightRow'
                                    }
                                }}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: event => {
                                            if (playerId && isHost && record.key && record.key.toLowerCase() !== playerId.toLowerCase()) {
                                                setPlayerIdToRemove(record.key);
                                                setRemoveModalTitle('Are you sure you want to remove: ' + record.name + '?');
                                                setRemoveModalMessage('The player will be removed from the Tournament including all of their information');
                                                setShowRemoveModal(true);
                                            }
                                        },
                                    }
                                }}
                            />
                        </div>
                        {
                            showRemoveModal &&
                            <VerificationModal
                                cancel={cancelRemoveModal}
                                confirm={confirmRemoveModal}
                                title={removeModalTitle}
                                message={removeModalMessage}
                            />
                        }
                        {
                            showBeginModal &&
                            <VerificationModal
                                cancel={() => setShowBeginModal(false)}
                                confirm={() => advanceSession(sessionId, setBeginningTournament)}
                                title={"Ready to Begin the Game?"}
                                message={"Are you sure you want to begin the game? Players will still be able to join using the join code at in the header at the top of your screen. However, they will jump to where you are in the game after completing the onboarding dice game."}
                            />
                        }
                        {
                            showJumpToMechanicalArmMission &&
                            <VerificationModal
                                cancel={() => setShowJumpToMechanicalArmMission(false)}
                                confirm={ async () => {
                                    const response = await postRequest("session/jumptoarmmission", JSON.stringify({ sessionId }));
                                    if (!response.success) {
                                        alert("Error  jumping to mechanical arm game, please try again.");
                                        console.error(response);
                                    }
                                }}
                                title={"Begin the Mechanical Arm Mission Game?"}
                                message={"This will skip the Golf Simulation game. Alternatively you can play the Golf Simulation first and the Mechanical Arm Mission game will be available at the end. Are you sure you want to begin the game? Players will still be able to join using the join code at in the header at the top of your screen. However, they will jump to where you are in the game after completing the onboarding dice game."}
                            />
                        }
                    </div>
            }
        </>)
}

export default WaitRoom;