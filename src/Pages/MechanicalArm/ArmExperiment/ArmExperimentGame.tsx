import { useState } from 'react';
import FactoryBackground from '../../../ReusableComponents/FactoryBackground';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import './ArmExperimentGame.scss';
import { Button } from 'antd';
import mechArm from '../../../Assets/MechArm/orange-arm.png';
import computerScientistIcon from '../../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../../Assets/MechArm/chemist.svg';
import { loadavg } from 'os';


// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperimentGame = (props: {
    latestResult: string,
    runSimulation: (component: any, solver: any) => void,
    simulateAll: () => void,
    showResults: () => void,
    loading: boolean
}) => {

    /**
    
    1. (entire arm)
        SRA smart robotic arm = entrie arm

    2. (smart arm and base)
        SFA smart fine-positioning arm = arm
        SAM smart attatchment mechanism = base

    3. (arm and smart base)
        SCA smart coarse-position arm = also arm ? 
        SPAM smart positioning and attatchment mechanism = also base ?

    4. (structure, power, and software)
        EMA electro-mechanical arm = mechanical system
        CDPD command, data and power distribution system = power supply 
        RASA robotic arm software architecture = Brain for basic actions (attatch, pan, tilt, stow) 
        PSA positioning software architecture = Move arm to precise location avoiding ISS 
     
    */

    const [showTypedMessage, setShowTypedMessage] = useState(false);
    const [selectedSolver, setSelectedSolver] = useState<string | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [selectedArchitecture, setSelectedArchitecture] = useState<string | null>(null);

    // TODO use description as a tooltip
    const components = [
        {
            name: "Entire Arm",
            description: "This is the entire arm that will be built. This means one Solver type will be assigned to complete all aspects of the arm.",
            image: mechArm
        },
        {
            name: "Arm",
            description: "This is the entire arm that will be built. This means one Solver type will be assigned to complete all aspects of the arm.",
            image: mechArm
        },
        {
            name: "Base",
            description: "This is the entire arm that will be built. This means one Solver type will be assigned to complete all aspects of the arm.",
            image: mechArm
        },
    ]

    const architectures = [
        {
            name: "Entire Arm",
            description: "This is the entire arm that will be built. This means one Solver type will be assigned to complete all aspects of the arm.",
            components: ["Entire Arm"]
        },
        {
            name: "Smart Arm and Base",
            description: "This breaks construction down into developing a smart arm component and a simple base component.",
            components: ["Smart Arm", "Base"]
        },
        {
            name: "Arm and Smart Base",
            description: "This breaks construction down into developing a smart base component and a simple arm component.",
            components: ["Arm", "Smart Base"]
        },
        {
            name: "Structure, Power, and Software",
            description: "This breaks construction down into developing a mechanical structure, a power supply, a software system to handle major actions, and a software system to handle precise positioning of the arm",
            components: ["Mechanical System", "Power Supply", "Action Software", "Positioning Software"]
        }
    ]

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
                            architectures.map((architecture, index) => (
                                <Button
                                    key={index}
                                    onClick={() => setSelectedArchitecture(architecture.name)}
                                    type={selectedArchitecture === architecture.name ? "primary" : "default"}
                                >
                                    {architecture.name}
                                </Button>
                            ))
                        }
                    </div>

                    <div className='Components'>
                        <h3>Pick A Component</h3>
                        {
                            selectedArchitecture &&
                            <>
                            {
                                architectures.find(arch => arch.name === selectedArchitecture)?.components.map((component, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => setSelectedComponent(component)}
                                        type={selectedComponent === component ? "primary" : "default"}
                                    >
                                        {component}
                                    </Button>
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
                                    You selected {selectedSolver} 
                                    {selectedComponent && ` to build the ${selectedComponent}`}
                                </p>
                                <img className='SelectedSolverImage' src={mechanicalEngineerIcon} alt='Solver Selected to build component' />
                            </>
                        }
                    </div>
                </div>

                <div className='Actions'>
                    <Button
                        disabled={!selectedArchitecture || !selectedComponent || !selectedSolver || props?.loading}
                        onClick={() => props.runSimulation(selectedComponent, selectedSolver)}
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
                </div>

                {
                    props?.latestResult &&
                    <p>Result: {props?.latestResult}</p>
                }


                {/** Vertical layout */}
                {/* 
                <div className='Architectures'>
                    <Button>
                        Entire Arm
                    </Button>
                    <Button>
                        Smart Arm and Base
                    </Button>
                    <Button>
                        Arm and Smart Base
                    </Button>
                    <Button>
                        Structure, Power, Software
                    </Button>

                </div>
                <div className='Components'>
                    {
                        components.map((component, index) => (
                            <div className='Component' key={index}>
                                <h3>{component.name}</h3>
                                <Button>Select</Button>
                                <img className='ComponentImage' src={component.image} alt={component.name} />
                            </div>
                        ))
                    }
                </div>

                <div className='SelectionAndActions'>
                    <h3>
                        {selectedComponent && selectedSolver ? 
                        `You selected ${selectedSolver} to build the ${selectedComponent}` 
                        : "Select a Component and a Solver to Experiment"}
                    </h3>
                    <Button>
                        Run Experiment
                    </Button>
                    <Button>
                        View Results
                    </Button>
                </div>

                {
                    latestResult &&
                    <p>Result: {latestResult}</p>
                } */}
            </div>

            <div className='SolverCards'>
                <div className='SolverCard'>
                    <h2>Mechanical Engineer</h2>
                    <img className='SolverImage' src={mechanicalEngineerIcon} alt='Mechanical Engineer' />
                    <p>High voltage hero.</p>
                    <Button
                        onClick={() => setSelectedSolver("Mechanical Engineer")}
                    >
                        Select
                    </Button>
                </div>
                <div className='SolverCard'>
                    <h2>Materials Scientist</h2>
                    <img className='SolverImage' src={materialsScientistIcon} alt='Materials Scientist' />
                    <p>The stuff that matters.</p>
                    <Button
                        onClick={() => setSelectedSolver("Materials Scientist")}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Computer Scientist</h2>
                    <img className='SolverImage' src={computerScientistIcon} alt='Computer Scientist' />
                    <p>Virtually an engineer.</p>
                    <Button
                        onClick={() => setSelectedSolver("Computer Scientist")}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Industrial Systems Engineer</h2>
                    <img className='SolverImage' src={industrialSystemsEngineerIcon} alt='Industrial Systems Engineer' />
                    <p>Logistical legend.</p>
                    <Button
                        onClick={() => setSelectedSolver("Industrial Systems Engineer")}
                    >
                        Select
                    </Button>
                </div>
            </div>

            {
                showTypedMessage &&
                <TypedMessage type={"arm"} confirm={() => setShowTypedMessage(false)} />
            }
        </div>
    )
}

export default ArmExperimentGame;