import { useState } from 'react';
import './TournamentStage.scss';
import { Solver, solverNames } from '../../Utils/Simulation';
import { Button, Radio, Slider, Tooltip } from 'antd';
import { AmateurSolverCard, ProfessionalSolverCard, SpecialistSolverCard } from '../../ReusableComponents/SolverCards';

// TournamentStage
// Players select an architecture, and then select a solver for each required distance for that
// architecture. There will be different objectives based on the round number.
const TournamentStage = (props: {
    playingRound: Boolean, round: number,
    playRound: (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => void
}) => {

    // value of architecture chosen (on changing architecture remove all chosen solvers)
    const [architecture, setArchitecture] = useState<string>('h'); // 'h' | 'lp' | 'ds' | 'dap'

    // use value to switch between selecting golfers based on architecture chosen
    // const [selectingDistanceLp, setSelectingDistanceLp] = useState<'Long' | 'Putt'>('Long');
    // const [selectingDistanceDs, setSelectingDistanceDs] = useState<'Drive' | 'Short'>('Drive');
    // const [selectingDistanceDap, setSelectingDistanceDap] = useState<'Drive' | 'Fairway' | 'Putt'>('Drive');
    const [selectingDistance, setSelectingDistance] = useState<'Drive' | 'Long' | 'Fairway' | 'Short' | 'Putt'>('Drive');

    // Need two solvers for running lp_arch
    const [selectedDriveSolver, setSelectedDriveSolver] = useState<Solver | null>(null);
    const [selectedLongSolver, setSelectedLongSolver] = useState<Solver | null>(null);
    const [selectedFairwaySolver, setSelectedFairwaySolver] = useState<Solver | null>(null);
    const [selectedShortSolver, setSelectedShortSolver] = useState<Solver | null>(null);
    const [selectedPuttSolver, setSelectedPuttSolver] = useState<Solver | null>(null);

    const roundObjectives = [
        "Best performance no matter the cost",
        "Minimize cost with performance of at most 45 strokes",
        "Minimize both cost and performance with equal weight",
        "Choose the weight of performance versus cost yourself"
    ];

    const architectureDescriptions = [
        {
            name: 'Entire Hole',
            description: 'Select one solver type to play the entire hole',
            architecture: 'h'
        },
        {
            name: 'Long and Putt',
            description: 'Select one solver type to play Long and another to Putt',
            architecture: 'lp'
        },
        {
            name: 'Drive and Short',
            description: 'Select one solver type to Drive and another to play Short',
            architecture: 'ds'
        },
        {
            name: 'Drive, Fairway, and Putt',
            description: 'Select one solver type to Drive, another to play the Fairway, and another to Putt',
            architecture: 'dap'
        }
    ]

    const clearSelectedSolvers = () => {
        setSelectedDriveSolver(null);
        setSelectedLongSolver(null);
        setSelectedFairwaySolver(null);
        setSelectedShortSolver(null);
        setSelectedPuttSolver(null);
    }

    const selectGolfer = (solver: Solver) => {
        if (architecture === 'h') {
            setSelectedDriveSolver(solver);
        }
        else if (selectingDistance === 'Drive') {
            setSelectedDriveSolver(solver);
            if (architecture === 'ds') {
                setSelectingDistance('Short');
            } else if (architecture === 'dap') {
                setSelectingDistance('Fairway');
            }
        } else if (selectingDistance === 'Long') {
            setSelectedLongSolver(solver);
            setSelectingDistance('Putt');
        } else if (selectingDistance === 'Fairway') {
            setSelectedFairwaySolver(solver);
            setSelectingDistance('Putt');
        } else if (selectingDistance === 'Short') {
            setSelectedShortSolver(solver);
            setSelectingDistance('Drive');
        } else {
            setSelectedPuttSolver(solver);
            if (architecture === 'lp') {
                setSelectingDistance('Long')
            } else if (architecture === 'dap') {
                setSelectingDistance('Drive');
            }
        }
    }

    // Verifies if all solvers necessary have been chosen for the selected architecture
    const readyToPlay = () => {
        if (architecture === 'h') {
            return !!selectedDriveSolver;
        } else if (architecture === 'lp') {
            return !!selectedLongSolver && !!selectedPuttSolver;
        } else if (architecture === 'ds') {
            return !!selectedDriveSolver && !!selectedShortSolver;
        } else {
            // dap
            return !!selectedDriveSolver && !!selectedFairwaySolver && !!selectedPuttSolver;
        }
    }

    // Handles playing the round passing the selected values to props.playRound
    const submitPlayRound = () => {
        if (architecture === 'h' && selectedDriveSolver) {
            props.playRound("h", selectedDriveSolver);
        } else if (architecture === 'lp' && selectedLongSolver && selectedPuttSolver) {
            props.playRound("lp", selectedLongSolver, selectedPuttSolver);
        } else if (architecture === 'ds' && selectedDriveSolver && selectedShortSolver) {
            props.playRound("ds", selectedDriveSolver, selectedShortSolver);
        } else if (selectedDriveSolver && selectedFairwaySolver && selectedPuttSolver) {
            // dap
            props.playRound("h", selectedDriveSolver, selectedFairwaySolver, selectedPuttSolver);
        }
    }

    // return string to tell player what they are selecting a solver for
    const getSelectForString = () => {
        if (architecture === 'h') {
            return "for the entire hole";
        } else if (selectingDistance === 'Drive') {
            return "to Drive";
        } else if (selectingDistance === 'Long') {
            return "to play Long";
        } else if (selectingDistance === 'Fairway') {
            return "for the Fairway";
        } else if (selectingDistance === 'Short') {
            return "to play Short";
        } else {
            return "to Putt";
        }
    }

    // Returns a string with the selected solvers
    const getSelectionsString = () => {
        if (architecture === 'h') {
            return selectedDriveSolver ? `You Selected: ${solverNames[selectedDriveSolver - 1]}${selectedDriveSolver > 1 ? 's' : ''} to Drive` : "Select a Solver to Play the hole";
        } else if (architecture === 'lp') {
            if (selectedLongSolver || selectedPuttSolver) {
                // partial or complete selection made
                return `You Selected: ${selectedLongSolver ? solverNames[selectedLongSolver - 1] + (selectedLongSolver > 1 ? 's' : '') + " to play Long" : ''}
                ${selectedLongSolver && selectedPuttSolver ? ' and ' : ''}
                ${selectedPuttSolver ? solverNames[selectedPuttSolver - 1] + (selectedPuttSolver > 1 ? 's' : '') + ' to Putt' : ''}`
            } else {
                // No selection made yet
                return "Select a Solver to play Long and to Putt"
            }
        } else if (architecture === 'ds') {
            if (selectedDriveSolver || selectedShortSolver) {
                // partial or complete selection made
                return `You Selected: ${selectedDriveSolver ? solverNames[selectedDriveSolver - 1] + (selectedDriveSolver > 1 ? 's' : '') + " to Drive" : ''}
                ${selectedDriveSolver && selectedShortSolver ? ' and ' : ''}
                ${selectedShortSolver ? solverNames[selectedShortSolver - 1] + (selectedShortSolver > 1 ? 's' : '') + ' to play Short' : ''}`
            } else {
                // No selection made yet
                return "Select a Solver to Drive and play Short"
            }
        } else {
            // dap
            if (selectedDriveSolver || selectedFairwaySolver || selectedPuttSolver) {
                // partial or complete selection made
                return `You Selected: ${selectedDriveSolver ? solverNames[selectedDriveSolver - 1] + (selectedDriveSolver > 1 ? 's' : '') + " to Drive" : ''}
                ${selectedDriveSolver && selectedFairwaySolver && !selectedPuttSolver ? ' and ' : ''}
                ${selectedDriveSolver && selectedFairwaySolver && selectedPuttSolver ? ', ' : ''}
                ${selectedFairwaySolver ? solverNames[selectedFairwaySolver - 1] + (selectedFairwaySolver > 1 ? 's' : '') + ' for the Fairway' : ''}
                ${selectedDriveSolver && !selectedFairwaySolver && selectedPuttSolver ? ' and ' : ''}
                ${!selectedDriveSolver && selectedFairwaySolver && selectedPuttSolver ? ' and ' : ''}
                ${selectedDriveSolver && selectedFairwaySolver && selectedPuttSolver ? ', and' : ''}
                ${selectedPuttSolver ? solverNames[selectedPuttSolver - 1] + (selectedPuttSolver > 1 ? 's' : '') + ' to Putt' : ''}
                `
            } else {
                // No selection made yet
                return "Select a Solver to Drive, play the Fairway, and to Putt"
            }
        }
    }

    const tooltipFormatter = (value: any) => {
        return isNaN(value) ? 'Error' : (100 - value) + '% Performance, ' + value + '% Cost';
    }

    return (
        <div className='TournamentStage'>
            <div className={`Highlight Drive ${selectingDistance === 'Drive' ? "Active" : " "}`}
                onClick={() => setSelectingDistance('Drive')}
            ></div>
            <div className={`Highlight Fairway ${selectingDistance === 'Fairway' ? "Active" : " "}`}
                onClick={() => setSelectingDistance('Fairway')}
            ></div>
            <div className={`Highlight Putt ${selectingDistance === 'Putt' ? "Active" : " "}`}
                onClick={() => setSelectingDistance('Putt')}
            ></div>
            <div className='Controls'>
                <div className='Instructions'>
                    <h1> Round {'' + props.round}</h1>
                    <div className='InfoContainer'>
                        <p>
                            Round Objective: {roundObjectives[props.round - 1]}
                        </p>
                        {
                            props.round === 4 &&
                            <div className='DetermineObjective'>
                                <Slider
                                    tooltip={{
                                        formatter: tooltipFormatter
                                    }}
                                    defaultValue={50}
                                    min={20}
                                    max={80}
                                    step={5}
                                    marks={{20: 'Performance', 80: {label: <div>Cost</div>}}}
                                />
                            </div>
                        }
                        <div className='SelectArchitecture'>
                            <h3>Choose one Architecture</h3>
                            <div className='Architectures'>

                                <Radio.Group defaultValue='h' buttonStyle='solid'>
                                    {
                                        architectureDescriptions.map((arch) => (
                                            <Tooltip title={arch.description} key={arch.name}>
                                                <Radio.Button
                                                    onClick={() => {
                                                        // TODO decide if changing architecture should clear selections or not
                                                        clearSelectedSolvers();
                                                        // Set selecting distance to 'Drive' unless on lp then set it to long
                                                        setSelectingDistance(arch.architecture === 'lp' ? 'Long' : 'Drive');
                                                        setArchitecture(arch.architecture);
                                                    }}
                                                    value={arch.architecture}
                                                >
                                                    {arch.name}
                                                </Radio.Button>
                                            </Tooltip>
                                        ))
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                        <div className='SelectDistance'>
                            {
                                architecture !== 'h' &&
                                <h3>
                                    Select module
                                </h3>
                            }
                            {
                                architecture === 'lp' &&
                                <Radio.Group value={selectingDistance} defaultValue='Long' buttonStyle='solid'>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Long')}
                                        value={'Long'}
                                    >
                                        Long
                                    </Radio.Button>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Putt')}
                                        value={'Putt'}
                                    >
                                        Putt
                                    </Radio.Button>
                                </Radio.Group>
                            }
                            {
                                architecture === 'ds' &&
                                <Radio.Group value={selectingDistance} defaultValue='Drive' buttonStyle='solid'>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Drive')}
                                        value={'Drive'}
                                    >
                                        Drive
                                    </Radio.Button>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Short')}
                                        value={'Short'}
                                    >
                                        Short
                                    </Radio.Button>
                                </Radio.Group>
                            }
                            {
                                architecture === 'dap' &&
                                <Radio.Group value={selectingDistance} defaultValue='Drive' buttonStyle='solid'>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Drive')}
                                        value={'Drive'}
                                    >
                                        Drive
                                    </Radio.Button>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Fairway')}
                                        value={'Fairway'}
                                    >
                                        Fairway
                                    </Radio.Button>
                                    <Radio.Button
                                        onClick={() => setSelectingDistance('Putt')}
                                        value={'Putt'}
                                    >
                                        Putt
                                    </Radio.Button>
                                </Radio.Group>
                            }
                        </div>
                        {
                            !readyToPlay() &&
                            <h3>Select a solver below {getSelectForString()}</h3>
                        }
                        <div className='Selections'>
                            <p>
                                {getSelectionsString()}
                            </p>
                        </div>
                    </div>
                    {
                        readyToPlay() &&
                        <Button
                            onClick={() => submitPlayRound()}
                            disabled={!!props.playingRound}
                        >
                            Play Round
                        </Button>
                    }
                </div>
                <div className='Solvers'>
                    <ProfessionalSolverCard select={selectGolfer} />
                    <SpecialistSolverCard select={selectGolfer} />
                    <AmateurSolverCard select={selectGolfer} />
                </div>
            </div>
        </div>
    )
}

export default TournamentStage;