

// Simulates the game controller and control flow between arm game screens and results
import { useEffect, useState } from 'react';
import './GameSimulator.scss';
import { ArmFinalResult, ArmRoundResult } from '../../Utils/Types';
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


    const tempFakeFinalResults: ArmFinalResult[] = [
        {
            id: "1",
            name: "Player 1",
            color: 'blue',
            scores: [
                {
                    round: 1,
                    score: 45,
                    weight: 50,
                    cost: 70,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
                {
                    round: 2,
                    score: 85,
                    weight: 20,
                    cost: 30,
                    solverOne: ArmSolver.MechanicalEngineer,
                    solverTwo: ArmSolver.ComputerScientist,
                    solverThree: ArmSolver.MaterialsScientist,
                    solverFour: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Structure, Power, and Software"
                },
                {
                    round: 3,
                    score: 45,
                    weight: 50,
                    cost: 70,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
                {
                    round: 4,
                    score: 85,
                    weight: 20,
                    cost: 30,
                    solverOne: ArmSolver.MechanicalEngineer,
                    solverTwo: ArmSolver.ComputerScientist,
                    solverThree: ArmSolver.MaterialsScientist,
                    solverFour: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Structure, Power, and Software"
                }
            ]
        },
        {
            id: "1",
            name: "Player 2",
            color: 'green',
            scores: [
                {
                    round: 1,
                    score: 47,
                    weight: 57,
                    cost: 77,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
                {
                    round: 2,
                    score: 88,
                    weight: 28,
                    cost: 38,
                    solverOne: ArmSolver.MechanicalEngineer,
                    solverTwo: ArmSolver.ComputerScientist,
                    solverThree: ArmSolver.MaterialsScientist,
                    solverFour: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Structure, Power, and Software"
                },
                {
                    round: 3,
                    score: 49,
                    weight: 59,
                    cost: 79,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
                {
                    round: 4,
                    score: 82,
                    weight: 22,
                    cost: 32,
                    solverOne: ArmSolver.MechanicalEngineer,
                    solverTwo: ArmSolver.ComputerScientist,
                    solverThree: ArmSolver.MaterialsScientist,
                    solverFour: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Structure, Power, and Software"
                }
            ]
        },
        {
            id: "1",
            name: "Player 3",
            color: 'red',
            scores: [
                {
                    round: 1,
                    score: 12,
                    weight: 98,
                    cost: 76,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
                {
                    round: 2,
                    score: 85,
                    weight: 20,
                    cost: 30,
                    solverOne: ArmSolver.MechanicalEngineer,
                    solverTwo: ArmSolver.ComputerScientist,
                    solverThree: ArmSolver.MaterialsScientist,
                    solverFour: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Structure, Power, and Software"
                },
                {
                    round: 3,
                    score: 45,
                    weight: 50,
                    cost: 70,
                    solverOne: ArmSolver.IndustrialSystemsEngineer,
                    architecture: "Entire Arm"
                },
            ]
        },
    ]



    // use to make sure user is in a valid session

    // TODO potentially move the calls for these results INTO the result components 
    // just as I moved playerlist out of sessionStatus and into waiting room call meaning only session round would have
    // to be polled here)
    const [currentResults, setCurrentResults] = useState<ArmRoundResult[]>([]);
    const [finalResults, setFinalResults] = useState<ArmFinalResult[]>(tempFakeFinalResults);

    // When player finishes the current round allow them to see scores for the round
    const [finishedRound, setFinishedRound] = useState<Array<Boolean>>(Array.apply(false, Array(20)).map(val => !!val));
    const [didFinishRound, setDidFinishRound] = useState<Boolean>(false);

    const [currRound, setCurrRound] = useState<number>(RoundNames.ArmExperiment);

    // use effect that gets "current" round and adds RoundNames.ArmExperiment to skip to mechanical arm game for preview
    // it also sets the playerId, sessionId and isHost in context
    useEffect(() => {

    })


    const advanceRound = (): void => {
        setCurrRound(val => val + 1);
        const randomResults: any[] = [
            {
                id: "1",
                name: "Player 1",
                architecture: "Entire Arm",
                solverOne: ArmSolver.IndustrialSystemsEngineer,
                weight: 50,
                cost: 70,
                score: 45,
                round: currRound
            },
            {
                id: "2",
                name: "Lison Al Gaib",
                color: '#a11222',
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
            {
                id: "1",
                name: "Not Done Yet",
                round: currRound
            },
        ]
        setCurrentResults(randomResults);
        setFinalResults(tempFakeFinalResults);
        setDidFinishRound(false);
    }

    // TODO just eliminating warnings with this, may delete this whole file soon unless prof wants mechanical arm game to be able to run separately
    advanceRound();

    const applyFinishedRound = (rounds: Array<Boolean>): void => {
        setFinishedRound(rounds);
        setDidFinishRound(true);
    }

    // start on experimental round
    if (currRound <= RoundNames.ArmExperiment) {
        return (
            <div className='GameController'>
                <ArmExperiment />
            </div>
        )
    }
    // then have player play 4 game rounds
    else if (currRound > RoundNames.ArmExperiment && currRound < RoundNames.ArmFinalResults) {
        if (!didFinishRound) {
            return (
                <div className='GameController'>
                    <ArmGameScreen
                        finishedRounds={finishedRound}
                        setFinishedRound={applyFinishedRound}
                        round={currRound}
                    />
                </div>
            )
        } else {
            return (
                <div className='GameController'>
                    <ArmRoundResults
                        round={currRound}
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