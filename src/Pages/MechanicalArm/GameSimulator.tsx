

// Simulates the game controller and control flow between arm game screens and results
import { useState } from 'react';
import './GameSimulator.scss';
import { ArmRoundResult } from '../../Utils/Types';
import { RoundNames } from '../../Utils/Utils';
import ArmExperiment from './ArmExperiment/ArmExperiment';
import ArmFinalResults from './ArmFinalResults';
import { ArmSolver } from '../../Utils/ArmSimulation';
import ArmRoundResults from './ArmResults/ArmRoundResults';
import ArmGameScreen from './ArmGameScreen';

// Controls flow of game based on status of the player's session. If the session has not been started, it 
// displays the session screen showing all of the players in a the tournament. Once started, it will 
// allow users to play the game for the current round, and then see results for the round if they have finished.
// finally, when the session / tournament is over, it will show the final results of the tournament. From 
// there users can save the results and / or view total aggregate results of everyone who has played the game. 
// TODO may switch to web-socket connection with https://www.npmjs.com/package/react-use-websocket
const GameController = () => {

    // use to make sure user is in a valid session

    // TODO potentially move the calls for these results INTO the result components 
    // just as I moved playerlist out of sessionStatus and into waiting room call meaning only session round would have
    // to be polled here)
    const [currentResults, setCurrentResults] = useState<ArmRoundResult[]>([]);
    const [finalResults, setFinalResults] = useState<ArmRoundResult[]>([]);

    // When player finishes the current round allow them to see scores for the round
    const [finishedRound, setFinishedRound] = useState<Array<Boolean>>(Array.apply(false, Array(20)).map(val => !!val));

    const [currRound, setCurrRound] = useState<number>(RoundNames.ArmExperiment);

    const advanceRound = (): void => {
        setCurrRound(val => val + 1);
        const randomResults: ArmRoundResult[] = [
            {
                id: "1",
                architecture: "Entire Arm",
                solverOne: ArmSolver.IndustrialSystemsEngineer,
                weight: 50,
                cost: 70,
                score: 45,
                round: currRound
            },
            {
                id: "2",
                architecture: "Structure, Power, and Software",
                solverOne: ArmSolver.MechanicalEngineer,
                solverTwo: ArmSolver.ComputerScientist,
                solverThree: ArmSolver.MaterialsScientist,
                solverFour: ArmSolver.IndustrialSystemsEngineer,
                weight: 20,
                cost: 30,
                score: 85,
                round: currRound
            },
        ] 
        setCurrentResults(randomResults);
        setFinalResults(randomResults);
    }

    // start on experimental round
    if (currRound <= RoundNames.ArmExperiment) {
        return (
            <div className='GameController'>
                <ArmExperiment advanceRound={advanceRound} />
            </div>
        )
    }
    // then have player play 4 game rounds
    else if (currRound > RoundNames.ArmExperiment && currRound < RoundNames.ArmFinalResults) {
            if (!finishedRound[currRound]) {
                return (
                    <div className='GameController'>
                        <ArmGameScreen 
                            finishedRounds={finishedRound} 
                            setFinishedRound={setFinishedRound} 
                            round={currRound}
                        />                    
                    </div>
                )
            } else {
                return (
                    <div className='GameController'>
                        <ArmRoundResults 
                            round={currRound} 
                            players={[]} 
                            results={currentResults}
                        />
                    </div>
                )
            }
    }
    // then show final results
    else {
        return (
            <div className='GameController'>
                <ArmFinalResults results={finalResults} />
            </div>
        )
    }
}

export default GameController;