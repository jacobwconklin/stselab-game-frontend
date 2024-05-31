import { Table } from "antd";
import GolfBall from "../../../ReusableComponents/GolfBall";
import { Solver, solverNames } from "../../../Utils/Simulation";
import { DisplayRoundResult, RoundResult, UserContextType } from "../../../Utils/Types";
import { RoundNames, getArchitectureCommonName, tournamentStage2MaximumShots } from "../../../Utils/Utils";
import { UserContext } from "../../../App";
import { useContext, useState } from "react";
import { postRequest } from "../../../Utils/Api";
import VerificationModal from "../../../ReusableComponents/VerificationModal";


// Creates a table to display results for a round or session
const ResultTable = (props: { players: Array<RoundResult>, round: number }) => {

    const { isHost, playerId } = useContext(UserContext) as UserContextType;

    // tells backend to remove a player from their session
    const removePlayer = async (playerId: string) => {
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

    // Want name, golf ball, shots, cost, solvers, architecture
    const baseColumns = [
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
            title: 'Shots',
            dataIndex: 'shots',
            key: 'shots',
            defaultSortOrder: props.round < RoundNames.TournamentStage1 ? 'descend' as any : null,
            sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                const shotsA = Number(a.shots);
                const shotsB = Number(b.shots);
                if (isNaN(shotsA) && !isNaN(shotsB)) {
                    return -1;
                } else if (!isNaN(shotsA) && isNaN(shotsB)) {
                    return 1;
                } else if (isNaN(shotsA) && isNaN(shotsB)) {
                    return 0;
                } else {
                    return shotsB - shotsA;
                }
            },
            render: (shots: any) => {
                if (props.round === RoundNames.TournamentStage2 && !isNaN(shots) && shots > tournamentStage2MaximumShots) {
                    // if shots are over the maximum acceptable shots for round 7, add message
                    return (
                        <div className="ShotOverThreshold">
                            <p>{shots}</p>
                            <p style={{ color: 'red' }}>Over Limit</p>
                        </div>
                    )
                } else {
                    return shots;
                }
            }
        },
        {
            title: 'Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                const costA = Number(a.cost);
                const costB = Number(b.cost);
                if (isNaN(costA) && !isNaN(costB)) {
                    return -1;
                } else if (!isNaN(costA) && isNaN(costB)) {
                    return 1;
                } else if (isNaN(costA) && isNaN(costB)) {
                    return 0;
                } else {
                    return costB - costA;
                }
            }
        },
        {
            title: 'Solvers',
            key: 'solvers',
            dataIndex: 'solvers',
            render: (solvers: [Solver]) => {
                console.log(solvers);
                return (
                solvers.length > 0 ?
                    <div className="SolversHolder">
                        {
                            solvers.map((solver, index) => (
                                <p
                                    key={index}
                                    style={{ margin: '0px 0px 4px 0px' }}
                                >{solverNames[solver - 1]}</p>
                            ))
                        }
                    </div>
                    :
                    <div>
                        waiting ...
                    </div>
            )}
        },
    ];

    const getExtendedColumns = () => {
        const scorePrefix: any = [
            {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                defaultSortOrder: 'descend' as any,
                sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                    const scoreA = Number(a.score ? a.score.score : '');
                    const scoreB = Number(b.score ? b.score.score : '');
                    if (isNaN(scoreA) && !isNaN(scoreB)) {
                        return -1;
                    } else if (!isNaN(scoreA) && isNaN(scoreB)) {
                        return 1;
                    } else if (isNaN(scoreA) && isNaN(scoreB)) {
                        return 0;
                    } else {
                        return scoreA - scoreB;
                    }
                },
                render: (result: {score: number, customPerformanceWeight: number | undefined}) => {
                    if (props.round === RoundNames.TournamentStage4 && result.customPerformanceWeight) {
                        // if shots are over the maximum acceptable shots for round 7, add message
                        return (
                            <div className="ScoreWithCustomWeight">
                                <p>{result.score}</p>
                                <p>{result.customPerformanceWeight}% Shots</p>
                                <p>{100 - result.customPerformanceWeight}% Cost</p>
                            </div>
                        )
                    } else {
                        return result.score;
                    }
                }
            }
        ]
        const baseAndArchitectureSuffix = baseColumns.concat([
            {
                title: 'Architecture',
                dataIndex: 'architecture',
                key: 'architecture',
            }
        ]);
        // TO remove score columns from tournament rounds do this:
        // if (props.round === RoundNames.TournamentStage1 || props.round === RoundNames.TournamentStage2) {
        //     return baseAndArchitectureSuffix;
        // }
        return scorePrefix.concat(baseAndArchitectureSuffix);
    }

    const getBaseData: () => DisplayRoundResult[] = () => {
        return props?.players?.map((player, index) => (
            {
                key: player.id,
                name: player.name,
                color: player.color,
                shots: player.shots ? player.shots : '...',
                cost: player.cost ? (player.cost / 100).toFixed(2) : '...',
                solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver)
            }
        ))
    }

    const getExtendedData: () => DisplayRoundResult[] = () => {
        return props?.players?.map((player, index) => (
            {
                key: player.id,
                score: player.score ? {score: (player.score / 100).toFixed(2), customPerformanceWeight: player.customPerformanceWeight} 
                    : {score: '...', customPerformanceWeight: undefined},
                name: player.name,
                color: player.color,
                shots: player.shots ? player.shots : '...',
                cost: player.cost ? (player.cost / 100).toFixed(2) : '...',
                solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver),
                architecture: player.architecture ? getArchitectureCommonName(player.architecture) : 'waiting...',
            }
        ))
    }

    return (
        <div className="ResultTable">
            <Table
                pagination={{ 
                    position: ['none', props.players.length > 10 ? 'bottomCenter' : "none"],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                }}
                columns={props.round < RoundNames.TournamentStage1 ? baseColumns : getExtendedColumns()}
                dataSource={props.round < RoundNames.TournamentStage1 ? getBaseData() : getExtendedData()}
                rowKey={(record) => record.key}
                rowClassName={(record, index) => {
                    if (playerId && isHost && record.key.toLowerCase() !== playerId.toLowerCase()) {
                        return 'Clickable';
                    } else if (playerId && record.key.toLowerCase() === playerId.toLowerCase()) {
                        return 'MatchingPlayer';
                    } else {
                        return 'HighlightRow'
                    }
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            if (playerId && isHost && record.key.toLowerCase() !== playerId.toLowerCase()) {
                                setPlayerIdToRemove(record.key);
                                setModalTitle('Are you sure you want to remove: ' + record.name + '?');
                                setModalMessage('The player will be removed from the Tournament including all of their information');
                                setShowModal(true);
                            }
                        },
                    }
                }}
            />
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

export default ResultTable;