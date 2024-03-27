import './ArmGameScreen.scss';
import { Button, Tooltip } from "antd";
import computerScientistIcon from '../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../Assets/MechArm/chemist.svg';
import FactoryBackground from '../../ReusableComponents/FactoryBackground';
import { ArmSolver, armArchitectures, armSolverImages, armSolverNames } from '../../Utils/ArmSimulation';
import { useState } from 'react';
// The screen shown while playing the Mechanical Arm game
const ArmGameScreen = (props: {
    setFinishedRound: (val: Array<Boolean>) => void, 
    finishedRounds: Array<Boolean>
    round: number
}) => {

    const updateFinishedRounds = () => {
        const copy = props.finishedRounds;
        copy[props.round] = true;
        props.setFinishedRound(copy);
        console.log(copy);
    }

    const [selectedSolvers, setSelectedSolvers] = useState<ArmSolver[]>([]);
    const [currSelectedSolver, setCurrSelectedSolver] = useState<ArmSolver | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedArchitecture, setSelectedArchitecture] = useState<string>("");
    const [loading, setLoading] = useState(false);

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
    }

    const selectNewArchitecture = (architecture: string) => {
        setSelectedArchitecture(architecture);
        clearSelectedSolvers();
        setCurrSelectedSolver(null);
        setSelectedComponent("");
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

    const playRound = () => {
        setLoading(true);
        console.log("Playing round on architecture: ", selectedArchitecture, " with solvers: ", selectedSolvers);
        setTimeout(() => {
            setLoading(false);
            updateFinishedRounds();
        }, 2000);
    }

    return (
        <div className="ArmGameScreen">
            <FactoryBackground />
            <div className='Instructions'>
                <div className='TitleAndIcons'>
                    <h1>
                        Round 1
                    </h1>
                    {
                        selectedSolvers.map((solver, index) => (
                            <img className='HeaderSolverIcon' src={armSolverImages[solver - 1]} alt='Solver Icon' key={index} />
                        ))
                    }    
                </div>
                <p>
                    Objective: Build the lightest mechanical arm at any cost.
                </p>
                {/** Horizontal layout */}
                <div className='HorizontalSections'>
                    <div className='Architectures'>
                        <h3>Pick An Architecture</h3>
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
                        <h3>Pick A Component</h3>
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
                        <h3>Pick Solvers Below</h3>
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
        </div>
    );
}

export default ArmGameScreen;