import { useState } from 'react';
import './TournamentStage.scss';
import { Solver, moduleDescriptions, solverNames } from '../../../Utils/Simulation';
import { Button, Slider, Tooltip } from 'antd';
import { AmateurSolverCard, ProfessionalSolverCard, SpecialistSolverCard } from '../../../ReusableComponents/SolverCards';
import professionalIcon from '../../../Assets/man-golfing-dark-skin-tone.svg';
import specialistIcon from '../../../Assets/woman-golfing-light-skin-tone.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';
import { RoundNames, animateBallIntoHole, inDevMode, tournamentStage2MaximumShots } from '../../../Utils/Utils';
import TextArea from 'antd/es/input/TextArea';

// TournamentStage
// Players select an architecture, and then select a solver for each required distance for that
// architecture. There will be different objectives based on the round number.
const TournamentStage = (props: {
    playingRound: Boolean, round: number,
    playRound: (architecture: string, reasoning: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => void,
    disablePlayRound: () => void,
    customPerformanceWeight: number,
    setCustomPerformanceWeight: (weight: number) => void
}) => {

    const [showTournamentBeginModal, setShowTournamentBeginModal] =
        useState(props?.round === RoundNames.TournamentStage1 ? true : false);

    // value of architecture chosen (on changing architecture remove all chosen solvers)
    const [architecture, setArchitecture] = useState<'h' | 'lp' | 'ds' | 'dap'>('h'); // 'h' | 'lp' | 'ds' | 'dap'

    // use value to switch between selecting golfers based on architecture chosen
    // const [selectingDistanceLp, setSelectingDistanceLp] = useState<'Long' | 'Putt'>('Long');
    // const [selectingDistanceDs, setSelectingDistanceDs] = useState<'Drive' | 'Short'>('Drive');
    // const [selectingDistanceDap, setSelectingDistanceDap] = useState<'Drive' | 'Fairway' | 'Putt'>('Drive');
    const [selectingDistance, setSelectingDistance] = useState<'Drive' | 'Long' | 'Fairway' | 'Short' | 'Putt'>('Drive');

    // Icons to display on the top
    const solverIcons = [professionalIcon, amateurIcon, specialistIcon];

    // Need two solvers for running lp_arch
    const [selectedDriveSolver, setSelectedDriveSolver] = useState<Solver | null>(null);
    const [selectedLongSolver, setSelectedLongSolver] = useState<Solver | null>(null);
    const [selectedFairwaySolver, setSelectedFairwaySolver] = useState<Solver | null>(null);
    const [selectedShortSolver, setSelectedShortSolver] = useState<Solver | null>(null);
    const [selectedPuttSolver, setSelectedPuttSolver] = useState<Solver | null>(null);

    const [showPlayRoundModal, setShowPlayRoundModal] = useState(false);

    const [reasoning, setReasoning] = useState(''); // Reasoning for module and solver choices

    // Use effect to populate context with custom performance weight if user never touches slider

    const updateCustomPerformance = (value: number) => {
        // convert value to percentage
        props.setCustomPerformanceWeight((100 - value) / 100);
    }

    const tooltipFormatter = (value?: number) => {
        return !value || isNaN(value) ? 'Error' : (100 - value) + '% Performance, ' + value + '% Cost';
    }

    const roundObjectives = [
        "Best performance no matter the cost",
        `Minimize cost without exceeding ${tournamentStage2MaximumShots} strokes`,
        "Minimize cost and performance. 50% of the score will come from performance and 50% will come from cost.", // expound on this. IE could say 50% of score will come from shots taken and 50% from cost...?
        "Choose the weight of performance versus cost yourself"
    ];

    const architectureDescriptions = [
        {
            name: 'Entire Hole',
            description: 'Select one solver type to play the entire hole',
            architecture: 'h',
            modules: ['Entire Hole']
        },
        {
            name: 'Long and Putt',
            description: 'Select one solver type to play Long and another to Putt',
            architecture: 'lp',
            modules: ['Long', 'Putt']
        },
        {
            name: 'Drive and Short',
            description: 'Select one solver type to Drive and another to play Short',
            architecture: 'ds',
            modules: ['Drive', 'Short']
        },
        {
            name: 'Drive, Fairway, and Putt',
            description: 'Select one solver type to Drive, another to play the Fairway, and another to Putt',
            architecture: 'dap',
            modules: ['Drive', 'Fairway', 'Putt']
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
            props.playRound("h", reasoning, selectedDriveSolver);
        } else if (architecture === 'lp' && selectedLongSolver && selectedPuttSolver) {
            props.playRound("lp", reasoning, selectedLongSolver, selectedPuttSolver);
        } else if (architecture === 'ds' && selectedDriveSolver && selectedShortSolver) {
            props.playRound("ds", reasoning, selectedDriveSolver, selectedShortSolver);
        } else if (selectedDriveSolver && selectedFairwaySolver && selectedPuttSolver) {
            // dap
            props.playRound("dap", reasoning, selectedDriveSolver, selectedFairwaySolver, selectedPuttSolver);
        }
    }

    // callback for modal to close and play round
    const beginPlayingRound = () => {
        setShowPlayRoundModal(false);
        props.disablePlayRound();
        animateBallIntoHole(submitPlayRound)
    }

    const getSolverForSelectedModule = (): Solver | null => {
        if (selectingDistance === 'Drive') {
            return selectedDriveSolver;
        } else if (selectingDistance === 'Long') {
            return selectedLongSolver;
        } else if (selectingDistance === 'Fairway') {
            return selectedFairwaySolver;
        } else if (selectingDistance === 'Short') {
            return selectedShortSolver;
        } else {
            return selectedPuttSolver;
        }
    }

    const getSolverForModule = (module: string): Solver | null => {
        if (module === 'Putt') {
            return selectedPuttSolver;
        } else if (module === 'Long') {
            return selectedLongSolver;
        } else if (module === 'Fairway') {
            return selectedFairwaySolver;
        } else if (module === 'Short') {
            return selectedShortSolver;
        } else {
            // make drive default so entire hole also works
            return selectedDriveSolver;
        }
    }

    const getModuleToolTip = (module: string): string => {
        if (module === 'Drive') {
            return moduleDescriptions[0];
        } else if (module === 'Long') {
            return moduleDescriptions[1];
        } else if (module === 'Fairway') {
            return moduleDescriptions[2];
        } else if (module === 'Short') {
            return moduleDescriptions[3];
        } else if (module === 'Putt') {
            return moduleDescriptions[4];
        } else {
            return moduleDescriptions[5];
        }
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
                    <h1>
                        Tournament Round {'' + (props.round - RoundNames.TournamentStage1 + 1)}

                        <Button className='InfoButtonHolder' onClick={() => setShowTournamentBeginModal(true)}>
                            &nbsp;
                            <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </h1>
                    <div className='InfoContainer'>
                        <h2>
                            Round Objective: {roundObjectives[props.round - 6]}
                        </h2>
                        {
                            props.round === RoundNames.TournamentStage4 &&
                            <div className='DetermineObjective'>
                                <Slider
                                    tooltip={{
                                        formatter: tooltipFormatter
                                    }}
                                    defaultValue={50}
                                    min={20}
                                    max={80}
                                    step={5}
                                    marks={{ 20: 'Performance', 80: { label: <div>Cost</div> } }}
                                    onChange={e => {
                                        updateCustomPerformance(e);
                                    }}
                                />
                            </div>
                        }
                        <div className='HorizontalSplit'>

                            <div className='SelectArchitecture'>
                                <h3>Choose one Architecture</h3>
                                {
                                    architectureDescriptions.map((arch) => (
                                        <Button
                                            key={arch.name}
                                            onClick={() => {
                                                // Changing architecture clears selections 
                                                clearSelectedSolvers();
                                                // Set selecting distance to 'Drive' unless on lp then set it to long
                                                setSelectingDistance(arch.architecture === 'lp' ? 'Long' : 'Drive');
                                                setArchitecture(arch.architecture as 'h' | 'lp' | 'ds' | 'dap');
                                            }}
                                            type={arch.architecture === architecture ? 'primary' : 'default'}
                                            className={readyToPlay() && arch.architecture === architecture ? 'CompletedSelection' : ''}
                                        >
                                            {arch.name}
                                        </Button>
                                    ))
                                }
                            </div>

                            <div className='SelectModule'>
                                <h3>
                                    Select Modules
                                </h3>
                                {
                                    architectureDescriptions.find(arch => arch.architecture === architecture)?.modules.map((module) => (
                                        <Tooltip title={getModuleToolTip(module)} placement='right' key={module}>
                                            <Button
                                                key={module}
                                                onClick={() => setSelectingDistance(module === 'Entire Hole' ? 'Drive' : module as 'Drive' | 'Long' | 'Fairway' | 'Short' | 'Putt')}
                                                type={module === "Entire Hole" ? 'primary' :
                                                    (selectingDistance === module ? 'primary' : 'default')}
                                                className={getSolverForModule(module) ? 'CompletedSelection' : ''}
                                            >
                                                {module}
                                                &nbsp;
                                                <svg width="12" height="12" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Button>
                                        </Tooltip>
                                    ))
                                }
                            </div>
                            <div className='SolverSelection'>
                                <h3>
                                    Select Solvers Below
                                </h3>
                                {
                                    getSolverForSelectedModule() ?
                                        <>
                                            <p>
                                                You Selected {solverNames[getSolverForSelectedModule()! - 1]}
                                                &nbsp;to Play {architecture === 'h' ? 'the Entire Hole' : selectingDistance}.
                                                Click a different Solver Below to Change
                                            </p>
                                            <img className='SelectedSolverImage' src={solverIcons[getSolverForSelectedModule()! - 1]} alt="Solver Icon" />
                                        </>
                                        :
                                        <p>
                                            Select a Solver Below to Play {architecture === 'h' ? 'the Entire Hole' : selectingDistance}
                                        </p>
                                }
                            </div>

                        </div>
                    </div>
                    <div className='SelectionsAndPlayButton'>
                        {
                            selectedDriveSolver &&
                            <div className='ModuleAndSelectedSolver'>
                                <p>{architecture === 'h' ? 'Entire Hole:' : 'Drive:'}</p>
                                <img className='HeaderIconImage' src={solverIcons[selectedDriveSolver - 1]} alt="Solver Icon" />
                            </div>
                        }
                        {
                            selectedLongSolver &&
                            <div className='ModuleAndSelectedSolver'>
                                <p>{'Long:'}</p>
                                <img className='HeaderIconImage' src={solverIcons[selectedLongSolver - 1]} alt="Solver Icon" />
                            </div>
                        }
                        {
                            selectedFairwaySolver &&
                            <div className='ModuleAndSelectedSolver'>
                                <p>{'Fairway:'}</p>
                                <img className='HeaderIconImage' src={solverIcons[selectedFairwaySolver - 1]} alt="Solver Icon" />
                            </div>
                        }
                        {
                            selectedShortSolver &&
                            <div className='ModuleAndSelectedSolver'>
                                <p>{'Short:'}</p>
                                <img className='HeaderIconImage' src={solverIcons[selectedShortSolver - 1]} alt="Solver Icon" />
                            </div>
                        }
                        {
                            selectedPuttSolver &&
                            <div className='ModuleAndSelectedSolver'>
                                <p>{'Putt:'}</p>
                                <img className='HeaderIconImage' src={solverIcons[selectedPuttSolver - 1]} alt="Solver Icon" />
                            </div>
                        }
                        <Button
                            onClick={() => {
                                setShowPlayRoundModal(true);
                            }}
                            disabled={!!props.playingRound || !readyToPlay()}
                        >
                            Play 5 Holes
                        </Button>
                    </div>
                </div>
                <div className='Solvers'>
                    <ProfessionalSolverCard select={selectGolfer} />
                    <SpecialistSolverCard select={selectGolfer} />
                    <AmateurSolverCard select={selectGolfer} />
                </div>
            </div>
            {
                showTournamentBeginModal &&
                <div className='Modal'
                // Can have click out here but they may not read
                >
                    <div className='ModalBody'>
                        <h2>The Tournament Has Begun!</h2>
                        <p>
                            Here you will play four rounds each with a unique objective. Each round is played on 5 holes. In each round you may select one architecture and any solver types you would like. Points are awarded for acheiving the objectives. The winner will be the player with the most total points at the end of the tournament.
                        </p>
                        <div className='ModalButtons'>
                            <Button onClick={() => setShowTournamentBeginModal(false)}>Begin</Button>
                        </div>
                    </div>
                </div>
            }
            {
                showPlayRoundModal &&
                <div className='Modal'
                // Can have click out here but they may not read
                >
                    <div className='ModalBody'>
                        <h1>
                            Are You Sure?
                        </h1>
                        <p style={{ width: '100%', textAlign: 'left' }} >
                            You will only play each Tournament Round once. Are you sure you want to play 5 holes with your selected Modules and Solvers? 
                        </p>
                        {/* <TextArea
                            autoSize
                            placeholder='Enter your reasoning here'
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={240}
                            value={reasoning}
                            onChange={(event) => {
                                setReasoning(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value);
                            }}
                        /> */}
                        <br></br>
                        <div className='ModalButtons'>
                            <Button
                                // disabled={!inDevMode() && reasoning.trim().length >= 0}
                                onClick={() => {
                                    beginPlayingRound();
                                }}
                            >
                                Confirm
                            </Button>
                            <br/>
                            <br/>
                            <Button
                                onClick={() => {
                                    setShowPlayRoundModal(false);
                                }}
                                type="primary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TournamentStage;