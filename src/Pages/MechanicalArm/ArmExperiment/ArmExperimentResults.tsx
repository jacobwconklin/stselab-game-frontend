import { Button } from 'antd';
import SpaceBackground from '../../../ReusableComponents/SpaceBackground';
import './ArmExperimentResults.scss';

// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperimentResults = (props: {
    results: any[],
    hideResults: () => void,
}) => {

    return (
        <div className="ArmExperimentResults">
            <SpaceBackground />
            <div className='Instructions'>
                <h1>Experiment Results</h1>
                <Button
                    onClick={() => props.hideResults()}
                >Back</Button>
            </div>
            
        </div>
    )
}

export default ArmExperimentResults;