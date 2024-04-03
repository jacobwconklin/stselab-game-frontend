
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
import { ArmRoundResult } from '../../../Utils/Types';
import { getDisplayRound } from '../../../Utils/Utils';

const ArmResultGraphs = (props: {
    round: number
    results: Array<ArmRoundResult>, 
}) => {

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

    // chart options and data
    const options = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Weight and Costs for Mission Round ${getDisplayRound(props?.round)}`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Weight'
                },
                
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
        datasets: props?.results?.filter((result: ArmRoundResult) => result.weight).map((result: ArmRoundResult) => {
            return {
                label: result.name,
                data: [{
                    x: result.cost,
                    y: result.weight
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

export default ArmResultGraphs;

