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

    const [showTypedMessage, setShowTypedMessage] = useState(true);
    const [selectedSolver, setSelectedSolver] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [latestResult, setLatestResult] = useState("Electrical Engineer built the Entire Arm weighing 10kg and costing $1000");

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

    return (
        <div className="ArmExperiment">
            <FactoryBackground />
            <div className='Instructions'>
                <h1>Experimental Round</h1>
                <p>
                    In this round you can experiment with different solver types and components to see how they perform.
                </p>
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
                                {/* <p>{component.description}</p> */}
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
                }
            </div>

            <div className='SolverCards'>
                <div className='SolverCard'>
                    <h2>Electrical Engineer</h2>
                    <img className='SolverImage' src={arm} alt='Electrical Engineer' />
                    <p>High voltage hero.</p>
                    <Button

                    >
                        Select
                    </Button>
                </div>
                <div className='SolverCard'>
                    <h2>Materials Scientist</h2>
                    <img className='SolverImage' src={arm} alt='Electrical Engineer' />
                    <p>The stuff that matters.</p>
                    <Button

                    >
                        Select
                    </Button>
                </div>
                
                <div className='SolverCard'>
                    <h2>Computer Scientist</h2>
                    <img className='SolverImage' src={arm} alt='Electrical Engineer' />
                    <p>Virtually an engineer.</p>
                    <Button

                    >
                        Select
                    </Button>
                </div>
                
                <div className='SolverCard'>
                    <h2>Industrial Systems Engineer</h2>
                    <img className='SolverImage' src={arm} alt='Electrical Engineer' />
                    <p>Logistical legend.</p>
                    <Button

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