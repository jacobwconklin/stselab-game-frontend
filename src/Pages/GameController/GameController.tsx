import { useContext, useEffect, useState } from 'react';
import './GameController.scss';
import { postRequest } from '../../Utils/Api';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../App';
import WaitRoom from '../GameScreens/WaitRoom';
import PlayScreen from '../GameScreens/PlayScreen';
import RoundResults from '../GameScreens/Results/RoundResults';
import SessionResults from '../GameScreens/SessionResults';
import FreeRoam from '../GameScreens/FreeRoam/FreeRoam';
import { ArmFinalResult, ArmRoundResult, FinalResult, RoundResult, UserContextType } from '../../Utils/Types';
import { RoundNames } from '../../Utils/Utils';
import ArmFinalResults from '../MechanicalArm/ArmFinalResults';
import ArmExperiment from '../MechanicalArm/ArmExperiment/ArmExperiment';
import ArmGameScreen from '../MechanicalArm/ArmGameScreen';
import ArmRoundResults from '../MechanicalArm/ArmResults/ArmRoundResults';
import { Spin } from 'antd';

// Controls flow of game based on status of the player's session. If the session has not been started, it 
// displays the session screen showing all of the players in a the tournament. Once started, it will 
// allow users to play the game for the current round, and then see results for the round if they have finished.
// finally, when the session / tournament is over, it will show the final results of the tournament. From 
// there users can save the results and / or view total aggregate results of everyone who has played the game. 
// TODO may switch to web-socket connection with https://www.npmjs.com/package/react-use-websocket
const GameController = () => {

    // Developer tool! flip this bool to jump straight to mechaical arm game from wait room
    const [jumpToMechanicalArm, setJumpToMechanicalArmMission] = useState<Boolean>(false);

    // use to make sure user is in a valid session
    const [inValidSession, setInValidSession] = useState(true);

    // check host status and session id / join code from context
    const { sessionId, playerId, setIsHost, setPlayerColor, setPlayerId, setSessionId } = useContext(UserContext) as UserContextType;
    const [currRound, setCurrRound] = useState<number>(0);

    // TODO potentially move the calls for these results INTO the result components 
    // just as I moved playerlist out of sessionStatus and into waiting room call meaning only session round would have
    // to be polled here)
    const [currentResults, setCurrentResults] = useState<RoundResult[]>([]);
    const [finalResults, setFinalResults] = useState<FinalResult[]>([]);

    // Results for Arm Rounds and Arm Final Results pulled and stored here
    const [currentArmResults, setCurrentArmResults] = useState<ArmRoundResult[]>([]);
    const [finalArmResults, setFinalArmResults] = useState<ArmFinalResult[]>([]);

    // When player finishes the current round allow them to see scores for the round
    const [finishedRound, setFinishedRound] = useState<Array<Boolean>>(Array.apply(false, Array(20)).map(val => !!val));

    // force player to complete onboarding even if they enter a game late
    const [completedOnboarding, setCompletedOnboarding] = useState(false);

    useEffect(() => {
        // Pull all session information from the server, which checks the database, which is the Single Source of Truth.
        // Interval will regularly poll back-end for updates 
        const interval = setInterval(async () => {
            try {
                // If sessionId and / or playerId are null, try pulling them from local storage
                // If they aren't there then the user is not in a valid session and should be redirected to the home page,
                // but if they are then the user likely refreshed their page
                if (!sessionId || !playerId) {
                    const storedPlayerInformation = localStorage.getItem('essentialPlayerInformation');
                    if (storedPlayerInformation) {
                        const parsed = JSON.parse(storedPlayerInformation);
                        setSessionId(parsed.sessionId);
                        setPlayerId(parsed.playerId);
                        setPlayerColor(parsed.playerColor);
                        setIsHost(parsed.isHost);
                        // if finished round data exists for this session pull it on refresh (here)
                        const finishedRoundData = localStorage.getItem('finishedRound');
                        if (finishedRoundData) {
                            const parsedData = JSON.parse(finishedRoundData);
                            if (parsedData.sessionId === sessionId && parsedData.playerId === playerId) {
                                setFinishedRound(parsedData.data);
                            }
                        }
                        // if onboarding data exists for this session pull it on refresh (here)
                        const onboardingData = localStorage.getItem('diceGameFinished');
                        if (onboardingData) {
                            const parsedData = JSON.parse(onboardingData);
                            if (parsedData.sessionId === sessionId && parsedData.playerId === playerId) {
                                setCompletedOnboarding(true);
                            }
                        }
                    } else {
                        setInValidSession(false);
                    }
                } else {
                    const response = await postRequest('session/status', JSON.stringify({ sessionId, playerId }));
                    // sessionId must exist to fetch session status. If there is no sessionId or
                    // if response tells us that session is invalid then redirect to home page
                    if (!sessionId || response.error === "Session not found") {
                        // TODO could prompt user with modal to give them a chance to try again rather than immediately redirecting them
                        localStorage.setItem('essentialPlayerInformation', '');
                        setSessionId(0);
                        setPlayerId("");
                        setPlayerColor("");
                        alert("Session not found, returning to home page")
                        setInValidSession(false);
                    } else if (response.error === "Player not in session") {
                        localStorage.setItem('essentialPlayerInformation', '');
                        setSessionId(0);
                        setPlayerId("");
                        setPlayerColor("");
                        alert("Removed from session, returning to home page")
                        setInValidSession(false);
                    } else if (response.error) {
                        // TODO may need to attempt to exit player from session they are in then redirect them home?
                        alert("Error getting session: " + response.error);
                    } else if (response?.session?.endDate && response?.session?.endDate !== "None") {
                        // on receiving a session with an end date we know we are on the final results page of Mechanical Arm Mission and 
                        // no longer need to poll the BE for updates to round number)
                        setCurrRound(RoundNames.ArmFinalResults);
                        // pull results once then clear interval
                        const resultsResponse = await postRequest('/session/finalresults', JSON.stringify({
                            sessionId
                        }));
                        if (resultsResponse.success) {
                            // Only update state if the length of results changed (new player info came)
                            setFinalResults(resultsResponse.results);
                        }
                        else {
                            console.error(`Error fetching results for final round received: `, resultsResponse);
                        }
                        clearInterval(interval);
                    } else {
                        // if we changed rounds reset currentResults
                        if (currRound !== response?.session?.round) {
                            setCurrentResults([]);
                            // Allows jumping to mechanical arm game, remove in prod
                            if (jumpToMechanicalArm) {
                                setCurrRound(RoundNames.ArmExperiment + response?.session?.round - 1);
                            } else {
                                setCurrRound(response?.session?.round);
                            }
                        }
                    }
                    // Rounds where OTHER player results want to be seen will pull round results and include:
                    // 1, 3, 6, 7, 8, 9, 10 (but 10 requires results from entire tournament)
                    // pull current results only when round is finished
                    if (finishedRound[currRound] && (currRound === RoundNames.PracticeHArchPro || currRound === RoundNames.PracticeHArchAll || (currRound >= RoundNames.TournamentStage1 && currRound < RoundNames.FinalResults))) {
                        // Pull current results here for golf game
                        const resultsResponse = await postRequest('/session/roundresults', JSON.stringify({
                            sessionId, round: currRound
                        }));
                        if (resultsResponse.success) {
                            // TODO could Only update state if the length of results changed (new player info came)
                            setCurrentResults(resultsResponse.results);
                        }
                        else {
                            console.error(`Error fetching results for round${currRound} received: `, resultsResponse);
                        }
                    } else if (currRound === RoundNames.FinalResults && finalResults.length === 0) {
                        // Pull final results here for golf game
                        const resultsResponse = await postRequest('/session/finalresults', JSON.stringify({
                            sessionId
                        }));
                        if (resultsResponse.success) {
                            // TODO could Only update state if the length of results changed (new player info came)
                            setFinalResults(resultsResponse.results);
                        }
                        else {
                            console.error(`Error fetching results for final round received: `, resultsResponse);
                        }
                    } else if (finishedRound[currRound] && currRound > RoundNames.ArmExperiment && currRound < RoundNames.ArmFinalResults) {
                        // Pull current results here for Mechanical Arm game
                        const resultsResponse = await postRequest('/session/armroundresults', JSON.stringify({
                            sessionId, round: currRound
                        }));
                        if (resultsResponse.success) {
                            setCurrentArmResults(resultsResponse.results);
                        }
                        else {
                            console.error(`Error fetching results for round${currRound} received: `, resultsResponse);
                        }
                    } else if (currRound === RoundNames.ArmFinalResults && finalArmResults.length === 0) {
                        // Pull final results here for Mechanical Arm game
                        const resultsResponse = await postRequest('/session/armfinalresults', JSON.stringify({
                            sessionId
                        }));
                        if (resultsResponse.success) {
                            setFinalArmResults(resultsResponse.results);
                        }
                        else {
                            console.error(`Error fetching results for final Mechical Arm Round received: `, resultsResponse);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching session status: ", error);
            }
        }, 2500); // This is the frequency of the polling in milliseconds.

        // clear interval when component unmounts
        return () => {
            clearInterval(interval);
        }
    }, [sessionId, playerId, setCurrentResults, setFinalResults, currentResults.length, finalResults.length, finishedRound, jumpToMechanicalArm, currRound, finalArmResults.length, setSessionId, setPlayerId, setPlayerColor, setIsHost]);


    // useBeforeUnload(
    //     React.useCallback(() => {
    //         // removes player if they navigate away from game
    //         if (playerId) postRequest("player/remove", JSON.stringify({ playerId }));
    //         // TODO SPECIFICALLY if host leaves, could "end" the session for everyone. For now they just have to leave themselves
    //         // as they get stuck without a host. 
    //     }, [playerId])
    // );

    // Rounds allow the host to move the game forward and change the screen displayed for all players.
    // Rounds will work like this: 
    // First: round 0 -> wait room
    // Second: round 1 -> play h arch only professional
    // Third: round 2 -> play h arch with single Amateur
    // Fourth: round 3 -> play h arch all solvers
    // Fifth: round 4 -> jump to experimental round
    // Sixth: round 5 -> experimental round survey
    // Seventh: round 6 -> play Tournament Stage 1 (best performance)
    // Eigth: round 7 -> Play Tournament Stage 2 (minimize cost for tournamentStage2MaximumShots strokes)
    // Ninth: round 8 -> Play Tournament Stage 3 (balance)
    // Tenth: round 9 -> Play Tournament Stage 4 (custom reward function)
    // Eleventh: round 10 -> Show final Tournament Results

    // Rounds where OTHER player results want to be seen will pull round results and include:
    // 1, 3, 6, 7, 8, 9, 10

    // Only allow users to session page if they are registered
    if (!inValidSession) {
        return <Navigate to="/" />
    }
    else if (!sessionId || !playerId) {
        // show "blank" page while loading information from local storage
        return (
            <div className='GameController'>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className='StaticBackground'></div>
                    <div className='Instructions'>
                        <h1>Refreshing Session Information ...</h1>
                        <Spin size='large' />
                    </div>
                </div>
            </div>
        )
    }
    // if session has not started show wait room
    else if (currRound === RoundNames.WaitRoom || !completedOnboarding) {
        return (
            <div className='GameController'>
                <WaitRoom 
                    setJumpToMechanicalArmMission={setJumpToMechanicalArmMission} 
                    onboardingCompleted={() => setCompletedOnboarding(true)} 
                />
            </div>
        )
    }
    // show practice rounds (some with results) or Tournament Stages
    else if (currRound < RoundNames.Experimental || (currRound > RoundNames.ExperimentalSurvey &&
        currRound < RoundNames.FinalResults)) {
        if (!finishedRound[currRound]) {
            return (
                <div className='GameController'>
                    <PlayScreen round={currRound} setFinishedRound={setFinishedRound} finishedRounds={finishedRound} />
                </div>
            )
        } else {
            return (
                <div className='GameController'>
                    <RoundResults round={currRound} players={currentResults} />
                </div>
            )
        }
    }
    // if on experimental round show experimental round
    else if (currRound >= RoundNames.Experimental && currRound <= RoundNames.ExperimentalSurvey) {
        return (
            <div className='GameController'>
                <FreeRoam round={currRound} />
            </div>
        )
    }
    else if (currRound === RoundNames.FinalResults) {
        return (
            <div className='GameController'>
                <SessionResults players={finalResults} />
            </div>
        )
    } else if (currRound === RoundNames.ArmExperiment) {
        return (
            <div className='GameController'>
                <ArmExperiment />
            </div>
        )
    } else if (currRound < RoundNames.ArmFinalResults) {
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
                        results={currentArmResults}
                    />
                </div>
            )
        }
    } else {
        return (
            <div className='GameController'>
                <ArmFinalResults results={finalArmResults} />
            </div>
        )
    }

}

export default GameController;