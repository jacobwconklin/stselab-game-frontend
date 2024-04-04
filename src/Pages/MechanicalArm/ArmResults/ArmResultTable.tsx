import { Table } from "antd";
import { ArmRoundResult, UserContextType } from "../../../Utils/Types";
import { UserContext } from "../../../App";
import { useContext, useState } from "react";
import { postRequest } from "../../../Utils/Api";
import VerificationModal from "../../../ReusableComponents/VerificationModal";
import { ArmSolver, armArchitectures, armSolverNames } from "../../../Utils/ArmSimulation";
import MechanicalArmIcon from "../../../ReusableComponents/MechanicalArmIcon";


// Creates a table to display results for a round or session
const ArmResultTable = (props: { 
    round: number,
    results: Array<ArmRoundResult>,  
}) => {

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

    // Want name, score, weight, cost, components (from architecture), solvers 
    // TODO May add mechanical arm colored icon like golf ball ... 
    const columns = [
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            defaultSortOrder: 'descend' as any,
            sorter: (a: ArmRoundResult, b: ArmRoundResult) => {
                const scoreA = Number(a.score);
                const scoreB = Number(b.score);
                if (isNaN(scoreA) && !isNaN(scoreB)) {
                    return -1;
                } else if (!isNaN(scoreA) && isNaN(scoreB)) {
                    return 1;
                } else if (isNaN(scoreA) && isNaN(scoreB)) {
                    return 0;
                } else {
                    return scoreA - scoreB;
                }
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Arm',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <MechanicalArmIcon color={color} ></MechanicalArmIcon>
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            sorter: (a: ArmRoundResult, b: ArmRoundResult) => {
                const weightA = Number(a.weight);
                const weightB = Number(b.weight);
                if (isNaN(weightA) || isNaN(weightB)) {
                    return 0;
                }else if (!isNaN(weightA) && isNaN(weightB)) {
                    return 1;
                } else if (isNaN(weightA) && !isNaN(weightB)) {
                    return -1;
                }
                return weightA - weightB;
            }
        },
        {
            title: 'Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: ArmRoundResult, b: ArmRoundResult) => {
                const costA = Number(a.cost);
                const costB = Number(b.cost);
                if (isNaN(costA) || isNaN(costB)) {
                    return 0;
                } else if (!isNaN(costA) && isNaN(costB)) {
                    return 1;
                } else if (isNaN(costA) && !isNaN(costB)) {
                    return -1;
                }
                return costA - costB;
            }
        },
        {
            title: 'Components',
            key: 'architecture',
            dataIndex: 'architecture',
            render: (architecture: string) => (
                !!armArchitectures.find(architectureDef => architectureDef.architecture === architecture) ?
                    <div className="SolversHolder">
                        {
                            armArchitectures.find(architectureDef => architectureDef.architecture === architecture)!
                            .components.map((componentDef, index) => (
                                <p
                                    key={index}
                                    style={{ margin: '0px 0px 4px 0px' }}
                                >
                                    {componentDef.component}
                                </p>
                            ))
                        }
                    </div>
                    :
                    <div>
                        waiting ...
                    </div>
            ),
        },
        {
            title: 'Solvers',
            key: 'solvers',
            dataIndex: 'solvers',
            render: (solvers: [ArmSolver]) => (
                solvers.length > 0 ?
                    <div className="SolversHolder">
                        {
                            solvers.map((solver, index) => (
                                <p
                                    key={index}
                                    style={{ margin: '0px 0px 4px 0px' }}
                                >{armSolverNames[solver - 1]}</p>
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

    const getData: () => ArmRoundResult[] = () => {
        return props?.results?.map((player, index) => (
            {
                id: player.id,
                name: player.name,
                color: player.color,
                score: player.score,
                weight: player.weight,
                cost: player.cost,
                architecture: player.architecture,
                solvers: [player.solverOne, player.solverTwo, player.solverThree, player.solverFour].filter((solver) => !!solver),
                // Here for type compliance
                solverOne: player.solverOne,
                round: 0
            }
        ))
    }

    return (
        <div className="ResultTable">
            <Table
                pagination={{ pageSize: 5, position: ['none', props.results.length > 5 ? 'bottomCenter' : "none"] }}
                columns={columns}
                dataSource={getData()}
                rowKey={(record) => record.id}
                rowClassName={(record, index) => {
                    if (playerId && isHost && record.id.toLowerCase() !== playerId.toLowerCase()) {
                        return 'Clickable';
                    } else if (playerId && record.id.toLowerCase() === playerId.toLowerCase()) {
                        return 'MatchingPlayer';
                    } else {
                        return 'HighlightRow'
                    }
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            if (playerId && isHost && record.id.toLowerCase() !== playerId.toLowerCase()) {
                                setPlayerIdToRemove(record.id);
                                setModalTitle('Are you sure you want to remove: ' + record.name + '?');
                                setModalMessage('The player will be removed from the Mission including all of their information');
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

export default ArmResultTable;