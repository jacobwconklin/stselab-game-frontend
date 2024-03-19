import { useState } from 'react';
import FactoryBackground from '../../../ReusableComponents/FactoryBackground';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import './ArmExperiment.scss';
import { Button } from 'antd';
import mechArm from '../../../Assets/MechArm/orange-arm.png';
import computerScientistIcon from '../../../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../../../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../../../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../../../Assets/MechArm/chemist.svg';
import ArmExperimentResults from './ArmExperimentResults';
import ArmExperimentGame from './ArmExperimentGame';


// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperiment = () => {

    
    // TODO need new types for mechanical arm results, solvers, etc. 
    const [allResults, setAllResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [latestResult, setLatestResult] = useState('');
    const [loading, setLoading] = useState(false);

    const runSimulation = (component: any, solver: any) => {
        setLoading(true);
        const newResult = solver + ' built the ' + component + 'with a weight of ' + Math.floor(Math.random() * 100) + ' kg and a cost of ' + Math.floor(Math.random() * 100) + ' dollars';
        setLatestResult(newResult);
        setAllResults([...allResults, newResult]);
        setLoading(false);
    }

    const simulateAll = () => {
        setLoading(true);
        setLatestResult('All components built by each solver. Click View Results to see how they performed.');
        setLoading(false);
    }

    return (
        <div className="ArmExperiment">
            {
                showResults ?
                <ArmExperimentResults 
                    results={allResults}
                    hideResults={() => setShowResults(false)}
                />
                :
                <ArmExperimentGame
                    latestResult={latestResult}
                    runSimulation={runSimulation}
                    simulateAll={simulateAll}
                    showResults={() => setShowResults(true)}
                    loading={loading}
                />
            }
        </div>
    )
}

export default ArmExperiment;