import './ArmGameScreen.scss';
import { Button, Slider, Tooltip } from "antd";
import computerScientistIcon from '../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../Assets/MechArm/chemist.svg';
import FactoryBackground from '../../ReusableComponents/FactoryBackground';
import { ArmSolver, armArchitectures, armSolverImages, armSolverNames, runArmArchitectureSimulation } from '../../Utils/ArmSimulation';
import { useContext, useState } from 'react';
import { RoundNames, getDisplayRound } from '../../Utils/Utils';
import { UserContextType } from '../../Utils/Types';
import { UserContext } from '../../App';
import { postRequest } from '../../Utils/Api';
// The screen shown while playing the Mechanical Arm game
const ArmGameScreen = (props: {
    setFinishedRound: (val: Array<Boolean>) => void,
    finishedRounds: Array<Boolean>
    round: number
}) => {

    
    // Context to save user's slider choice for custom performance weight
    const { playerId } = useContext(UserContext) as UserContextType;

    const updateFinishedRounds = () => {
        const copy = props.finishedRounds;
        copy[props.round] = true;
        props.setFinishedRound(copy);
    }

    const [showMissionBeginModal, setShowMissionBeginModal] = useState(props?.round === RoundNames.ArmGame1 ? true : false);
    const [selectedSolvers, setSelectedSolvers] = useState<ArmSolver[]>([]);
    const [currSelectedSolver, setCurrSelectedSolver] = useState<ArmSolver | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedArchitecture, setSelectedArchitecture] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [customPerformance, setCustomPerformance] = useState<number>(0.5);

    const updateCustomPerformance = (value: number) => {
        // convert value to percentage
        setCustomPerformance((100 - value) / 100);
    }

    const tooltipFormatter = (value?: number) => {
        return !value || isNaN(value) ? 'Error' : (100 - value) + '% Weight, ' + value + '% Cost';
    }

    const roundObjectives = [
        "Lightest weight arm no matter the cost",
        "Minimize cost with a weight of at most 40 kg",
        "Minimize cost and weight valued equally",
        "You choose the balance of weight versus cost for scoring"
    ];

    const clearSelectedSolvers = () => {
        setSelectedSolvers([]);
    }

    const selectNewSolver = (solver: ArmSolver) => {
        // get index for specific component
        const index = armArchitectures.find(architecutre => architecutre.architecture === selectedArchitecture)?.components.findIndex(component => component.component === selectedComponent);
        if (index !== undefined) {
            const selectedSolversCopy = selectedSolvers;
            selectedSolversCopy[index] = solver;
            setSelectedSolvers(selectedSolversCopy);
            setCurrSelectedSolver(solver);
        }
        // move selected component to "next" component (back to first if on last or only component)
        const componentIndex = armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components.findIndex(comp => comp.component === selectedComponent);
        if (componentIndex !== undefined) {
            const nextComponentIndex = (componentIndex + 1) % armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components.length!;
            setSelectedComponent(armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components[nextComponentIndex].component!);
        }
    }

    const selectNewArchitecture = (architecture: string) => {
        setSelectedArchitecture(architecture);
        clearSelectedSolvers();
        setCurrSelectedSolver(null);
        // set selected component as the first component in the architecture
        setSelectedComponent(armArchitectures.find(arch => arch.architecture === architecture)?.components[0].component!);
    }

    const selectNewComponent = (component: string) => {
        setSelectedComponent(component);
        // check if a solver has already been selected for this component
        if (selectedSolvers.length > 0) {
            const index = armArchitectures.find(architecutre => architecutre.architecture === selectedArchitecture)?.components.findIndex(comp => comp.component === component);
            if (index !== undefined && selectedSolvers[index]) {
                setCurrSelectedSolver(selectedSolvers[index]);
            } else {
                setCurrSelectedSolver(null);
            }
        }
    }

    // Ensure that an architecture is selected, and that a solver is selected for each component
    const readyToPlay = () => {
        if (!selectedArchitecture) {
            return false;
        }
        if (selectedArchitecture) {
            const numComponents = armArchitectures.find(architecutre => architecutre.architecture === selectedArchitecture)?.components.length;
            if (!numComponents) {
                return false;
            }
            // check that one solver is selected for each component
            for (let i = 0; i < numComponents; i++) {
                if (!selectedSolvers[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    const playRound = async () => {
        setLoading(true);
        // get score for the round
        // save scored results to the backend 
        try {        
            const result = runArmArchitectureSimulation(playerId!, selectedArchitecture, props.round, selectedSolvers[0], selectedSolvers[1], selectedSolvers[2], selectedSolvers[3], customPerformance);
            // save score to database and record that player has completed the round
            const response = await postRequest('player/armRoundResult', JSON.stringify({
                playerId,
                weight: result.weight, // TODO figure out if I am storing grams and dividing by 1000 when results come back or what
                cost: result.cost,
                architecture: selectedArchitecture,
                solverOne: selectedSolvers[0],
                solverTwo: selectedSolvers[1],
                solverThree: selectedSolvers[2],
                solverFour: selectedSolvers[3],
                round: props.round,
                score: result.score !== null ? Math.floor( result.score * 100) : null
            }));
            if (response.success) {
                updateFinishedRounds();
            } else {
                alert("Error playing round, please try again");
                console.error(response);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error playing round: ", error)
            setLoading(false);
        }
    }

    return (
        <div className="ArmGameScreen">
            <FactoryBackground />
            <div className='Instructions'>
                <div className='TitleAndIcons'>
                    <h1>
                        Round {props.round - RoundNames.ArmGame1 + 1}
                        <Button className='InfoButtonHolder' onClick={() => setShowMissionBeginModal(true)}>
                            &nbsp;
                            <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </h1>
                    {
                        selectedSolvers.map((solver, index) => (
                            <img className='HeaderSolverIcon' src={armSolverImages[solver - 1]} alt='Solver Icon' key={index} />
                        ))
                    }
                </div>
                <h2>
                    Round Objective: {roundObjectives[getDisplayRound(props.round) - 1]}
                </h2>
                {
                    props.round === RoundNames.ArmGame4 &&
                    <div className='DetermineObjective'>
                        <Slider
                            tooltip={{
                                formatter: tooltipFormatter
                            }}
                            defaultValue={50}
                            min={20}
                            max={80}
                            step={5}
                            marks={{ 20: 'Weight', 80: { label: <div>Cost</div> } }}
                            onChange={e => {
                                updateCustomPerformance(e);
                            }}
                        />
                    </div>
                }
                {/** Horizontal layout */}
                <div className='HorizontalSections'>
                    <div className='Architectures'>
                        <h3>Choose One Architecture</h3>
                        {
                            // TODO add tooltip w/ descriptions
                            armArchitectures.map((architecture, index) => (
                                <Tooltip title={architecture.description} key={index} placement='right'>
                                    <Button
                                        className={readyToPlay() && selectedArchitecture === architecture.architecture ? "CompletedComponent" : ""}
                                        onClick={() => selectNewArchitecture(architecture.architecture)}
                                        type={selectedArchitecture === architecture.architecture ? "primary" : "default"}
                                    >
                                        {architecture.architecture}
                                    </Button>
                                </Tooltip>
                            ))
                        }
                    </div>

                    <div className='Components'>
                        <h3>Select Components</h3>
                        {
                            selectedArchitecture &&
                            armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components.map((component, index) => (
                                <Tooltip title={component.description} key={index} placement='left'>
                                    <Button
                                        onClick={() => selectNewComponent(component.component)}
                                        type={selectedComponent === component.component ? "primary" : "default"}
                                        className={selectedSolvers[index] ? "CompletedComponent" : ""}
                                    >
                                        {component.component}
                                    </Button>
                                </Tooltip>
                            ))
                        }
                    </div>

                    <div className='SolverSelection'>
                        <h3>Select Solvers Below</h3>
                        {
                            // selectedArchitecture && 
                            // armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components.map((component, index) => (
                            //     <p
                            //         className='SelectedSolverNames'
                            //     >
                            //         {
                            //             selectedSolvers[index] ? 
                            //             armSolverNames[selectedSolvers[index] - 1]
                            //             : 
                            //             " "
                            //         }
                            //     </p>
                            // ))
                            currSelectedSolver &&
                            <>
                                <p>
                                    You selected {armSolverNames[currSelectedSolver - 1]}
                                    {selectedComponent && ` to build the ${selectedComponent}`}
                                </p>
                                <img className='SelectedSolverImage' src={armSolverImages[currSelectedSolver - 1]} alt='Solver Selected to build component' />
                            </>
                        }
                    </div>
                </div>

                <div className='Actions'>
                    <Button
                        disabled={!readyToPlay() || loading}
                        onClick={() => {
                            playRound();
                        }}
                    >
                        Play Round
                    </Button>
                </div>
            </div>

            <div className='SolverCards'>
                <div className='SolverCard'>
                    <h2>Mechanical Engineer</h2>
                    <img className='SolverImage' src={mechanicalEngineerIcon} alt='Mechanical Engineer' />
                    <p>High voltage hero.</p>
                    <Button
                        onClick={() => selectNewSolver(ArmSolver.MechanicalEngineer)}
                        disabled={!selectedArchitecture || !selectedComponent}
                        type={currSelectedSolver === ArmSolver.MechanicalEngineer ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>
                <div className='SolverCard'>
                    <h2>Materials Scientist</h2>
                    <img className='SolverImage' src={materialsScientistIcon} alt='Materials Scientist' />
                    <p>The stuff that matters.</p>
                    <Button
                        onClick={() => selectNewSolver(ArmSolver.MaterialsScientist)}
                        disabled={!selectedArchitecture || !selectedComponent}
                        type={currSelectedSolver === ArmSolver.MaterialsScientist ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Computer Scientist</h2>
                    <img className='SolverImage' src={computerScientistIcon} alt='Computer Scientist' />
                    <p>Virtually an engineer.</p>
                    <Button
                        onClick={() => selectNewSolver(ArmSolver.ComputerScientist)}
                        disabled={!selectedArchitecture || !selectedComponent}
                        type={currSelectedSolver === ArmSolver.ComputerScientist ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Industrial Systems Engineer</h2>
                    <img className='SolverImage' src={industrialSystemsEngineerIcon} alt='Industrial Systems Engineer' />
                    <p>Logistical legend.</p>
                    <Button
                        onClick={() => selectNewSolver(ArmSolver.IndustrialSystemsEngineer)}
                        disabled={!selectedArchitecture || !selectedComponent}
                        type={currSelectedSolver === ArmSolver.IndustrialSystemsEngineer ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>
            </div>
            {
                showMissionBeginModal &&
                <div className='Modal'
                // Can have click out here but they may not read
                >
                    <div className='ModalBody'>
                        <h2>The Mission Has Begun!</h2>
                        <p>
                            Here you will complete four rounds each with a unique objective. In each round you may select one architecture and any solver types you would like. Points are awarded for acheiving the objectives. The winner will be the agent with the most total points at the end of the mission.
                        </p>
                        <div className='ModalButtons'>
                            <Button onClick={() => setShowMissionBeginModal(false)}>Begin</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ArmGameScreen;