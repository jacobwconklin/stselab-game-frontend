import { useState } from 'react';
import FactoryBackground from '../../../ReusableComponents/FactoryBackground';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import './ArmExperimentGame.scss';
import { Button, Tooltip } from 'antd';
import computerScientistIcon from '../../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../../Assets/MechArm/chemist.svg';
import { ArmSolver, armArchitectures, armSolverImages, armSolverNames } from '../../../Utils/ArmSimulation';


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
    advanceRound: () => void
}) => {

    const [selectedSolver, setSelectedSolver] = useState<ArmSolver | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedArchitecture, setSelectedArchitecture] = useState<string>("");

    return (
        <div className="ArmExperimentGame">
            <FactoryBackground />
            <div className='Instructions'>
                <h1>Experimental Round</h1>

                {/** Horizontal layout */}
                <div className='HorizontalSections'>
                    <div className='Architectures'>
                        <h3>Pick An Architecture</h3>
                        {
                            // TODO add tooltip w/ descriptions
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
                        <h3>Pick A Component</h3>
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
                        <h3>Pick A Solver Below</h3>
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
                    <Button
                        onClick={() => props.advanceRound()}
                        type='primary'
                    >
                        End Experimental Round
                    </Button>
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
        </div>
    )
}

export default ArmExperimentGame;