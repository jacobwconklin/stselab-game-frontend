import { useContext, useState } from 'react';
import './RoundResults.scss';
import { UserContext } from '../../App';
import { Button } from 'antd';
import { postRequest } from '../../Utils/Api';
import GolfBall from '../../ReusableComponents/GolfBall';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { solverNames } from '../../Utils/Simulation';
// import golfBallSvg from '../../Assets/golfBall.svg';

// RoundResults
const RoundResults = (props: any) => {

    // const golfBallImage = new Image(20, 20); // WORKS and sets image to golf ball, but eliminates player colors 
    // golfBallImage.src = golfBallSvg;

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

    // chart options and data
    const options = {
        plugins: {
            title: {
                display: true,
                text: `Strokes and Costs for Round ${props?.round}`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Strokes'
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

    const data = {
        datasets: props?.players?.filter((result: any) => result.scores[props.round - 1]).map((result: any) => {
            return {
                label: result.name,
                data: [{
                    x: result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].cost,
                    y: result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots
                }],
                backgroundColor: result.color,
            }
        })
    };

    const {isHost, playerId, sessionId} = useContext(UserContext) as any;
    const [hostClickedButton, setHostClickedButton] = useState(false);

    const hostBeginNextRound = async () => {
        setHostClickedButton(true);
        const response = await postRequest("session/advance", JSON.stringify({sessionId}));
        if (response.success) {

        } else {
            alert("Error advancing round, please try again.")
            setHostClickedButton(false);
            console.error(response);
        }
    }
    // TODO set modal to make sure host knows some players might not finished and only show
    // if some player hasn't finished.

    return (
        <div className='RoundResults'>
            <h1>Results for Round {props?.round}</h1>
            {
                isHost && props?.round >= 4 &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Player
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length > 1 ? 's' : ''} Finished 
                    </h3>
                    {
                        !!props?.players?.filter((player: any) => !player.scores[props.round - 1]).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                        </h3>
                    }
                    <p>
                        As Host you may end the tournament. This will take all players to a screen to view the final results across all 
                        three rounds of the tournament whether players
                        have finished playing this round or not. You may also remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={hostClickedButton}
                        onClick={hostBeginNextRound}
                    >
                        End Tournament
                    </Button>
                </div>
            }
            {
                isHost && props?.round < 4 &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Player
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length > 1 ? 's' : ''} Finished 
                    </h3>
                    {
                        !!props?.players?.filter((player: any) => !player.scores[props.round - 1]).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                        </h3>
                    }
                    <p>
                        As Host you may advance to the next round. This will take all players to the game screen for the next round regardless of 
                        whether they have finished this round or not.
                        You may also remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={hostClickedButton}
                        onClick={hostBeginNextRound}
                    >
                        Begin Next Round
                    </Button>
                </div>
            }
            {
                !isHost &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Player
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length > 1 ? 's' : ''} Finished 
                    </h3>
                    {
                        !!props?.players?.filter((player: any) => !player.scores[props.round - 1]).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                        </h3>
                    }
                    <p>
                        {props?.round < 4 ? "Host must begin the next round" : "Host must end the tournament"}
                    </p>
                    {/* <Button
                        onClick={() => {alert("Dynamic sorting not implemented yet values automatically sorted by stroke")}}
                    >
                        Sort by Strokes
                    </Button> */}
                </div>
            }

            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            <Scatter className='ScatterCanvas' options={options} data={data} />

            <div className='ResultTable'>
                {
                    // TODO allow sort by stroke and cost
                    // TODO show solver type selected as well, 
                    // if on round 1 or 2, there is 1 solver,
                    // if on round 3 there are 2 solvers, 
                    // if on round 4 there are 3 solvers
                    props.players && props.players.length > 0 && 
                    <div className='GridHeader'>
                        <p>Rank</p>
                        <p>Name</p>
                        <p>Golf Ball</p>
                        <p>
                            Strokes
                        </p>
                        <p>
                            Cost
                        </p>
                        <p>
                            Solvers
                        </p>
                        {
                            // check round ...
                        }
                    </div>
                }
                {
                    // TODO may need to sort scores to ensure last score in array matches last round so add:
                    // .sort((a: any, b: any) => {a.round - b.round})
                    props.players && props.players.length > 0 && 
                    props.players.sort((a: any, b: any) => {
                        if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
                            // player a has finished b hasn't, put a in front of b
                            return -1;
                        } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
                            // player b has finished a hasn't, put b in front of a
                            return 1;
                        } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
                            // both players have finished, sort by shots
                            return a.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots - 
                                b.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots;
                        } else return 0;
                    }).map((result: any, index: number) => (
                        <div key={result.id} className={`UserResult 
                        ${isHost && result.id?.toLowerCase() !== playerId?.toLowerCase() ? 'Clickable' : ''}
                        ${result?.id?.toLowerCase() === playerId?.toLowerCase() ? 'MatchingPlayer' : ''}`}
                            onClick={() => {
                                if (isHost && result.id?.toLowerCase() !== playerId?.toLowerCase()) {
                                    // TODO tell backend to remove this player
                                    alert("remove not implemented yet")
                                    console.log(playerId, result.id);
                                }
                            }}
                        >
                            <p>{index + 1}</p>
                            <p>{result.name}</p>
                            <GolfBall color={result.color} />
                            <p>{result.scores[props.round - 1] ? result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots : 'Waiting'}</p>
                            <p>{result.scores[props.round - 1] ? result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].cost : 'Waiting'}</p>
                            <div className='SolversInResultTable'>
                            <p>
                                {result.scores[props.round - 1] ? 
                                solverNames[result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].solverOne - 1] : 'Waiting'}
                            </p>
                            <p>
                                {result.scores[props.round - 1] && props.round > 2 ? 
                                solverNames[result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].solverTwo - 1] : ''}
                            </p>
                            <p>
                                {result.scores[props.round - 1] && props.round > 3 ? 
                                solverNames[result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].solverThree - 1] : ''}
                            </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RoundResults;