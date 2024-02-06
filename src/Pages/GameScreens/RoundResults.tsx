import { useContext, useState } from 'react';
import './RoundResults.scss';
import { UserContext } from '../../App';
import { Button } from 'antd';
import { postRequest } from '../../Utils/Api';
import GolfBall from '../../ReusableComponents/GolfBall';

// RoundResults
const RoundResults = (props: any) => {

    // Screen was not re-rendering when new player data came in when using this function, may need to just dynamically 
    // choose between sorted forms of data in the tsx element
    // const sortPlayers = (category: string) : any[] => {
    //     if (category === "stroke") {
    //         return props.players.sort((a: any, b: any) => {
    //             if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
    //                 // player a has finished b hasn't, put a in front of b
    //                 return -1;
    //             } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
    //                 // player b has finished a hasn't, put b in front of a
    //                 return 1;
    //             } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
    //                 // both players have finished, sort by shots
    //                 return a.scores[props.round - 1].shots - b.scores[props.round - 1].shots;
    //             }
    //         });
    //     } else {
    //         // sort by cost
    //         return props.players.sort((a: any, b: any) => {
    //             if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
    //                 // player a has finished b hasn't, put a in front of b
    //                 return -1;
    //             } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
    //                 // player b has finished a hasn't, put b in front of a
    //                 return 1;
    //             } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
    //                 // both players have finished, sort by shots
    //                 return a.scores[props.round - 1].cost - b.scores[props.round - 1].cost;
    //             }
    //         });
    //     }
    // }

    const {isHost, playerId, sessionId} = useContext(UserContext) as any;
    const [hostClickedButton, setHostClickedButton] = useState(false);

    const hostBeginNextRound = async () => {
        setHostClickedButton(true);
        const response = await postRequest("session/advance", JSON.stringify({sessionId}));
        if (response.success) {

        } else {
            alert("Error advancing round, please try again.")
            setHostClickedButton(false);
            console.error(response);
        }
    }
    // TODO set modal to make sure host knows some players might not finished and only show
    // if some player hasn't finished.

    return (
        <div className='RoundResults'>
            <h1>Results for Round {props?.round}</h1>
            {
                isHost && props?.round >= 3 &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Players Finished, 
                        {props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                    </h3>
                    <p>
                        As Host you may end the tournament. This will take all players to a screen to view the final results across all 
                        three rounds of the tournament whether players
                        have finished playing this round or not. You may also remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={hostClickedButton}
                        onClick={hostBeginNextRound}
                    >
                        End Tournament
                    </Button>
                </div>
            }
            {
                isHost && props?.round < 3 &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Players Finished, 
                        {props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                    </h3>
                    <p>
                        As Host you may advance to the next round. This will take all players to the game screen for the next round regardless of 
                        whether they have finished this round or not.
                        You may also remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={hostClickedButton}
                        onClick={hostBeginNextRound}
                    >
                        Begin Next Round
                    </Button>
                </div>
            }
            {
                !isHost &&
                <div className='HostInstruction'>
                    <h3>
                        {props?.players?.filter((player: any) => !!player.scores[props.round - 1]).length} Players Finished, 
                        {' ' + props?.players?.filter((player: any) => !player.scores[props.round - 1]).length} Still Playing
                    </h3>
                    <p>
                        {props?.round < 3 ? "Host must begin the next round" : "Host must end the tournament"}
                    </p>
                    <Button
                        onClick={() => {alert("Dynamic sorting not implemented yet values automatically sorted by stroke")}}
                    >
                        Sort by Strokes
                    </Button>
                </div>
            }
            <div className='ResultTable'>
                {
                    // TODO allow sort by stroke and cost
                    // TODO show solver type selected as well, 
                    // if on round 1 or 2, there is 1 solver,
                    // if on round 3 there are 2 solvers, 
                    // if on round 4 there are 3 solvers
                    props.players && props.players.length > 0 && 
                    <div className='GridHeader'>
                        <p>Rank</p>
                        <p>First Name</p>
                        <p>Golf Ball</p>
                        <p>
                            Strokes
                        </p>
                        <p>
                            Cost
                        </p>
                        {
                            // check round ...
                        }
                    </div>
                }
                {
                    // TODO may need to sort scores to ensure last score in array matches last round so add:
                    // .sort((a: any, b: any) => {a.round - b.round})
                    props.players && props.players.length > 0 && 
                    props.players.sort((a: any, b: any) => {
                        if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
                            // player a has finished b hasn't, put a in front of b
                            return -1;
                        } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
                            // player b has finished a hasn't, put b in front of a
                            return 1;
                        } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
                            // both players have finished, sort by shots
                            return a.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots - 
                                b.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots;
                        } else return 0;
                    }).map((result: any, index: number) => (
                        <div key={result.id} className={`UserResult ${isHost && result.id?.toLowerCase() !== playerId?.toLowerCase() ? 'Clickable' : ''}`}
                            onClick={() => {
                                if (isHost && result.id?.toLowerCase() !== playerId?.toLowerCase()) {
                                    // TODO tell backend to remove this player
                                    alert("remove not implemented yet")
                                    console.log(playerId, result.id);
                                }
                            }}
                        >
                            <p>{index + 1}</p>
                            <p>{result.name}</p>
                            <GolfBall color={result.color} />
                            <p>{result.scores[props.round - 1] ? result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].shots : 'Waiting'}</p>
                            <p>{result.scores[props.round - 1] ? result.scores.sort((a: any, b: any) => a.round - b.round)[props.round - 1].cost : 'Waiting'}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RoundResults;