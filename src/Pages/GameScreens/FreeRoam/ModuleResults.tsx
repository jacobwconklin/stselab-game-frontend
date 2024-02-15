import { Button } from 'antd';
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
import { Bar, Scatter } from 'react-chartjs-2';
import { Solver, solverNames } from '../../../Utils/Simulation';
import { useState } from 'react';

// ModuleResults
const ModuleResults = (props: any) => {

    // Gets avg for type of value from props.results
    const getModuleAverage = (module: string, solver: Solver, type: string) => {
        let value = 0;
        let numberOfValues = 0;
        props?.results?.filter((result: any) => result.module === module && result.solver === solver)
        .map((result: any) => {
            value += result[type];
            numberOfValues++;
            return null;
        });
        if (numberOfValues === 0) {
            return "---";
        } else {
            // Round to two decimal places
            return type === 'distance' ? (Math.floor(value / numberOfValues) / 100)
            : (Math.floor((value / numberOfValues) * 100) / 100)
        }
    }

    // save all module names to iterate through
    const modules = ['Drive',  'Long', 'Fairway', 'Short', 'Putt'];
    const remainingDistanceModules = ['Drive',  'Long', 'Fairway'];
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
                text: "Shots and Distance Remaining for Drive Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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
        elements: { point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const driveData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: any) => result.solver === solver && result.module === 'Drive')
                .map((result: any) => { return {
                    x: result.shots,
                    y: (result.distance / 100)
                }}),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Long module show all shot and distance results per solver
    const longOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Remaining for Long Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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
        elements: { point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const longData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: any) => result.solver === solver && result.module === 'Long')
                .map((result: any) => { return {
                    x: result.shots,
                    y: (result.distance / 100)
                }}),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Fairway module show all shot and distance results per solver
    const fairwayOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Remaining for Fairway Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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
        elements: { point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const fairwayData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: any) => result.solver === solver && result.module === 'Fairway')
                .map((result: any) => { return {
                    x: result.shots,
                    y: (result.distance / 100)
                }}),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Short module show all shot and distance results per solver
    const shortOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Remaining for Short Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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
        elements: { point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const shortData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: any) => result.solver === solver && result.module === 'Short')
                .map((result: any) => { return {
                    x: result.shots,
                    y: (result.distance / 100)
                }}),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For JUST Putt module show all shot and distance results per solver
    
    const puttOptions = {
        plugins: {
            title: {
                display: true,
                text: "Shots and Distance Remaining for Putt Module"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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
        elements: { point: { radius: 10, }
        },
        layout: { padding: 20 },
    };

    const puttData = {
        datasets: solvers.map((solver: Solver, index: number) => {
            return {
                label: solverNames[solver - 1],
                data: props?.results?.filter((result: any) => result.solver === solver && result.module === 'Putt')
                .map((result: any) => { return {
                    x: result.shots,
                    y: (result.distance / 100)
                }}),
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
                    text: 'Distance remaining to hole'
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
                text: 'Average Distance Remaining per Solver for all Drive, Long, and Fairway',
            },
        },
        scales: {
            y: {
                // max: 50,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distance remaining to hole'
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

    return (
        <div className='ModuleResults'>
            <div className='ResultInformation'>
                <h1>Your experimental results</h1>
                <p>
                    Shots refers to the number of shots taken to finish the module. Drives are always exactly one shot. Distanct refers to the remaining distance to the hole after the module is finished. The lower remaining distance the better. Short and Putt modules always finish with a distance of 0 as the ball is put in the hole. Other modules may have instances with a distance of 0 meaning a lucky 
                    shot put the ball in the hole.
                </p>
                <div className='ResultActions'>
                    <Button onClick={() => props.return()}>
                        Back to {props.origin}
                    </Button>
                    <Button onClick={() => setShowAverageGraphs(val => !val)}>
                        {showAverageGraphs ? "Hide " : "Show "} Averages Graphs
                    </Button>
                    <Button onClick={() => setShowModuleGraphs(val => !val)}>
                        {showModuleGraphs ? "Hide " : "Show "} Module Graphs
                    </Button>
                </div>
            </div>

            <div className='ResultByModuleTable'>
                <div className='GridHeader'>
                    <p>Module</p>
                    <p>Professional Shot Average</p>
                    <p>Professional Distance Average</p>
                    <p>Specialist Shot Average</p>
                    <p>Specialist Distance Average</p>
                    <p>Amateur Shot Average</p>
                    <p>Amateur Distance Average</p>
                </div>
                {
                    modules.map((module: string) => (
                        <div key={module} className='GridRow'>
                            <p>{module}</p>
                            <p>
                                {getModuleAverage(module, Solver.Professional, 'shots')}
                            </p>
                            <p>
                                {getModuleAverage(module, Solver.Professional, 'distance')}
                            </p>
                            <p>
                                {getModuleAverage(module, Solver.Specialist, 'shots')}
                            </p>
                            <p>
                                {getModuleAverage(module, Solver.Specialist, 'distance')}
                            </p>
                            <p>
                                {getModuleAverage(module, Solver.Amateur, 'shots')}
                            </p>
                            <p>
                                {getModuleAverage(module, Solver.Amateur, 'distance')}
                            </p>
                        </div>
                    ))
                }
            </div>

            <br></br>
            <br></br>
            
            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            {
                showAverageGraphs &&
                <div className='GraphSection'>
                    <h1>Solver Averages</h1>
                    <Bar className='ScatterCanvas ChartJSCanvas' options={avgShotsPerSolverOptions} data={avgShotsPerSolverData} />
                    <Bar className='ScatterCanvas ChartJSCanvas' options={avgDistancePerSolverOptions} data={avgDistancePerSolverData} />
                </div>
            }

            <br></br>

            {
                showModuleGraphs &&
                <div className='GraphSection'>
                    <h1>Performances per Module</h1>
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