import './AmateurOnly.scss';
import { Solver, runSimEntireHole } from '../../../Utils/Simulation';
import { Button } from 'antd';
// import { AmateurSolverCard } from '../../../ReusableComponents/SolverCards';
import { useContext, useState } from 'react';
import { UserContext } from '../../../App';
import { advanceSession } from '../../../Utils/Api';
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
import golfBallSvg from '../../../Assets/golfBall.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';
import { animateBallIntoHole } from '../../../Utils/Utils';
import { UserContextType } from '../../../Utils/Types';
import VerificationModal from '../../../ReusableComponents/VerificationModal';

// AmateurOnly
// Have players play on h_arch with only one amateur as many time as they would like to learn
// how bad one amateur is
const AmateurOnly = (props: { round: Number }) => {


    const [allResults, setAllResults] = useState<{ shots: number, cost: number }[]>([]);
    const [showAmateurResults, setShowAmateurResults] = useState(false);
    // Allows immediately showing user their shot and distance results of the last round played
    const [latestShot, setLatestShot] = useState<number | null>(null);
    const [latestCost, setLatestCost] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const { isHost, sessionId } = useContext(UserContext) as UserContextType;
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);
    const [showModal, setShowModal] = useState(false);

    const playAmateurRound = async () => {
        try {
            const score = await runSimEntireHole(Solver.Amateur, 1);
            setLatestShot(score.shots);
            setLatestCost(score.cost);
            setAllResults([...allResults, score]);
            setLoading(false);
            const ball = document.getElementById("player-ball");
            if (ball) {
                ball.style.transition = "none";
                ball.style.left = (0.1 * window.innerWidth - 16) + 'px';
                ball.style.bottom = "62px";
                ball.style.transform = "rotate(0deg)";
                ball.style.opacity = "0.99";
            }
        } catch (error) {
            setLoading(false);
            console.error("Error playing amateur only round: ", error);
        }
    }

    // graph information
    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


    const golfBallImage = new Image(20, 20); // WORKS and sets image to golf ball, but eliminates player colors 
    golfBallImage.src = golfBallSvg;
    // chart options and data
    const options = {
        plugins: {
            title: {
                display: true,
                text: `Shots and Costs for Amateurs`,
                font: {
                    size: 18
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Shots',
                    font: {
                        weight: "bold" as any,
                        size: 14,
                    }
                },  
                ticks: {
                    font: {
                        size: 14,
                        weight: "bold" as any
                    }
                }
            },
            x: {
                beginAtZero: true,
                max: 2,
                title: {
                    display: true,
                    text: 'Cost',
                    font: {
                        weight: "bold" as any,
                        size: 14,
                    }
                },  
                ticks: {
                    font: {
                        size: 14,
                        weight: "bold" as any
                    }
                }
            },
        },
        elements: {
            point: {
                radius: 10,
                pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 10
        },
    };

    const data = {
        datasets: allResults.map((result: {cost: number, shots: number}, index: number) => {
            return {
                label: "Amateur #" + (index + 1),
                data: [{
                    x: result.cost,
                    y: result.shots
                }],
                backgroundColor: "#000000",
            }
        })
    };

    const avgShots = () => {
        let total = 0;
        allResults.forEach(result => {
            total += result.shots;
        });
        return (total / allResults.length).toFixed(2);
    }

    const highestShots = () => {
        let highest = allResults[0].shots;
        allResults.forEach(result => {
            if (result.shots > highest) {
                highest = result.shots;
            }
        });
        return highest;
    }

    const lowestShots = () => {
        let lowest = allResults[0].shots;
        allResults.forEach(result => {
            if (result.shots < lowest) {
                lowest = result.shots;
            }
        });
        return lowest;
    }


    return (
        <div className='AmateurOnly'>
            {
                showAmateurResults ?
                    <div className='AmateurResults'>
                        <div className='StaticBackground'><div className='StaticBackgroundImages'></div></div>
                        <div className='AmateurResultInfo'>
                            <h2>Results of Individual Amateurs</h2>
                            {
                                isHost ?
                                    <p>As host you must begin the next round for everyone when ready.</p>
                                    :
                                    <p>Host must begin the next round.</p>
                            }
                            <p>Highest number of shots: {highestShots()} </p>
                            <p>Average number of shots: {avgShots()} </p>
                            <p>Lowest number of shots: {lowestShots()} </p>
                            <div className='ResultButtons'>
                                <Button onClick={() => setShowAmateurResults(false)}>Return to simulation</Button>
                                {
                                    isHost &&
                                    <Button
                                        className='BeginNextRoundButton'
                                        disabled={!!hostClickedButton}
                                        onClick={() => setShowModal(true)}
                                        type='primary'
                                    >Begin Next Round</Button>
                                    // TODO warn host that this will advance everyone
                                }
                            </div>
                        </div>
                        {/* Table */}
                        <div className='AmateurResultGraph'>
                            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
                            <Scatter className='ScatterCanvas' options={options} data={data} />
                        </div>
                    </div>
                    :
                    <div className='Controls'>
                        <div className='Instructions'>
                            <h1> Practice Round 2: One Amateur</h1>
                            <div className='InformationHorizontalSplit'>

                                <div className='InfoContainer'>
                                    <p>
                                        In this round all players must use only one Amateur golfer to play all 5 holes. Here you will explore the "skills" of an individual Amateur.
                                    </p>
                                    <p>
                                        You may run this simulation as many times as you would like. You can see all of the outcomes by clicking view results.{isHost ? " As host you must begin the next round from the view results page." : " The host must begin the next round."} 
                                    </p>
                                    <p>
                                        Please note that, when Amateurs are engaged, they are usually engaged in large numbers in a crowdsourcing format, and only their “best” response is used. Here the goal is to visualize the variability in individual performances.
                                    </p>
                                    {
                                        loading &&
                                        <p>Amateur is playing ... </p>
                                    }
                                    {
                                        latestShot !== null && latestCost !== null && !loading &&
                                        <p>
                                            The Amateur took {latestShot} shots and cost {latestCost} units to complete 5 holes.
                                        </p>
                                    }
                                </div>
                                <img className='SingleIcon' src={amateurIcon} alt="Amateur Solver Icon" />
                                <div></div>
                            </div>
                            <div className='InfoButtonContainer'>
                                <Button
                                    onClick={() => {
                                        setLoading(true);
                                        animateBallIntoHole(playAmateurRound)
                                    }}
                                    disabled={loading}
                                >
                                    Play Round
                                </Button>
                                <Button
                                    onClick={() => setShowAmateurResults(true)}
                                    disabled={allResults.length === 0}
                                >
                                    View Results
                                </Button>
                            </div>
                        </div>
                    </div>
            }
            {
                showModal &&
                <VerificationModal
                    title="Continue to the Next Round?"
                    message="This will advance all players to the next round. You will not be able to return to this round."
                    confirm={() => advanceSession(sessionId, setHostClickedButton)}
                    cancel={() => setShowModal(false)}
                />
            }
        </div>
    )
}

export default AmateurOnly;