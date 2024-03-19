import './FactoryBackground.scss';
import arm from '../Assets/MechArm/orange-arm.png';

// Background for the Mechanical Arm game
const FactoryBackground = () => {


    return (
        <div className="FactoryBackground">
            <div className='ScrollingBackground'></div>
            <div className='ConveyorBelt'></div>
            <img className='Arm' src={arm} alt='Mechanical Arm' />
        </div>
    );
}

export default FactoryBackground;