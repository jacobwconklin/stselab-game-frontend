import { Button, Table } from 'antd';
import './SessionResults.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import { UserContext } from '../../App';
import GolfBall from '../../ReusableComponents/GolfBall';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { DisplayScore, FinalResult, Score, UserContextType } from '../../Utils/Types';
import { useReactToPrint } from 'react-to-print';
import { FullScreenConfetti } from '../../ReusableComponents/Confetti';
import { RoundNames } from '../../Utils/Utils';
import VerificationModal from '../../ReusableComponents/VerificationModal';
import { advanceSession } from '../../Utils/Api';
import DiceSelectGame from '../DiceSelectGame/DiceSelectGame';

// SessionResults
// Only show for tournament stage results (not professional only or h_arch)
const SessionResults = (props: { players: FinalResult[] }) => {

    
    // make user play dice onboarding game before they can join the session
    const [finishedDiceGame, setFinishedDiceGame] = useState(false);

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false)
    const [leaveTo, setLeaveTo] = useState('/');
    const navigate = useNavigate();

    const leavePage = () => {
        navigate(leaveTo);
    }

    const { playerId, isHost, sessionId } = useContext(UserContext) as UserContextType;

    const sumShots = (scores: Score[]) => {
        let total = 0;
        scores.forEach((score: Score) => {
            total += score.shots;
        });
        return total;
    }

    const sumCost = (scores: Score[]) => {
        let total = 0;
        scores.forEach((score: Score) => {
            total += score.cost;
        });
        return total / 100;
    }

    const sumScore = (scores: Score[]) => {
        let total = 0;
        scores.forEach((score: Score) => {
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
                text: `Shots and Costs of all Tournament Rounds`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Shots'
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
                // pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 20
        },
    };

    const shotsCostData = {
        datasets: props?.players?.map((result: FinalResult) => {
            return {
                label: result.name,
                data: result.scores.map((round: Score) => {
                    return {
                        x: round.cost / 100,
                        y: round.shots
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
                    text: 'Tournament Round'
                }
            },
        },
        elements: {
            point: {
                radius: 10,
                // pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 20
        },
    };

    const scoreRoundData = {
        datasets: props?.players?.map((result: FinalResult) => {
            return {
                label: result.name,
                data: result.scores.map((round: Score) => {
                    return {
                        x: round.round - RoundNames.TournamentStage1 + 1,
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
            sorter: (a: DisplayScore, b: DisplayScore) => {
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
            title: 'Golf Ball',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <GolfBall color={color} ></GolfBall>
        },
        {
            title: 'Total Shots',
            dataIndex: 'shots',
            key: 'shots',
            sorter: (a: DisplayScore, b: DisplayScore) => {
                const shotsA = Number(a.shots);
                const shotsB = Number(b.shots);
                if (isNaN(shotsA) && !isNaN(shotsB)) {
                    return 1;
                } else if (!isNaN(shotsA) && isNaN(shotsB)) {
                    return -1;
                } else if (isNaN(shotsA) && isNaN(shotsB)) {
                    return 0;
                } else {
                    return shotsA - shotsB;
                }
            }
        },
        {
            title: 'Total Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: DisplayScore, b: DisplayScore) => {
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

    const tableData = props?.players?.map((player: FinalResult, index: number) => (
        {
            key: player.id,
            name: player.name,
            color: player.color,
            shots: sumShots(player.scores),
            cost: sumCost(player.scores).toFixed(2),
            score: sumScore(player.scores).toFixed(2),
        }
    ));

    const getPlacement = () => {
        let sortedPlayers = props.players.sort((a: FinalResult, b: FinalResult) => {
            return sumScore(b.scores) - sumScore(a.scores);
        });

        for (let i = 0; i < sortedPlayers.length; i++) {
            if (playerId && sortedPlayers[i].id.toLowerCase() === playerId.toLowerCase()) {
                if (i === 0) {
                    return "Congratulations! You came in 1st place!"
                } else if (i === 1) {
                    return "You came in " + (i + 1) + "nd place!";
                } else if (i === 2) {
                    return "You came in " + (i + 1) + "rd place!";
                } else if (i === 3) {
                    return "You came in " + (i + 1) + "th place!";
                }
            }
        }

        return "You came in 4th place!";
    }

    const [isPrinting, setIsPrinting] = useState(false);
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Print Final Tournament Results",
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
            if (canvas.role === 'img') {
                const link = document.createElement('a');
                link.download = 'STSELab-Tournament-Results.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        });
    }

    return (
        <>
            {
                !finishedDiceGame ?
                    <DiceSelectGame isOnboarding={false} finished={() => setFinishedDiceGame(true)} />
                    :
                    <div className='SessionResults' ref={contentToPrint}>
                        {
                            !isPrinting &&
                            <div className='StaticBackground'>
                                <div className='StaticBackgroundImages'></div>
                            </div>
                        }
                        <div className='Instructions'>
                            <h1>Tournament Results </h1>
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
                                pagination={isPrinting ? { pageSize: props.players.length, position: ['none', 'none'] } :
                                    { pageSize: 5, position: ['none', props.players.length > 5 ? 'bottomCenter' : "none"] }}
                                columns={tableColumns}
                                dataSource={tableData}
                                rowKey={(record) => record.key}
                                rowClassName={(record, index) => {
                                    if (playerId && record.key.toLowerCase() === playerId.toLowerCase()) {
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

                        <br></br>
                        <br></br>
                        <br></br>

                        {/* <div className='Instructions'>
                    <h1>Play Mechanical Arm Mission</h1>
                    <p>--- still under development ---</p>
                    {
                        isHost ?
                        <Button
                            disabled={!!hostClickedButton}
                            onClick={(() => {
                                advanceSession(sessionId, setHostClickedButton)
                            })}
                        >
                            Play Mission
                        </Button>
                        :
                        <p>Host must begin the game</p>
                    }
            </div> */}

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
            }
        </>
    )
}

export default SessionResults;