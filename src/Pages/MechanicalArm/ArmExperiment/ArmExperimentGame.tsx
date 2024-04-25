import { useContext, useState } from 'react';
import FactoryBackground from '../../../ReusableComponents/FactoryBackground';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import './ArmExperimentGame.scss';
import { Button, Tooltip } from 'antd';
import computerScientistIcon from '../../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../../Assets/MechArm/chemist.svg';
import { ArmSolver, armArchitectures, armSolverImages, armSolverNames } from '../../../Utils/ArmSimulation';
import { UserContext } from '../../../App';
import { UserContextType } from '../../../Utils/Types';
import { advanceSession } from '../../../Utils/Api';
import VerificationModal from '../../../ReusableComponents/VerificationModal';


// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperimentGame = (props: {
    latestResult: string,
    runSimulation: (component: string, solver: ArmSolver) => void,
    simulateAll: () => void,
    showResults: () => void,
    loading: boolean,
    showTypedMessage: boolean,
    setShowTypedMessage: (show: boolean) => void,
}) => {

    const {isHost, sessionId} = useContext(UserContext) as UserContextType;

    const [selectedSolver, setSelectedSolver] = useState<ArmSolver | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedArchitecture, setSelectedArchitecture] = useState<string>("");
    const [hostClickedAdvanceSession, setHostClickedAdvanceSession] = useState<Boolean>(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    return (
        <div className="ArmExperimentGame">
            <FactoryBackground />
            <div className='Instructions'>
                <h1>Exploration Round
                    <Button className='InfoButtonHolder' onClick={() => props.setShowTypedMessage(true)}>
                        &nbsp;
                        <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </h1>

                {/** Horizontal layout */}
                <div className='HorizontalSections'>
                    <div className='Architectures'>
                        <h3>1. Pick An Architecture</h3>
                        {
                            armArchitectures.map((architecture, index) => (
                                <Tooltip title={architecture.description} key={index} placement='right'>
                                    <Button
                                        onClick={() => setSelectedArchitecture(architecture.architecture)}
                                        type={selectedArchitecture === architecture.architecture ? "primary" : "default"}
                                    >
                                        {architecture.architecture}
                                    </Button>
                                </Tooltip>
                            ))
                        }
                    </div>

                    <div className='Components'>
                        <h3>2. Pick A Component</h3>
                        {
                            selectedArchitecture &&
                            <>
                                {
                                    armArchitectures.find(arch => arch.architecture === selectedArchitecture)?.components.map((component, index) => (
                                        <Tooltip title={component.description} key={index} placement='right'>
                                            <Button
                                                onClick={() => setSelectedComponent(component.component)}
                                                type={selectedComponent === component.component ? "primary" : "default"}
                                            >
                                                {component.component}
                                            </Button>
                                        </Tooltip>
                                    ))
                                }
                            </>
                        }
                    </div>

                    <div className='SolverSelection'>
                        <h3>3. Pick A Solver Below</h3>
                        {
                            selectedSolver &&
                            <>
                                <p>
                                    You selected {armSolverNames[selectedSolver - 1]}
                                    {selectedComponent && ` to build the ${selectedComponent}`}
                                </p>
                                <img className='SelectedSolverImage' src={armSolverImages[selectedSolver - 1]} alt='Solver Selected to build component' />
                            </>
                        }
                    </div>
                </div>

                <div className='Actions'>
                    <Button
                        disabled={!selectedArchitecture || !selectedComponent || !selectedSolver || props?.loading}
                        onClick={() => {
                            if (selectedSolver && selectedComponent) props.runSimulation(selectedComponent, selectedSolver);
                        }}
                    >
                        Run Experiment
                    </Button>
                    <Button
                        onClick={() => props.simulateAll()}
                        disabled={props?.loading}
                    >
                        Simulate All
                    </Button>
                    <Button
                        onClick={() => props.showResults()}
                    >
                        View Results
                    </Button>
                    {
                        isHost &&
                        <Button
                            disabled={!!hostClickedAdvanceSession}
                            onClick={() => setShowVerificationModal(true)}
                            type='primary'
                        >
                            End Exploration Round
                        </Button>
                    }
                </div>

                {
                    props?.latestResult &&
                    <p>Result: {props?.latestResult}</p>
                }
            </div>

            <div className='SolverCards'>
                <div className='SolverCard'>
                    <h2>Mechanical Engineer</h2>
                    <img className='SolverImage' src={mechanicalEngineerIcon} alt='Mechanical Engineer' />
                    <p>High voltage hero.</p>
                    <Button
                        onClick={() => setSelectedSolver(ArmSolver.MechanicalEngineer)}
                        type={selectedSolver === ArmSolver.MechanicalEngineer ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>
                <div className='SolverCard'>
                    <h2>Materials Scientist</h2>
                    <img className='SolverImage' src={materialsScientistIcon} alt='Materials Scientist' />
                    <p>The stuff that matters.</p>
                    <Button
                        onClick={() => setSelectedSolver(ArmSolver.MaterialsScientist)}
                        type={selectedSolver === ArmSolver.MaterialsScientist ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Computer Scientist</h2>
                    <img className='SolverImage' src={computerScientistIcon} alt='Computer Scientist' />
                    <p>Virtually an engineer.</p>
                    <Button
                        onClick={() => setSelectedSolver(ArmSolver.ComputerScientist)}
                        type={selectedSolver === ArmSolver.ComputerScientist ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Industrial Systems Engineer</h2>
                    <img className='SolverImage' src={industrialSystemsEngineerIcon} alt='Industrial Systems Engineer' />
                    <p>Logistical legend.</p>
                    <Button
                        onClick={() => setSelectedSolver(ArmSolver.IndustrialSystemsEngineer)}
                        type={selectedSolver === ArmSolver.IndustrialSystemsEngineer ? "primary" : "default"}
                    >
                        Select
                    </Button>
                </div>
            </div>
            {
                props.showTypedMessage &&
                <TypedMessage type={"arm"} confirm={() => props.setShowTypedMessage(false)} />
            }
            {
                showVerificationModal &&
                <VerificationModal
                    title="Are you sure you end the Experimental Round?"
                    message="This will end the experiment for all players and begin the Mission."
                    confirm={() => advanceSession(sessionId, setHostClickedAdvanceSession)}
                    cancel={() => setShowVerificationModal(false)}
                />
            }
        </div>
    )
}

export default ArmExperimentGame;