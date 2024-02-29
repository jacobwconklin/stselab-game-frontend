
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
import { RoundResult } from '../../../Utils/Types';

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
                text: `Shots and Costs for Round ${props?.round}`
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
            padding: 10
        },
    };

    const data = {
        datasets: props?.players?.filter((result: any) => result.shots).map((result: any) => {
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

