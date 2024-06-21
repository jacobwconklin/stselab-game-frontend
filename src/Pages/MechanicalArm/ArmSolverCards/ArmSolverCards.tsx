import { ArmSolver, armSolverInformation } from '../../../Utils/ArmSimulation';
import './ArmSolverCards.scss';


const ArmSolverCards = (props: { selectSolver: (solver: ArmSolver) => void }) => {



    return (
        <div className='SolverCards'>
            {
                armSolverInformation.map((solver, index) => (
                    <div className='SolverCard' key={index}
                        onClick={() => props.selectSolver(solver.armSolver)}
                    >
                        <h2>{solver.name}</h2>
                        <img className='SolverImage' src={solver.image} alt={solver.name} />
                        <p>{solver.description}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ArmSolverCards;