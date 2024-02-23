import { Table } from "antd";
import GolfBall from "../../../ReusableComponents/GolfBall";
import { Solver, solverNames } from "../../../Utils/Simulation";
import { RoundResult } from "../../../Utils/Types";
import { getArchitectureCommonName } from "../../../Utils/Utils";
import { UserContext } from "../../../App";
import { useContext, useState } from "react";
import { postRequest } from "../../../Utils/Api";
import VerificationModal from "../../../ReusableComponents/VerificationModal";


// Creates a table to display results for a round or session
const ResultTable = (props: { players: Array<RoundResult>, round: number }) => {

    const { isHost, playerId } = useContext(UserContext) as any;

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
            defaultSortOrder: props.round < 6 ? 'ascend' as any : null,
            sorter: (a: any, b: any) => {
                if (a.shots === '...' && !(b.shots === '...')) {
                    return 1;
                } else if (!(a.shots === '...') && b.shots === '...') {
                    return -1;
                } else if (a.shots === '...' && b.shots === '...') {
                    return 0;
                } else {
                    return a.shots - b.shots
                }
            }
        },
        {
            title: 'Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: any, b: any) => {
                if (a.cost === '...' && !(b.cost === '...')) {
                    return 1;
                } else if (!(a.cost === '...') && b.cost === '...') {
                    return -1;
                } else if (a.cost === '...' && b.cost === '...') {
                    return 0;
                } else {
                    return a.cost - b.cost
                }
            }
        },
        {
            title: 'Solvers',
            key: 'solvers',
            dataIndex: 'solvers',
            render: (solvers: [Solver]) => (
                solvers.length > 0 ?
                    <div className="SolversHolder">
                        {
                            solvers.map((solver) => (
                                <p
                                    style={{ margin: '0px 0px 4px 0px' }}
                                >{solverNames[solver - 1]}</p>
                            ))
                        }
                    </div>
                    :
                    <div>
                        waiting ...
                    </div>
            ),
        },
    ];

    const getExtendedColumns = () => {
        return baseColumns.concat([
            {
                title: 'Architecture',
                dataIndex: 'architecture',
                key: 'architecture',
            },
            {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                defaultSortOrder: 'descend' as any,
                sorter: (a: any, b: any) => {
                    if (a.score === '...' && !(b.score === '...')) {
                        return -1;
                    } else if (!(a.score === '...') && b.score === '...') {
                        return 1;
                    } else if (a.score === '...' && b.score === '...') {
                        return 0;
                    } else {
                        return a.score - b.score
                    }
                }
            }
        ])
    }

    /*
    Example
    [
      {
          key: '1',
          name: 'John Brown',
          color: '#123456',
          shots: 32,
          cost: 100,
          solvers: [Solver.Professional, Solver.Specialist],
          architecture: 'Long and Putt'
      },
    ];
    */
    const getBaseData = () => {
        return props?.players?.map((player, index) => (
            {
                key: player.id,
                name: player.name,
                color: player.color,
                shots: player.shots ? player.shots : '...',
                cost: player.cost ? player.cost / 100 : '...',
                solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver)
            }
        ))
    }

    const getExtendedData = () => {
        return props?.players?.map((player, index) => (
            {
                key: player.id,
                name: player.name,
                color: player.color,
                shots: player.shots ? player.shots : '...',
                cost: player.cost ? player.cost / 100 : '...',
                solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver),
                architecture: player.architecture ? getArchitectureCommonName(player.architecture) : 'waiting...',
                score: player.score ? player.score / 100 : '...'
            }
        ))
    }

    return (
        <div className="ResultTable">
            <Table
                pagination={{ pageSize: 10, position: ['none', props.players.length > 10 ? 'bottomCenter' : "none"] }}
                columns={props.round < 6 ? baseColumns : getExtendedColumns()}
                dataSource={props.round < 6 ? getBaseData() : getExtendedData()}
                rowClassName={(record, index) => {
                    if (isHost && record.key.toLowerCase() !== playerId.toLowerCase()) {
                        return 'Clickable';
                    } else if (record.key.toLowerCase() === playerId.toLowerCase()) {
                        return 'MatchingPlayer';
                    } else {
                        return 'HighlightRow'
                    }
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            if (isHost && record.key.toLowerCase() !== playerId.toLowerCase()) {
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