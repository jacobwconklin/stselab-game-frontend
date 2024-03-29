import { useContext, useEffect, useState } from 'react';
import './GameController.scss';
import { postRequest } from '../../Utils/Api';
import { Navigate, useBeforeUnload } from 'react-router-dom';
import { UserContext } from '../../App';
import WaitRoom from '../GameScreens/WaitRoom';
import PlayScreen from '../GameScreens/PlayScreen';
import RoundResults from '../GameScreens/Results/RoundResults';
import SessionResults from '../GameScreens/SessionResults';
import FreeRoam from '../GameScreens/FreeRoam/FreeRoam';
import { FinalResult, RoundResult, UserContextType } from '../../Utils/Types';
import { RoundNames } from '../../Utils/Utils';
import React from 'react';

// Controls flow of game based on status of the player's session. If the session has not been started, it 
// displays the session screen showing all of the players in a the tournament. Once started, it will 
// allow users to play the game for the current round, and then see results for the round if they have finished.
// finally, when the session / tournament is over, it will show the final results of the tournament. From 
// there users can save the results and / or view total aggregate results of everyone who has played the game. 
// TODO may switch to web-socket connection with https://www.npmjs.com/package/react-use-websocket
const GameController = () => {

    // use to make sure user is in a valid session
    const [inValidSession, setInValidSession] = useState(true);

    // check host status and session id / join code from context
    const { sessionId, playerId } = useContext(UserContext) as UserContextType;
    const [currRound, setCurrRound] = useState<number>(0);

    // TODO potentially move the calls for these results INTO the result components 
    // just as I moved playerlist out of sessionStatus and into waiting room call meaning only session round would have
    // to be polled here)
    const [currentResults, setCurrentResults] = useState<RoundResult[]>([]);
    const [finalResults, setFinalResults] = useState<FinalResult[]>([]);

    // When player finishes the current round allow them to see scores for the round
    const [finishedRound, setFinishedRound] = useState<Array<Boolean>>(Array.apply(false, Array(10)).map(val => !!val));

    useEffect(() => {
        // Pull all session information from the server, which checks the database, which is the Single Source of Truth.
        // Interval will regularly poll back-end for updates 
        const interval = setInterval(async () => {
            try {
                const response = await postRequest('session/status', JSON.stringify({ sessionId, playerId }));
                // console.log(response); // -> WIll log all statuses received
                // sessionId must exist to fetch session status. If there is no sessionId or
                // if response tells us that session is invalid then redirect to home page
                if (!sessionId || response.error === "Session not found") {
                    // TODO could prompt user with modal to give them a chance to try again rather than immediately redirecting them
                    alert("Session not found, returning to home page")
                    setInValidSession(false);
                } else if (response.error === "Player not in session") {
                    alert("Removed from session, returning to home page")
                    setInValidSession(false);
                } else if (response.error) {
                    // TODO may need to attempt to exit player from session they are in then redirect them home?
                    alert("Error getting session: " + response.error);
                } else if (response?.session?.endDate && response?.session?.endDate !== "None") {
                    // on receiving a session with an end date we know we are on the final results page and 
                    // no longer need to poll the BE for updates to round number)
                    setCurrRound(RoundNames.FinalResults);
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
                    }
                    setCurrRound(response?.session?.round);
                }
                // Rounds where OTHER player results want to be seen will pull round results and include:
                // 1, 3, 6, 7, 8, 9, 10 (but 10 requires results from entire tournament)
                const currentRound = response?.session?.round;
                if (currentRound === RoundNames.PracticeHArchPro || currentRound === RoundNames.PracticeHArchAll || (currentRound >= RoundNames.TournamentStage1 && currentRound < RoundNames.FinalResults)) {
                    const resultsResponse = await postRequest('/session/roundresults', JSON.stringify({
                        sessionId, round: currentRound
                    }));
                    if (resultsResponse.success) {
                        // Only update state if the length of results changed (new player info came)
                        setCurrentResults(resultsResponse.results);
                    }
                    else {
                        console.error(`Error fetching results for round${currentRound} received: `, resultsResponse);
                    }
                } else if (currentRound === RoundNames.FinalResults) {
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
                }
            } catch (error) {
                console.error("Error fetching session status: ", error);
            }
        }, 2000); // This is the frequency of the polling in milliseconds.

        // clear interval when component unmounts
        return () => {
            clearInterval(interval);
        }
    }, [sessionId, playerId, setCurrentResults, setFinalResults, currentResults.length, finalResults.length, currRound]);


    useBeforeUnload(
        React.useCallback(() => {
            // TODO remove player if they navigate away from game
            if (playerId) postRequest("player/remove", JSON.stringify({ playerId }));
        }, [playerId])
    );

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

    // Rounds where OTHER player results want to be seen will pull round results and include:
    // 1, 3, 6, 7, 8, 9, 10

    // Only allow users to session page if they are registered
    if (!inValidSession) {
        return <Navigate to="/" />
    }
    // if session has not started show wait room
    else if (currRound === RoundNames.WaitRoom) {
        return (
            <div className='GameController'>
                <WaitRoom />
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
    else
        return (
            <div className='GameController'>
                <SessionResults players={finalResults} />
            </div>
        )
}

export default GameController;