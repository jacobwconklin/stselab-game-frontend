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
import { RoundResult } from '../../Utils/Types';
import { solverNames } from '../../Utils/Simulation';
import { RoundNames } from '../../Utils/Utils';

// AggregateResultGrpahs
// Only show for tournament stage results (not professional only or h_arch)
const AggregateResultGraphs = (props: { results: RoundResult[] }) => {

    // Returns an informative label with the achitecture and solvers used:
    const getArchitectureSolverLabel = (result: RoundResult) => {
        let label = result.architecture + ": " + solverNames[result.solverOne - 1]
        if (result.solverTwo) {
            label +=  ", " + solverNames[result.solverTwo - 1];
        }
        if (result.solverThree) {
            label += ", " + solverNames[result.solverThree - 1];
        }
        return label;
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
                text: "Shots and Costs of all Tournament Rounds",
                font: {
                    size: 18
                }
            },
            legend: {
                display: false
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
            padding: 20
        },
    };

    const shotsCostData = {
        datasets: props?.results?.map((result: RoundResult) => {
            return {
                label: getArchitectureSolverLabel(result),
                data: [{
                    x: result.cost / 100,
                    y: result.shots
                }],
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
                text: `Score per Player by Round`,
                font: {
                    size: 18
                }
            },
            legend: {
                display: false
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
        datasets: props?.results?.map((result: RoundResult) => { 
            return {
                label: getArchitectureSolverLabel(result),
                data: [{
                    x: result.round - RoundNames.TournamentStage1 + 1,
                    y: result.score / 100
                }],
                backgroundColor: result.color,
            }
        })
    };

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

    return (
        <div className='AggregateResultGraphs'>
            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            <div className='ResultGraphs'>
                <Scatter className='ScatterCanvas' options={shotsCostOptions} data={shotsCostData} />
            </div>
            <div className='ResultGraphs'>
                <Scatter className='ScatterCanvas' options={scoreRoundOptions} data={scoreRoundData} />
            </div>
            <br></br>
        </div>
    )
}

export default AggregateResultGraphs;