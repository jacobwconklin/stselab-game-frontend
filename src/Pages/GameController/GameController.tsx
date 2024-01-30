import { useContext, useEffect, useState } from 'react';
import './GameController.scss';
import { postRequest } from '../../Utils/Api';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../App';
// import { SessionStatus } from '../../Utils/Types';
import WaitRoom from '../GameScreens/WaitRoom';
import PlayScreen from '../GameScreens/PlayScreen';
import RoundResults from '../GameScreens/RoundResults';
// import { UserInformation } from '../../Utils/Types';

// Controls flow of game based on status of the player's session. If the session has not been started, it 
// displays the session screen showing all of the players in a the tournament. Once started, it will 
// allow users to play the game for the current round, and then see results for the round if they have finished.
// finally, when the session / tournament is over, it will show the final results of the tournament. From 
// there users can save the results and / or view total aggregate results of everyone who has played the game. 
// TODO may switch to web-socket connection with https://www.npmjs.com/package/react-use-websocket
const GameController = (props: any) => {

    // use to make sure user is in a valid session
    const [inValidSession, setInValidSession] = useState(true);

    // check host status and session id / join code from context
    const { sessionId } = useContext(UserContext) as any;
    const [sessionStatus, setSessionStatus] = useState<any | null>(null);

    // When player finishes the current round allow them to see scores for the round
    const [finishedRound, setFinishedRound] = useState(false);

    useEffect(() => {
        // Pull all session information from the server, which checks the database, which is the Single Source of Truth.
        // Interval will regularly poll back-end for updates 
        const interval = setInterval( async() => {
            try {
                const response = await postRequest('session/status', JSON.stringify({sessionId}));
                console.log(response);
                // sessionId must exist to fetch session status. If there is no sessionId or
                // if response tells us that session is invalid then redirect to home page
                if (!sessionId || response.error === "Session not found") {
                    // TODO prompt user with modal to give them a chance to try again rather than immediately redirecting them
                    alert("Session not found, returning to home page")
                    setInValidSession(false);
                } else if (response.error) {
                    // TODO may need to attempt to exit player from session they are in then redirect them home?
                    alert("Error getting session: " + response.error);
                } else {
                    setSessionStatus(response);
                }
            } catch (error) {
                console.log("Error fetching session status: ", error);
            }
        }, 2000); // This is the frequency of the polling in milliseconds.

        // clear interval when component unmounts
        return () => {
            clearInterval(interval);
        }
    }, [sessionId]);


    // useBeforeUnload(
    //     React.useCallback(() => {
    //         // TODO remove player if they navigate away from game
    //     }, [])
    // );





    // Only allow users to session page if they are registered
    if (!inValidSession) {
        return <Navigate to="/" />
    } 
    // if session has not started show wait room
    else if (!sessionStatus || sessionStatus?.session?.round === 0) {
        return (
            <div className='GameController'>
                <WaitRoom players={sessionStatus?.players ? sessionStatus.players : []} />
            </div>
        )
    } 
    // session has not ended show the game screen until player finishes playing, then 
    // show the round results
    else if (sessionStatus?.session?.round !== 4) {
        // TODO maybe always show results of round under or over game instead of switching between in future.
        if (!finishedRound) {
            return (
                <div className='GameController'>
                    <PlayScreen round={sessionStatus?.session?.round} setFinishedRound={setFinishedRound} />
                </div>
            )
        } else {
            return (
                <div className='GameController'>
                    <RoundResults round={sessionStatus?.session?.round} players={sessionStatus?.players ? sessionStatus.players : []} />
                </div>
            )
        }
    } 
    // session should have ended, show user session results and allow them to navigate to all agregate results if desired.
    else 
        return (
        <div className='GameController'>
            <h1>Shouldn't be here</h1>
        </div>
    )
}

export default GameController;