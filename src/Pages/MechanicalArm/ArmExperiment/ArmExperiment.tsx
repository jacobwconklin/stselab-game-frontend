import { useState } from 'react';
import './ArmExperiment.scss';
import ArmExperimentResults from './ArmExperimentResults';
import ArmExperimentGame from './ArmExperimentGame';
import { ArmSolver, armArchitectures, armSolverInformation, armSolverNames, runArmComponentSimulation } from '../../../Utils/ArmSimulation';
import { ArmComponentResult } from '../../../Utils/Types';


// Like free roam round of golf tournament, this allows players to try all breakdowns of the mechanical arm and all solvers
// to see how they perform.
const ArmExperiment = () => {

    
    // TODO need new types for mechanical arm results, solvers, etc. 
    const [allResults, setAllResults] = useState<ArmComponentResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [latestResult, setLatestResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTypedMessage, setShowTypedMessage] = useState(true);


    const runSimulation = (component: string, solver: ArmSolver) => {
        setLoading(true);
        const armComponentResult = runArmComponentSimulation(solver, component);
        const newResult = armSolverNames[solver - 1] + ' built the ' + component + ' with a weight of ' + armComponentResult.weight + ' kg and a cost of ' + armComponentResult.cost + ' dollars';
        setLatestResult(newResult);
        setAllResults([...allResults, armComponentResult]);
        setLoading(false);
    }

    const simulateAll = () => {
        setLoading(true);
        const newResults: ArmComponentResult[] = [];
        armArchitectures.forEach(architecture => {
            architecture.components.forEach(component => {
                armSolverInformation.forEach(solverInformation => {
                    const armComponentResult = runArmComponentSimulation(solverInformation.armSolver, component.component);
                    newResults.push(armComponentResult);
                });
            });
        });
        setAllResults([...allResults, ...newResults]);
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
                    simulateAll={simulateAll}
                    loading={loading}
                />
                :
                <ArmExperimentGame
                    latestResult={latestResult}
                    runSimulation={runSimulation}
                    simulateAll={simulateAll}
                    showResults={() => setShowResults(true)}
                    loading={loading}
                    showTypedMessage={showTypedMessage}
                    setShowTypedMessage={setShowTypedMessage}
                />
            }
        </div>
    )
}

export default ArmExperiment;