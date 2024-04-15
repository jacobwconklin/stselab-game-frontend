
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { RoundResult } from '../../../Utils/Types';
import { RoundNames, getDisplayRound, tournamentStage2MaximumShots } from '../../../Utils/Utils';

const ResultGraphs = (props: {players: Array<RoundResult>, round: number}) => {

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

    
    // const golfBallImage = new Image(20, 20); // WORKS and sets image to golf ball, but eliminates player colors 
    // golfBallImage.src = golfBallSvg;
    // chart options and data
    const options = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Shots and Costs for Round ${getDisplayRound(props?.round)}`,
                font: {
                    size: 18
                }
            },
            legend: {
                display: props?.round === RoundNames.TournamentStage2 ? false : true,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
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
                min: 0,
                max: 150,
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
                // pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 10
        },
    };

    const data = {
        datasets: props?.round === RoundNames.TournamentStage2 ? 
        props?.players?.filter((result: RoundResult) => result.shots).map((result: RoundResult) => {
            return {
                label: result.name,
                data: [{
                    x: result.cost / 100,
                    y: result.shots
                }],
                backgroundColor: result.color,
            }
        }).concat(
            Array.from({length: 150}, (value, index) => {
                return {
                    label: `Maximum Acceptable Shots`,
                    data: [{
                        x: index + 1,
                        y: tournamentStage2MaximumShots
                    }],
                    backgroundColor: 'red'
                }
            })
        )
        :
        props?.players?.filter((result: RoundResult) => result.shots).map((result: RoundResult) => {
            return {
                label: result.name,
                data: [{
                    x: result.cost / 100,
                    y: result.shots
                }],
                backgroundColor: result.color,
            }
        })
    };

    return (
        <div className='ResultGraphs'>
            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            <Scatter className='ScatterCanvas' options={options} data={data} />

        </div>
    )


}

export default ResultGraphs;

