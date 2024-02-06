import { Button } from 'antd';
import './SessionResults.scss';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../App';
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

// SessionResults
const SessionResults = (props: any) => {

        // chart options and data
        // for all rounds separately
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

        // .filter((result: any) => {
        //     return result.scores.length > 0;
        // })
    
        const data = {
            datasets: props?.players?.map((result: any) => {
                console.log("mapped result: ", result);
                return {
                    label: result.name + ' Round ' + result.round,
                    data: result.scores.map((round: any) => { return {
                        x: round.cost,
                        y: round.shots
                    }}),
                    backgroundColor: result.color,
                }
            })
        };
    
    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

    const navigate = useNavigate();
    const { playerId } = useContext(UserContext) as any;

    const sumShots = (scores: any[]) => {
        let total = 0;
        scores.forEach((score: any) => {
            total += score.shots;
        });
        return total;
    }

    const sumCost = (scores: any[]) => {
        let total = 0;
        scores.forEach((score: any) => {
            total += score.cost;
        });
        return total;
    }

    return (
        <div className='SessionResults'>
            <h1>Thanks for playing!</h1>
            <Button onClick={() => navigate('/')}>Return Home</Button>
            <Button>View Lifetime Results</Button>
            <Button>Save Results</Button>
            <br></br>
            <h1>Final Tournament Results: </h1>
            
            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            <Scatter className='ScatterCanvas' options={options} data={data} />

            <div className='ResultTable'>
                {
                    // TODO allow sort by stroke and cost
                    props.players && props.players.length > 0 && 
                    <div className='GridHeader'>
                        <p>Rank</p>
                        <p>Name</p>
                        <p>Golf Ball</p>
                        <p>
                            Total Strokes
                        </p>
                        <p>
                            Totoal Cost
                        </p>
                    </div>
                }
                {
                    props.players && props.players.length > 0 && 
                    props.players.sort((a: any, b: any) => {
                        return sumShots(a.scores) - sumShots(b.scores)
                    }).map((result: any, index: number) => (
                        <div key={result.id} className={`UserResult 
                                ${result?.id?.toLowerCase() === playerId?.toLowerCase() ? 'MatchingPlayer' : ''}`}>
                            <p>{index + 1}</p>
                            <p>{result.name}</p>
                            <GolfBall color={result.color} />
                            <p>{sumShots(result.scores)}</p>
                            <p>{sumCost(result.scores)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SessionResults;