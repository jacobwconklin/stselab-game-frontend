import './ProfessionalOnly.scss';
import { Solver } from '../../../Utils/Simulation';
import { Button } from 'antd';
// import { ProfessionalSolverCard } from '../../../ReusableComponents/SolverCards';
import professionalIcon from '../../../Assets/man-golfing-dark-skin-tone.svg';
import { animateBallIntoHole } from '../../../Utils/Utils';
import TypedMessage from '../../../ReusableComponents/TypedMessage';
import { useState } from 'react';

// ProfessionalOnly
// Have players play on h_arch with one professional to showcase the standard way problems are solved
const ProfessionalOnly = (props: {
    playingRound: Boolean, round: Number,
    playRound: (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => void,
    disablePlayRound: () => void
}) => {

    const [showTypedMessage, setShowTypedMessage] = useState(true)

    const playRoundCallback = () => {
        props.playRound("h", Solver.Professional)
    }

    return (
        <div className='ProfessionalOnly'>
            <div className='Controls'>
                <div className='Instructions'>
                    <h1> 
                        Practice Round 1: One Professional
                        <Button className='InfoButtonHolder' onClick={() => setShowTypedMessage(true)}>
                            &nbsp;
                            <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </h1>
                    <div className='InformationHorizontalSplit'>
                        <div className='InfoContainer'>
                            <p>
                                In this first warm up round all players must use only the Professional golfer to play all 5 holes. 
                                Here, the Professional represents a domain-expert organization (e.g., NASA). The golf course represents a complex systems development task. Professional trying to navigate the entire course is an analogy to how complex system development tasks are handled in the industry, when problems are not decomposed.
                            </p>
                            <p>Click Play Round to run the simulation and view the results of the round.</p>
                        </div>
                        <img className='SingleIcon' src={professionalIcon} alt="Professional Solver Icon" />
                        <br></br>
                    </div>
                    <Button
                        onClick={() => {
                            props.disablePlayRound();
                            animateBallIntoHole(playRoundCallback)
                        }}
                        disabled={!!props.playingRound}
                    >
                        Play Round
                    </Button>
                </div>
            </div>
            {
                showTypedMessage &&
                <TypedMessage type={"golf"} confirm={() => setShowTypedMessage(false)} />
            }
        </div>
    )
}

export default ProfessionalOnly;