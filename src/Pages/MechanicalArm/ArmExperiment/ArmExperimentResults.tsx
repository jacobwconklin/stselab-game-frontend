import { Button, Table } from 'antd';
import SpaceBackground from '../../../ReusableComponents/SpaceBackground';
import './ArmExperimentResults.scss';
import { ArmSolver, armComponents, armSolverInformation, armSolverNames } from '../../../Utils/ArmSimulation';
import { ArmComponentResult } from '../../../Utils/Types';
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
import { useState } from 'react';

// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperimentResults = (props: {
    results: any[],
    hideResults: () => void,
    // simulateAll: () => void,
    loading: boolean,
}) => {


    const [showWeights, setShowWeights] = useState(true);
    const [showCosts, setShowCosts] = useState(true);


    // Gets avg for type of value from props.results
    const getComponentAverage = (component: string, solver: ArmSolver, type: 'weight' | 'cost') => {
        let value = 0;
        let numberOfValues = 0;
        props?.results?.filter((result: ArmComponentResult) => result.component === component && result.solver === solver)
            .map((result: ArmComponentResult) => {
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

    // Table data
    const getColumns = () => {

        let columns = [
            {
                title: 'Component',
                dataIndex: 'component',
                key: 'component',
            },
        ];
        if (showWeights) {
            columns = columns.concat(
                armSolverNames.map(solverName => {
                    return {
                        title: solverName + ' Weight Average',
                        dataIndex: solverName + ' Weight Avg',
                        key: solverName + 'WeightAvg',
                    }
                })
            );
        }
        if (showCosts) {
            columns = columns.concat(
                armSolverNames.map(solverName => {
                    return {
                        title: solverName + ' Cost Average',
                        dataIndex: solverName + ' Cost Avg',
                        key: solverName + 'CostAvg',
                    }
                })
            );
        }
        return columns;
    }

    const data = armComponents.map((component, index) => {
        const dataObject = Object.assign({}, ...armSolverNames.map((solverName, index) => (
            {
                [solverName + ' Weight Avg']: getComponentAverage(component, index + 1, 'weight'),
                [solverName + ' Cost Avg']: getComponentAverage(component, index + 1, 'cost'),
            }
        )));
        return {
            key: index,
            component: component,
            ...dataObject
        }
    })


    // Chart data

    // Solver colors:
    const solverColors = ["red", "blue", "green", "gold"];

    // set up chart js
    ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Title);

    // For All components show average weight per solver
    const avgWeightPerSolverOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Average Weight per Solver for all Components',
            },
        },
        scales: {
            y: {
                // max: 50,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Weight of component in kg'
                }
            },
        },
        layout: {
            padding: 20
        },
    };

    const avgWeightPerSolverData = {
        labels: armComponents,
        datasets: armSolverInformation.map((solverInformation, index) => {
            return {
                label: solverInformation.name,
                data: armComponents.map((component: string) => {
                    return getComponentAverage(component, solverInformation.armSolver, 'weight');
                }),
                backgroundColor: solverColors[index],
            }
        })
    };

    // For All components show average cost per solver
    const avgCostPerSolverOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Average Cost per Solver for all Components',
            },
        },
        scales: {
            y: {
                // max: 50,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cost of building component in thousands of dollars'
                }
            },
        },
        layout: {
            padding: 20
        },
    };

    const avgCostPerSolverData = {
        labels: armComponents,
        datasets: armSolverInformation.map((solverInformation, index) => {
            return {
                label: solverInformation.name,
                data: armComponents.map((component: string) => {
                    return getComponentAverage(component, solverInformation.armSolver, 'cost');
                }),
                backgroundColor: solverColors[index],
            }
        })
    };


    // Data per component:

    // For JUST Entire Arm Component show all Weight and Cost results per solver

    const armComponentOptions = armComponents.map((component: string) => {
        return {
            plugins: {
                title: {
                    display: true,
                    text: `Weights and Costs acheived for ${component} Component`
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Weight of component in kg'
                    }
                },
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cost of component in thousands of dollars'
                    }
                },
            },
            elements: {
                point: { radius: 10, }
            },
            layout: { padding: 20 },
        };
    })



    const componentDataSets = armComponents.map((component: string) => {
        return {
            datasets: armSolverInformation.map((solverInformation, index) => {
                return {
                    label: solverInformation.name,
                    data: props?.results?.filter((result: ArmComponentResult) => (
                        result.solver === solverInformation.armSolver && result.component === component))
                        .map((result: ArmComponentResult) => {
                            return {
                                x: result.weight,
                                y: (result.cost)
                            }
                        }),
                    backgroundColor: solverColors[index],
                }
            })
        };
    });

    return (
        <div className="ArmExperimentResults">
            <SpaceBackground />
            <div className='Instructions'>
                <h1>Experiment Results</h1>
                <div className='ButtonRow'>
                    {/* <Button
                        onClick={() => props.simulateAll()}
                        disabled={props.loading}
                    >
                        Simulate All
                    </Button> */}
                    <Button
                        onClick={() => props.hideResults()}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => {
                            if (!showCosts && showWeights) {
                                setShowWeights(false);
                                setShowCosts(true);
                            } else {
                                setShowWeights(!showWeights);
                            }
                        }}
                    >
                        {showWeights ? "Hide Weights" : "Show Weights"}
                    </Button>
                    <Button
                        onClick={() => {
                            if (!showWeights && showCosts) {
                                setShowCosts(false);
                                setShowWeights(true);
                            } else {
                                setShowCosts(!showCosts);
                            }
                        }}
                    >
                        {showCosts ? "Hide Costs" : "Show Costs"}
                    </Button>
                </div>
            </div>

            {/* Table of results */}
            <div className='ResultTable'>
                <Table
                    style={{minWidth: (showCosts && showWeights) ? '1300px' : '900px'}}
                    pagination={{ position: ['none', "none"] }}
                    columns={getColumns()}
                    dataSource={data}
                />
            </div>

            <br></br>
            <br></br>

            <div className='Instructions'>
                <h1>Averages for all Components</h1>
            </div>
            {/* Bar chart Avg weight per solver per component */}
            <Bar className='ScatterCanvas ChartJSCanvas'
                options={avgWeightPerSolverOptions}
                data={avgWeightPerSolverData}
            />

            {/* Bar chart Avg cost per solver per component */}
            <Bar className='ScatterCanvas ChartJSCanvas'
                options={avgCostPerSolverOptions}
                data={avgCostPerSolverData}
            />


            <div className='Instructions'>
                <h1>Results for each Component</h1>
            </div>
            {/* Scatter plot of Solver weight and cost, make one for each component */}
            {
                armComponents.map((component: string, index) => {
                    return (
                        <Scatter
                            key={component}
                            className='ScatterCanvas ChartJSCanvas'
                            options={armComponentOptions[index]}
                            data={componentDataSets[index]}
                        />
                    )
                })
            }

        </div>
    )
}

export default ArmExperimentResults;