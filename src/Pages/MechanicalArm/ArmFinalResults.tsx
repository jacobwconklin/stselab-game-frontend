import { Button, Table } from "antd";
import { Scatter } from "react-chartjs-2";
import { FullScreenConfetti } from "../../ReusableComponents/Confetti";
import VerificationModal from "../../ReusableComponents/VerificationModal";
import { ArmFinalResult, ArmScore, UserContextType } from "../../Utils/Types";
import './ArmFinalResults.scss';
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { UserContext } from "../../App";
import { getDisplayRound, ordinal_suffix } from "../../Utils/Utils";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';


const ArmFinalResults = (props: {
    results: ArmFinalResult[];
}) => {

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [leaveTo, setLeaveTo] = useState('/');
    const navigate = useNavigate();

    const leavePage = () => {
        navigate(leaveTo);
    }

    const { playerId } = useContext(UserContext) as UserContextType;

    const sumWeights = (scores: ArmScore[]) => {
        let total = 0;
        scores.forEach((score: ArmScore) => {
            total += score.weight;
        });
        return total;
    }

    const sumCost = (scores: ArmScore[]) => {
        let total = 0;
        scores.forEach((score: ArmScore) => {
            total += score.cost;
        });
        return total / 100;
    }

    const sumScore = (scores: ArmScore[]) => {
        let total = 0;
        scores.forEach((score: ArmScore) => {
            total += score.score;
        });
        return total / 100;
    }

    // chart options and data
    // for all rounds separately
    // chart options and data
    const shotsCostOptions = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Weights and Costs of all Mission Rounds`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Weights'
                }
            },
            x: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Cost'
                }
            },
        },
        elements: {
            point: {
                radius: 10,
            }
        },
        layout: {
            padding: 20
        },
    };

    const shotsCostData = {
        datasets: props?.results?.map((result: ArmFinalResult) => {
            return {
                label: result.name,
                data: result.scores.map((round: ArmScore) => {
                    return {
                        x: round.cost / 100,
                        y: round.weight
                    }
                }),
                backgroundColor: result.color,
            }
        })
    };

    // chart options and data
    // for all rounds separately
    // chart options and data
    const scoreRoundOptions = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Score per Player by Round`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            },
            x: {
                beginAtZero: true,
                max: 5,
                title: {
                    display: true,
                    text: 'Mission Round'
                }
            },
        },
        elements: {
            point: {
                radius: 10,
            }
        },
        layout: {
            padding: 20
        },
    };

    const scoreRoundData = {
        datasets: props?.results?.map((result: ArmFinalResult) => {
            return {
                label: result.name,
                data: result.scores.map((round: ArmScore) => {
                    return {
                        x: getDisplayRound(round.round),
                        y: round.score / 100
                    }
                }),
                backgroundColor: result.color,
            }
        })
    };

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

    // table columns and data
    const tableColumns = [
        {
            title: 'Total Score',
            dataIndex: 'score',
            key: 'score',
            defaultSortOrder: 'descend' as any,
            sorter: (a: ArmScore, b: ArmScore) => {
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
        // {
        //     title: 'Golf Ball',
        //     dataIndex: 'color',
        //     key: 'color',
        //     render: (color: string) => <GolfBall color={color} ></GolfBall>
        // },
        {
            title: 'Total Weights',
            dataIndex: 'weights',
            key: 'weights',
            sorter: (a: ArmScore, b: ArmScore) => {
                const weightA = Number(a.weight);
                const weightB = Number(b.weight);
                if (isNaN(weightA) && !isNaN(weightB)) {
                    return 1;
                } else if (!isNaN(weightA) && isNaN(weightB)) {
                    return -1;
                } else if (isNaN(weightA) && isNaN(weightB)) {
                    return 0;
                } else {
                    return weightA - weightB;
                }
            }
        },
        {
            title: 'Total Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: ArmScore, b: ArmScore) => {
                const costA = Number(a.cost);
                const costB = Number(b.cost);
                if (isNaN(costA) && !isNaN(costB)) {
                    return 1;
                } else if (!isNaN(costA) && isNaN(costB)) {
                    return -1;
                } else if (isNaN(costA) && isNaN(costB)) {
                    return 0;
                } else {
                    return costA - costB;
                }
            }
        },
    ];

    const tableData: any[] = props?.results?.map((player: ArmFinalResult, index: number) => (
        {
            key: player.id,
            name: player.name,
            color: player.color,
            weights: sumWeights(player.scores),
            cost: sumCost(player.scores).toFixed(2),
            score: sumScore(player.scores).toFixed(2),
        }
    ));

    const getPlacement = () => {
        let sortedPlayers = props.results.sort((a: ArmFinalResult, b: ArmFinalResult) => {
            return sumScore(b.scores) - sumScore(a.scores);
        });

        for (let i = 0; i < sortedPlayers.length; i++) {
            if (playerId && sortedPlayers[i].id.toLowerCase() === playerId.toLowerCase()) {
                if (i === 0) {
                    return "Congratulations! You came in 1st place!"
                } else {
                    return "You came in " + ordinal_suffix(i + 1) + " place!"
                }
            }
        }

        return "Mission Complete!";
    }

    const [isPrinting, setIsPrinting] = useState(false);
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Print Final Mission Results",
        onBeforeGetContent(): Promise<void> {
            return new Promise<void>((resolve) => {
                setIsPrinting(true);
                resolve();
            });
        },
        onAfterPrint: () => setIsPrinting(false),
        removeAfterPrint: true,
    });

    const saveGraphs = () => {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach((canvas: any) => {
            console.log(canvas);
            if (canvas.role === 'img') {
                console.log("seen");
                const link = document.createElement('a');
                link.download = 'STSELab-Mechanical-Mission-Results.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });
    }


    return (
        <div className="ArmFinalResults" ref={contentToPrint}>
            <div className='Instructions'>
                <h1>Final Results of the Mechanical Arm Mission:</h1>
                <h2>{getPlacement()}</h2>
                <div className='EndTournamentButtons'>
                    <Button onClick={() => {
                        setLeaveTo('/');
                        setShowVerificationModal(true);
                    }}>Return Home</Button>
                    <Button onClick={() => {
                        setLeaveTo('/results');
                        setShowVerificationModal(true);
                    }}>View Historical Results</Button>
                    <Button onClick={() => handlePrint(null, () => contentToPrint.current)}>Save Results</Button>
                    <Button onClick={() => saveGraphs()}>Save Graphs</Button>
                </div>
            </div>

            <br></br>

            <div className='ResultTable'>
                <Table
                    pagination={isPrinting ? { pageSize: props.results.length, position: ['none', 'none'] } :
                        { pageSize: 5, position: ['none', props.results.length > 5 ? 'bottomCenter' : "none"] }}
                    columns={tableColumns}
                    dataSource={tableData}
                    rowKey={(record) => record.key ? record.key : record.score}
                    rowClassName={(record, index) => {
                        if (playerId && record.key && record.key.toLowerCase() === playerId.toLowerCase()) {
                            return 'MatchingPlayer';
                        } else {
                            return 'HighlightRow'
                        }
                    }}
                />
            </div>

            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            {
                !isPrinting &&
                <Scatter className='ScatterCanvas' options={shotsCostOptions} data={shotsCostData} />
            }
            {
                !isPrinting &&
                <Scatter className='ScatterCanvas' options={scoreRoundOptions} data={scoreRoundData} />
            }
            <br></br>
            <FullScreenConfetti />
            {
                showVerificationModal &&
                <VerificationModal
                    title="Are you sure you want to leave?"
                    message="Once you leave the session results page you can't come back."
                    confirm={() => leavePage()}
                    cancel={() => setShowVerificationModal(false)}
                />
            }
        </div>
    )
}

export default ArmFinalResults;