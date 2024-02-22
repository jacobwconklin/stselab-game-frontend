import { useState } from 'react';
import './EntireHole.scss';
import { Solver, solverNames } from '../../../Utils/Simulation';
import { Button } from 'antd';
import { AmateurSolverCard, ProfessionalSolverCard, SpecialistSolverCard } from '../../../ReusableComponents/SolverCards';
import professionalIcon from '../../../Assets/man-golfing-dark-skin-tone.svg';
import specialistIcon from '../../../Assets/woman-golfing-light-skin-tone.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';

// EntireHole
// Have players play on h_arch, which means they can only choose one type of solver for the
// entire hole for the course. This will show that professionals are usually the best for handling
// entire holes. It will also start to introduce that their are more options available than 
// traditional solutions.
const EntireHole = (props: {
    playingRound: Boolean, round: Number,
    playRound: (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => void
}) => {


    // Only need one solver for h_arch
    const [selectedSolver, setSelectedSolver] = useState<Solver | null>(null);

    return (
        <div className='EntireHole'>
            <div className='Controls'>
                <div className='Instructions'>
                    <h1> Practice Round 3</h1>
                    <div className='InformationHorizontalSplit'>
                        <div className='InfoContainer'>
                            <p>In this practice round you may now select between different golfer types</p>
                            {
                                selectedSolver ?
                                    <h2>You Selected: {solverNames[selectedSolver - 1]}{selectedSolver > 1 ? 's' : ''}</h2>
                                    :
                                    <p>Select one type of Golfer to play 5 holes</p>
                            }
                        </div>
                        <div className='SolverIcons'>
                            {
                                selectedSolver === Solver.Professional &&
                                <img className='ProfessionalIconImage' src={professionalIcon} alt="Professional Solver Icon" />
                            }
                            {
                                selectedSolver === Solver.Specialist &&
                                <div className='SpecialistIcons'>
                                    <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                    <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                    <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                </div>
                            }
                            {
                                selectedSolver === Solver.Amateur &&
                                <div className='AmateurIcons'>
                                    {
                                        Array.apply(null, Array(25)).map(() => (
                                            <img className='AmateurIconImage' src={amateurIcon} alt="Amateur Solver Icon" />
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div></div>
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