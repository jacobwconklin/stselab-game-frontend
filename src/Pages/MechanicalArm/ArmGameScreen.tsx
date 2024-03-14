import './ArmGameScreen.scss';
import arm from '../../Assets/MechArm/orange-arm.png';
import { Button, Tooltip } from "antd";
import FactoryBackground from './FactoryBackground';
// The screen shown while playing the Mechanical Arm game
const ArmGameScreen = () => {


    return (
        <div className="ArmGameScreen">
            <FactoryBackground />
            <div className='Instructions'>
                <h1>Build a Mechanical Arm</h1>
                <p>Pick specialists for building each portion of the arm to produce optimal results.</p>
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