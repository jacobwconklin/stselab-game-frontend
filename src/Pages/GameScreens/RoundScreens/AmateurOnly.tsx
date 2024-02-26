import './AmateurOnly.scss';
import { Solver, runSimEntireHole } from '../../../Utils/Simulation';
import { Button } from 'antd';
import { AmateurSolverCard } from '../../../ReusableComponents/SolverCards';
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
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import golfBallSvg from '../../../Assets/golfBall.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';

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

    const { isHost, sessionId } = useContext(UserContext) as any;
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);

    const playAmateurRound = async () => {
        try {
            setLoading(true);
            const score = await runSimEntireHole(Solver.Amateur, 1);
            setLatestShot(score.shots);
            setLatestCost(score.cost);
            setAllResults([...allResults, score]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error playing amateur only round: ", error);
        }
    }

    // graph information
    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


    const golfBallImage = new Image(20, 20); // WORKS and sets image to golf ball, but eliminates player colors 
    golfBallImage.src = golfBallSvg;
    // chart options and data
    const options = {
        plugins: {
            title: {
                display: true,
                text: `Shots and Costs for Amateurs`
            }
        },
        scales: {
            y: {
                reverse: true,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
            x: {
                beginAtZero: true,
                max: 2,
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
                pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 10
        },
    };

    const data = {
        datasets: allResults.map((result: any, index: number) => {
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


    return (
        <div className='AmateurOnly'>
            {
                showAmateurResults ?
                    <div className='AmateurResults'>
                        <div className='AmateurResultInfo'>
                            <h2>Results of Individual Amateurs</h2>
                            {
                                isHost ?
                                    <p>As host you must begin the next round for everyone when ready.</p>
                                    :
                                    <p>Host must begin the next round.</p>
                            }
                            <p>Average number of shots: {avgShots()} </p>
                            <div className='ResultButtons'>
                                <Button onClick={() => setShowAmateurResults(false)}>Return to simulation</Button>
                                {
                                    isHost &&
                                    <Button
                                        className='BeginNextRoundButton'
                                        disabled={!!hostClickedButton}
                                        onClick={() => advanceSession(sessionId, setHostClickedButton)}
                                        type='primary'
                                    >Begin Next Round</Button>
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
                            <h1> Practice Round 2</h1>
                            <div className='InformationHorizontalSplit'>

                                <div className='InfoContainer'>
                                    <p>
                                        In this round all players must use only one Amateur golfer to play all 5 holes. This is the only time a single Amateur will be an options, everywhere else 25 Amateurs will be used and the best result out of all of them will be taken. Here you will learn the "skills" of an individual Amateur.
                                    </p>
                                    <p>You may run this simulation as many times as you would like. You can see all of the outcomes by clicking view results.{isHost ? " As host you must begin the next round from the view results page." : ""} </p>
                                    <h2>Amateur Golfer Selected</h2>
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
                                    onClick={() => playAmateurRound()}
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
                        <div className='Solvers'>
                            <AmateurSolverCard select={undefined} onlyOne={true} />
                        </div>
                    </div>
            }
        </div>
    )
}

export default AmateurOnly;