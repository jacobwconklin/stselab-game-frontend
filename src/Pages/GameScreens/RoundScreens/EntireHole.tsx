import { useState } from 'react';
import './EntireHole.scss';
import { Solver, solverNames  } from '../../../Utils/Simulation';
import { Button } from 'antd';
import { AmateurSolverCard, ProfessionalSolverCard, SpecialistSolverCard } from '../../../ReusableComponents/SolverCards';

// EntireHole
// Have players play on h_arch, which means they can only choose one type of solver for the
// entire hole for the course. This will show that professionals are usually the best for handling
// entire holes. It will also start to introduce that their are more options available than 
// traditional solutions.
const EntireHole = (props: {playingRound: Boolean, round: Number, 
        playRound: (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver ) => void}) => {

    
    // Only need one solver for h_arch
    const [selectedSolver, setSelectedSolver] = useState<Solver | null>(null);

    return (
        <div className='EntireHole'>
            <div className='Controls'>
                <div className='Instructions'>
                    <h1> Practice Round 3</h1>
                    <div className='InfoContainer'>
                        <p>In this practice round you may now select between different golfer types</p>
                        <p>Select one type of Golfer to play 5 holes</p>
                        {
                            selectedSolver && 
                            <h2>You Selected: {solverNames[selectedSolver - 1]}{selectedSolver > 1 ? 's' : ''}</h2>
                        }
                    </div>
                    {
                        selectedSolver &&
                        <Button 
                            onClick={() => props.playRound("h", selectedSolver)}
                            disabled={!!props.playingRound}
                        >
                            Play Round
                        </Button>
                    }
                </div>
                <div className='Solvers'>
                    <ProfessionalSolverCard select={setSelectedSolver} />
                    <SpecialistSolverCard select={setSelectedSolver} />
                    <AmateurSolverCard select={setSelectedSolver} />
                </div>
            </div>
        </div>
    )
}

export default EntireHole;