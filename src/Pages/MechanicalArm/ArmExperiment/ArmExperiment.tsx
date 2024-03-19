import { useState } from 'react';
import FactoryBackground from '../../../ReusableComponents/FactoryBackground';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import './ArmExperiment.scss';
import { Button } from 'antd';
import mechArm from '../../../Assets/MechArm/orange-arm.png';
import arm from '../../../Assets/MechArm/orange-arm.png';


// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperiment = () => {

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
    const [latestResult, setLatestResult] = useState("Electrical Engineer built the Entire Arm weighing 10kg and costing $1000");

    // TODO need new types for mechanical arm results, solvers, etc. 
    const [allResults, setAllResults] = useState<any[]>([]);

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
        <div className="ArmExperiment">
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
                                <img className='SelectedSolverImage' src={arm} alt='Solver Selected to build component' />
                            </>
                        }
                    </div>
                </div>

                <div className='Actions'>
                    <Button
                        disabled={!selectedArchitecture || !selectedComponent || !selectedSolver}
                    >
                        Run Experiment
                    </Button>
                    <Button>
                        View Results
                    </Button>
                </div>

                {
                    latestResult &&
                    <p>Result: {latestResult}</p>
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
                    <h2>Electrical Engineer</h2>
                    <img className='SolverImage' src={arm} alt='Electrical Engineer' />
                    <p>High voltage hero.</p>
                    <Button
                        onClick={() => setSelectedSolver("Electrical Engineer")}
                    >
                        Select
                    </Button>
                </div>
                <div className='SolverCard'>
                    <h2>Materials Scientist</h2>
                    <img className='SolverImage' src={arm} alt='Materials Scientist' />
                    <p>The stuff that matters.</p>
                    <Button
                        onClick={() => setSelectedSolver("Materials Scientist")}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Computer Scientist</h2>
                    <img className='SolverImage' src={arm} alt='Computer Scientist' />
                    <p>Virtually an engineer.</p>
                    <Button
                        onClick={() => setSelectedSolver("Computer Scientist")}
                    >
                        Select
                    </Button>
                </div>

                <div className='SolverCard'>
                    <h2>Industrial Systems Engineer</h2>
                    <img className='SolverImage' src={arm} alt='Industrial Systems Engineer' />
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

export default ArmExperiment;