import './ArmGameScreen.scss';
import arm from '../../Assets/MechArm/orange-arm.png';
import { Button, Radio, Tooltip } from "antd";
import FactoryBackground from '../../ReusableComponents/FactoryBackground';
// The screen shown while playing the Mechanical Arm game
const ArmGameScreen = () => {

    const architectureDescriptions = [
        {
            name: 'SAR',
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
        // setSelectedDriveSolver(null);
        // setSelectedLongSolver(null);
        // setSelectedFairwaySolver(null);
        // setSelectedShortSolver(null);
        // setSelectedPuttSolver(null);
    }

    return (
        <div className="ArmGameScreen">
            <FactoryBackground />
            <div className='Instructions'>
                <h1>Build Your Mechanical Arm</h1>
                <h3>Select One Architecture</h3>
                <Radio.Group defaultValue='h' buttonStyle='solid'>
                    {
                        architectureDescriptions.map((arch) => (
                            <Tooltip title={arch.description} key={arch.name}>
                                <Radio.Button
                                    onClick={() => {
                                        // TODO decide if changing architecture should clear selections or not
                                        clearSelectedSolvers();
                                    }}
                                    value={arch.architecture}
                                >
                                    {arch.name}
                                    <svg width="18" height="18" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Radio.Button>
                            </Tooltip>
                        ))
                    }
                </Radio.Group>
                <h3>Select One Solver for each Component</h3>
                <div className='Modules'>
                    <div className='Module'>
                        <Button>Base</Button>
                        <p>Choose the best material for the base of the arm.</p>
                    </div>
                    <div className='Module'>
                        <Button>Elbow</Button>
                        <p>Choose the best material for the elbow of the arm.</p>
                    </div>
                    <div className='Module'>
                        <Button>Wrist</Button>
                        <p>Choose the best material for the wrist of the arm.</p>
                    </div>
                    <div className='Module'>
                        <Button>Hand</Button>
                        <p>Choose the best material for the hand of the arm.</p>
                    </div>
                    <div className='Module'>
                        <Button>Brain</Button>
                        <p>Choose the best material for the hand of the arm.</p>
                    </div>
                </div>
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
        </div>
    );
}

export default ArmGameScreen;