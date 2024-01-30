import { useContext, useState } from 'react';
import './RoundResults.scss';
import { UserContext } from '../../App';
import { Button } from 'antd';
import { postRequest } from '../../Utils/Api';

// RoundResults
const RoundResults = (props: any) => {

    const sortPlayers = (category: string) : any[] => {
        if (category === "stroke") {
            return props.players.sort((a: any, b: any) => {
                if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
                    // player a has finished b hasn't, put a in front of b
                    return -1;
                } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
                    // player b has finished a hasn't, put b in front of a
                    return 1;
                } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
                    // both players have finished, sort by shots
                    return a.scores[props.round - 1].shots - b.scores[props.round - 1].shots;
                }
            });
        } else {
            // sort by cost
            return props.players.sort((a: any, b: any) => {
                if (a.scores[props.round - 1] && !b.scores[props.round - 1]) {
                    // player a has finished b hasn't, put a in front of b
                    return -1;
                } else if (!a.scores[props.round - 1] && b.scores[props.round - 1]) {
                    // player b has finished a hasn't, put b in front of a
                    return 1;
                } else if (a.scores[props.round - 1] && b.scores[props.round - 1]) { 
                    // both players have finished, sort by shots
                    return a.scores[props.round - 1].cost - b.scores[props.round - 1].cost;
                }
            });
        }
    }

    const {isHost, playerId, sessionId} = useContext(UserContext) as any;
    const [hostClickedButton, setHostClickedButton] = useState(false);
    const [sortedByStrokes, setSortedByStrokes] = useState(true);
    const [sortedPlayers, setSortedPlayers] = useState<any[]>(sortPlayers("stroke"));

    
    console.log(sortedPlayers);

    const hostBeginNextRound = async () => {
        setHostClickedButton(true);
        const response = await postRequest("session/advance", JSON.stringify({sessionId}));
    }
    // TODO set modal to make sure host knows some players might not finished and only show
    // if some player hasn't finished.

    return (
        <div className='RoundResults'>
            <h1>Results for Round {props?.round}</h1>
            {
                isHost && props?.round >= 3 ?
                <div className='HostInstruction'>
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
                :
                <div className='HostInstruction'>
                    <p>
                        As Host you may begin the next round. This will start the next round for all players regardless of whether they
                        have finished playing or not. You may also remove players from the tournament by clicking on their row.
                    </p>
                    <Button
                        disabled={hostClickedButton}
                        onClick={hostBeginNextRound}
                    >
                        Begin Next Round
                    </Button>
                </div>
            }
            <div className='ResultTable'>
                {
                    // TODO allow sort by stroke and cost
                    props.players && props.players.length > 0 && 
                    <div className='GridHeader'>
                        <p>Rank</p>
                        <p>First Name</p>
                        <p>Golf Ball</p>
                        <p 
                            className='ClickableColumn'
                            onClick={() => {
                                setSortedPlayers(sortPlayers("stroke"));
                                setSortedByStrokes(true);
                            }}
                        >
                            Strokes
                            {
                                !sortedByStrokes ? 
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                                
                                :
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                            
                            }
                        </p>
                        <p 
                            className='ClickableColumn'
                            onClick={() => {
                                setSortedPlayers(sortPlayers("cost"));
                                setSortedByStrokes(false);
                            }}
                        >
                            Cost
                            {
                                sortedByStrokes ? 
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                                
                                :
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                            
                            }
                        </p>
                    </div>
                }
                {
                    // TODO rather than use border color just show the player's golf balls. 
                    props.players && props.players.length > 0 && 
                    sortedPlayers.map((result: any, index: number) => (
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
                            <p>{result.firstName}</p>
                            <svg className='GolfBall' fill={result.color} stroke={result.color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m14 9a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm0-3a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm-2-4a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8zm5-12a1 1 0 1 0 1 1 1 1 0 0 0 -1-1z"/></svg>
                            <p>{result.scores[props.round - 1] ? result.scores[props.round - 1].shots : 'Waiting'}</p>
                            <p>{result.scores[props.round - 1] ? result.scores[props.round - 1].cost : 'Waiting'}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default RoundResults;