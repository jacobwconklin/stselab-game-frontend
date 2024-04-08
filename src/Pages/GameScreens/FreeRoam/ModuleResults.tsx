import { Button, Table } from 'antd';
import './ModuleResults.scss';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    BarElement,
} from 'chart.js';
import { Solver, runPlayDrive, runPlayFairway, runPlayLong, runPlayPutt, runPlayShort, solverNames } from '../../../Utils/Simulation';
import { Bar, Scatter } from 'react-chartjs-2';
import { useState } from 'react';
import { ModuleResult } from '../../../Utils/Types';

// ModuleResults
const ModuleResults = (props: {
    results: ModuleResult[], 
    origin: string, return: () => void,
    setAllResults: (newValue: { shots: number, distance: number, solver: Solver, module: string }[]) => void,
}) => {

    // Gets avg for type of value from props.results
    const getModuleAverage = (module: string, solver: Solver, type: 'shots' | 'distance' ) => {
        let value = 0;
        let numberOfValues = 0;
        props?.results?.filter((result: ModuleResult) => result.module === module && result.solver === solver)
            .map((result: ModuleResult) => {
                value += result[type];
                numberOfValues++;
                return null;
            });
        if (numberOfValues === 0) {
            return "---";
        } else {
            // Round to two decimal places
            return (Math.floor((value / numberOfValues) * 100) / 100)
        }
    }

    // save all module names to iterate through
    const modules = ['Drive', 'Long', 'Fairway', 'Short', 'Putt'];
    const remainingDistanceModules = ['Drive', 'Long', 'Fairway'];
    // const moduleColors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const solvers = [Solver.Professional, Solver.Amateur, Solver.Specialist];
    const solverColors = ['red', 'blue', 'green'];

    // Allow user to hide graphs
    const [showAverageGraphs, setShowAverageGraphs] = useState(true);
    const [showModuleGraphs, setShowModuleGraphs] = useState(true);

    // Scatter graphs:

    // For JUST Drive module show all shot and distance results per solver
    // TODO would be better as different type of chart since shots doesn't change...(same with short and putt but for distance)
    const driveOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Traveled for Drive Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                }
            },
            x: {
                beginAtZero: true,
                max: 2,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
        },
        elements: {
            point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const driveData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: ModuleResult) => result.solver === solver && result.module === 'Drive')
                    .map((result: ModuleResult) => {
                        return {
                            x: result.shots,
                            y: result.distance
                        }
                    }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Long module show all shot and distance results per solver
    const longOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Traveled for Long Module"
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                },
                max: 710,
                min: 680
            },
            x: {
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
        },
        elements: {
            point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const longData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: ModuleResult) => result.solver === solver && result.module === 'Long')
                    .map((result: ModuleResult) => {
                        return {
                            x: result.shots,
                            y: (result.distance)
                        }
                    }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Fairway module show all shot and distance results per solver
    const fairwayOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Traveled for Fairway Module"
            }
        },
        scales: {
            y: {
                max: 455,
                min: 430,
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
        },
        elements: {
            point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const fairwayData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: ModuleResult) => result.solver === solver && result.module === 'Fairway')
                    .map((result: ModuleResult) => {
                        return {
                            x: result.shots,
                            y: (result.distance)
                        }
                    }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Short module show all shot and distance results per solver
    const shortOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Traveled for Short Module"
            }
        },
        scales: {
            y: {
                min: 440,
                max: 460,
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
        },
        elements: {
            point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const shortData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: ModuleResult) => result.solver === solver && result.module === 'Short')
                    .map((result: ModuleResult) => {
                        return {
                            x: result.shots,
                            y: (result.distance)
                        }
                    }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Putt module show all shot and distance results per solver

    const puttOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Traveled for Putt Module"
            }
        },
        scales: {
            y: {
                min: 10,
                max: 20,
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
        },
        elements: {
            point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const puttData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: ModuleResult) => result.solver === solver && result.module === 'Putt')
                    .map((result: ModuleResult) => {
                        return {
                            x: result.shots,
                            y: (result.distance)
                        }
                    }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // Bar graphs:

    // For All modules show average shots per solver 
    // TODO could eliminate Drive as it is always 1 shot
    const avgShotsPerSolverOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Average Shots per Solver for all Modules',
            },
        },
        scales: {
            y: {
                // max: 12,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Shots taken to finish module'
                }
            },
        },
        layout: {
            padding: 20
        },
    };

    const avgShotsPerSolverData = {
        labels: modules,
        datasets: [
            {
                label: 'Professionals',
                data: modules.map((module: string) => {
                    // Need to return a number
                    return getModuleAverage(module, Solver.Professional, 'shots');
                }),
                backgroundColor: 'red',
            },
            {
                label: 'Amateurs',
                data: modules.map((module: string) => {
                    return getModuleAverage(module, Solver.Amateur, 'shots');
                }),
                backgroundColor: 'blue',
            },
            {
                label: 'Specialists',
                data: modules.map((module: string) => {
                    return getModuleAverage(module, Solver.Specialist, 'shots');
                }),
                backgroundColor: 'Green',
            },
        ],
    };

    // For All modules show average distance per solver
    const avgDistancePerSolverOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Average Distance Traveled per Solver for Drive, Long, and Fairway',
            },
        },
        scales: {
            y: {
                // max: 50,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance traveled towards hole'
                }
            },
        },
        layout: {
            padding: 20
        },
    };

    const avgDistancePerSolverData = {
        labels: remainingDistanceModules,
        datasets: [
            {
                label: 'Professionals',
                data: remainingDistanceModules.map((module: string) => {
                    // Need to return a number
                    return getModuleAverage(module, Solver.Professional, 'distance');
                }),
                backgroundColor: 'red',
            },
            {
                label: 'Amateurs',
                data: remainingDistanceModules.map((module: string) => {
                    return getModuleAverage(module, Solver.Amateur, 'distance');
                }),
                backgroundColor: 'blue',
            },
            {
                label: 'Specialists',
                data: remainingDistanceModules.map((module: string) => {
                    return getModuleAverage(module, Solver.Specialist, 'distance');
                }),
                backgroundColor: 'Green',
            },
        ],
    };

    // set up chart js
    ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);

    const columns = [
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: 'Professional Shot Avgerage',
            dataIndex: 'ProShotAvg',
            key: 'ProShotAvg',
        },
        {
            title: 'Professional Distance Avgerage',
            dataIndex: 'ProDistanceAvg',
            key: 'ProDistanceAvg',
        },
        {
            title: 'Specialist Shot Avgerage',
            dataIndex: 'SpecShotAvg',
            key: 'SpecShotAvg',
        },
        {
            title: 'Specialist Distance Avgerage',
            dataIndex: 'SpecDistanceAvg',
            key: 'SpecDistanceAvg',
        },
        {
            title: 'Amateur Shot Avgerage',
            dataIndex: 'AmShotAvg',
            key: 'AmShotAvg',
        },
        {
            title: 'Amateur Distance Avgerage',
            dataIndex: 'AmDistanceAvg',
            key: 'AmDistanceAvg',
        },
    ];

    const data = modules.map((module, index) => (
        {
            key: index,
            module: module,
            ProShotAvg: getModuleAverage(module, Solver.Professional, 'shots'),
            ProDistanceAvg: getModuleAverage(module, Solver.Professional, 'distance'),
            SpecShotAvg: getModuleAverage(module, Solver.Specialist, 'shots'),
            SpecDistanceAvg: getModuleAverage(module, Solver.Specialist, 'distance'),
            AmShotAvg: getModuleAverage(module, Solver.Amateur, 'shots'),
            AmDistanceAvg: getModuleAverage(module, Solver.Amateur, 'distance'),
        }
    ))

    const [loading, setLoading] = useState(false);
    
    const simulateAll = async () => {
        try {
            setLoading(true);
            // save all results as it goes
            const simulatedResults = [];
            // For each solver play each module once
            for (let i = 1; i < 4; i++) {
                let result = await runPlayDrive(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Drive' });
                result = await runPlayLong(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Long' });
                result = await runPlayFairway(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Fairway' });
                result = await runPlayShort(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Short' });
                result = await runPlayPutt(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Putt' });
            }
            // TODO Do not save results to database from here
            // saveFreeRoamResult(result.shots, result.distance);
            props.setAllResults([...props.results, ...simulatedResults]);
            setLoading(false);
        } catch (error) {
            console.error("Error simulating all: ", error);
            setLoading(false);
        }
    }

    return (
        <div className='ModuleResults'>
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
            <div className='ResultInformation'>
                <h1>Your Experimental Results</h1>
                <p>
                    Shots refers to the number of shots taken to finish the module. Drives are always exactly one shot. Distance refers to the distance traveled towards the hole after the module is finished from where the module begins. Short Putt modules always finish with a distance of 450 and Putt modules always finish with a distance of 15 as the ball is put in the hole. Other modules may have instances with a distance of 0 meaning a lucky
                    shot put the ball in the hole.
                </p>
                <div className='ResultActions'>
                    <Button onClick={() => props.return()}>
                        Back to {props.origin}
                    </Button>
                    <Button onClick={() => simulateAll()} disabled={loading}>
                        Simulate All
                    </Button>
                    <Button onClick={() => setShowAverageGraphs(val => !val)}>
                        {showAverageGraphs ? "Hide " : "Show "} Averages Graphs
                    </Button>
                    <Button onClick={() => setShowModuleGraphs(val => !val)}>
                        {showModuleGraphs ? "Hide " : "Show "} Module Graphs
                    </Button>
                </div>
            </div>

            <div className='ResultTable'>
                <Table
                    pagination={{ position: ['none', "none"] }}
                    columns={columns}
                    dataSource={data}
                />
            </div>

            <br></br>
            <br></br>

            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            {
                showAverageGraphs &&
                <div className='GraphSection'>
                    <div className='Instructions'>
                        <h1>Solver Averages</h1>
                    </div>
                    <Bar className='ScatterCanvas ChartJSCanvas' options={avgShotsPerSolverOptions} data={avgShotsPerSolverData} />
                    <Bar className='ScatterCanvas ChartJSCanvas' options={avgDistancePerSolverOptions} data={avgDistancePerSolverData} />
                </div>
            }

            <br></br>

            {
                showModuleGraphs &&
                <div className='GraphSection'>
                    <div className='Instructions'>
                        <h1>Performances per Module</h1>
                    </div>
                    <Scatter className='ScatterCanvas ChartJSCanvas' options={driveOptions} data={driveData} />
                    <Scatter className='ScatterCanvas ChartJSCanvas' options={longOptions} data={longData} />
                    <Scatter className='ScatterCanvas ChartJSCanvas' options={fairwayOptions} data={fairwayData} />
                    <Scatter className='ScatterCanvas ChartJSCanvas' options={shortOptions} data={shortData} />
                    <Scatter className='ScatterCanvas ChartJSCanvas' options={puttOptions} data={puttData} />
                </div>
            }
        </div>
    )
}

export default ModuleResults;