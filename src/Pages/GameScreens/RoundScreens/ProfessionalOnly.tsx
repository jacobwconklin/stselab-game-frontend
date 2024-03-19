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
                    <h1> Practice Round 1: One Professional</h1>
                    <div className='InformationHorizontalSplit'>
                        <div className='InfoContainer'>
                            <p>
                                In this first warm up round all players must use only the Professional golfer to play all 5 holes. The Professional represents the traditional way of solving ISE problems by handing the entire problem, here the golf course, to a professional organization to handle everything.
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