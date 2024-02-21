import './ProfessionalOnly.scss';
import { Solver } from '../../../Utils/Simulation';
import { Button } from 'antd';
import { ProfessionalSolverCard } from '../../../ReusableComponents/SolverCards';

// ProfessionalOnly
// Have players play on h_arch with one professional to showcase the standard way problems are solved
const ProfessionalOnly = (props: {
    playingRound: Boolean, round: Number,
    playRound: (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => void
}) => {

    return (
        <div className='ProfessionalOnly'>
            <div className='Controls'>
                <div className='Instructions'>
                    <h1> Practice Round 1</h1>
                    <div className='InfoContainer'>
                        <p>In this first warm up round all players must use only the Professional golfer to play all 5 holes.</p>
                        <p>Click Play Round to run the simulation and view the results of the round.</p>
                        <h2>Professional Golfer Selected</h2>
                    </div>
                    <Button
                        onClick={() => props.playRound("h", Solver.Professional)}
                        disabled={!!props.playingRound}
                    >
                        Play Round
                    </Button>
                </div>
                <div className='Solvers'>
                    <ProfessionalSolverCard select={undefined} />
                </div>
            </div>
        </div>
    )
}

export default ProfessionalOnly;