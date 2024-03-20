import './SpaceBackground.scss';
import iss from '../Assets/MechArm/ISS.png';

const SpaceBackground = () => {

    return (
        <div className="SpaceBackground">
            {/* TODO could add layers of png stars that aren't fixed so some stars scroll with you.. */}
            {/* Have ISS png that drifts across the screen */}
            <div className='Space'></div>
            <div className='ISSHolder'>
                <img className='ISS' src={iss} alt='International Space Station' />
            </div>
        </div>
    );
}

export default SpaceBackground;