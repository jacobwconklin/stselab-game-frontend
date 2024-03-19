import './PlayScreen.scss';
import { Solver, runDAP, runDS, runLP, runSimEntireHole } from '../../Utils/Simulation';
import { useContext, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { UserContext } from '../../App';
import PlayGolfBackground from '../../ReusableComponents/PlayGolfBackground';
import TournamentStage from './RoundScreens/TournamentStage';
import ProfessionalOnly from './RoundScreens/ProfessionalOnly';
import AmateurOnly from './RoundScreens/AmateurOnly';
import EntireHole from './RoundScreens/EntireHole';
import { RoundNames, scoreRound } from '../../Utils/Utils';
import { UserContextType } from '../../Utils/Types';
import FactoryBackground from '../../ReusableComponents/FactoryBackground';

// PlayScreen
const PlayScreen = (props: {round: number, setFinishedRound: (val: Array<Boolean>) => void, finishedRounds: Array<Boolean>}) => {

    // prevent players from clicking play round multiple times
    const [playingRound, setPlayingRound] = useState(false);

    // pull playerId from Context
    const { playerId, playerColor, customPerformanceWeight } = useContext(UserContext) as UserContextType;

    const updateFinishedRounds = () => {
        const copy = props.finishedRounds;
        copy[props.round] = true;
        props.setFinishedRound(copy);
    }

    // Plays round with selected solver
    const playRound = async (architecture: string, solver1: Solver, solver2?: Solver, solver3?: Solver) => {

        try {
            setPlayingRound(true);
            let score = { shots: 0, cost: 0 };
            if (architecture === 'h') {
                score = await runSimEntireHole(solver1);
            } else if (architecture === 'ds' && solver2) {
                score = await runDS(solver1, solver2);
            } else if (architecture === 'lp' && solver2) {
                score = await runLP(solver1, solver2);
            } else if (architecture === 'dap' && solver2 && solver3) {
                score = await runDAP(solver1, solver2, solver3);
            } else {
                alert("Error playing round, please try again");
                setPlayingRound(false);
                return;
            }

            const pointsEarned = scoreRound(props.round, score.shots, score.cost, customPerformanceWeight);

            // save score to database and record that player has completed the round
            const response = await postRequest('player/roundResult', JSON.stringify({
                playerId,
                shots: score.shots,
                cost: Math.floor(score.cost * 100),
                architecture,
                solverOne: solver1,
                solverTwo: solver2,
                solverThree: solver3,
                round: props.round,
                score: pointsEarned !== null ? Math.floor( pointsEarned * 100) : null
            }));
            if (response.success) {
                updateFinishedRounds();
            } else {
                alert("Error playing round, please try again");
                console.error(response);
                setPlayingRound(false);
            }
        } catch (error) {
            console.error("Error playing round: ", error)
            setPlayingRound(false);
        }
    }

    // Rounds allow the host to move the game forward and change the screen displayed for all players.
    // Rounds will work like this: 
    // First: round 0 -> wait room
    // Second: round 1 -> play h arch only professional
    // Third: round 2 -> play h arch with single Amateur
    // Fourth: round 3 -> play h arch all solvers
    // Fifth: round 4 -> jump to experimental round
    // Sixth: round 5 -> experimental round survey
    // Seventh: round 6 -> play Tournament Stage 1 (best performance)
    // Eigth: round 7 -> Play Tournament Stage 2 (minimize cost for 35 strokes)
    // Ninth: round 8 -> Play Tournament Stage 3 (balance)
    // Tenth: round 9 -> Play Tournament Stage 4 (custom reward function)
    // Eleventh: round 10 -> Show final Tournament Results

    return (
        <div className='PlayScreen'>
            {
                props.round <= RoundNames.TournamentStage4 ?
                <PlayGolfBackground playerColor={playerColor} />
                :
                <FactoryBackground />
            }
            {
                props.round === RoundNames.PracticeHArchPro &&
                <ProfessionalOnly disablePlayRound={() => setPlayingRound(true)} round={props.round} playingRound={playingRound} playRound={playRound} />
            }
            {
                props.round === RoundNames.PracticeHArchAmateur &&
                <AmateurOnly round={props.round} />
            }
            {
                props.round === RoundNames.PracticeHArchAll &&
                <EntireHole disablePlayRound={() => setPlayingRound(true)} round={props.round} playingRound={playingRound} playRound={playRound} />
            }
            {
                props.round >= RoundNames.TournamentStage1 &&
                <TournamentStage disablePlayRound={() => setPlayingRound(true)} round={props.round} playingRound={playingRound} playRound={playRound} />
            }
        </div>
    )
}

export default PlayScreen;