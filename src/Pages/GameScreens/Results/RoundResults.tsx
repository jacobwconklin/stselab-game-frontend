import { useContext, useState } from 'react';
import './RoundResults.scss';
import { UserContext } from '../../../App';
import { Button } from 'antd';
import { postRequest } from '../../../Utils/Api';
import ResultTable from './ResultTable';
import ResultGraphs from './ResultGraphs';
import { RoundResult } from '../../../Utils/Types';
// import golfBallSvg from '../../Assets/golfBall.svg';

// RoundResults
const RoundResults = (props: { round: number, players: Array<RoundResult> }) => {
    const { isHost, sessionId } = useContext(UserContext) as any;
    const [hostClickedButton, setHostClickedButton] = useState(false);

    const hostBeginNextRound = async () => {
        setHostClickedButton(true);
        // Force host to go through modal if some players haven't finished
        const response = await postRequest("session/advance", JSON.stringify({ sessionId }));
        if (response.success) {

        } else {
            alert("Error advancing round, please try again.")
            setHostClickedButton(false);
            console.error(response);
        }
    }

    return (
        <div className='RoundResults'>
            <h1>Results for Round {props?.round}</h1>
            {
                isHost && props?.round >= 9 &&
                <div className='HostInstruction'>
                    {
                        props?.players?.filter((player: any) => !!player.shots).length === props?.players?.length ?
                            <h3>
                                All Players are Finished
                            </h3>
                            :
                            <h3>
                                {props?.players?.filter((player: any) => !!player.shots).length} Player
                                {props?.players?.filter((player: any) => !!player.shots).length > 1 ? 's' : ''} Finished
                            </h3>
                    }
                    {
                        !!props?.players?.filter((player: any) => !player.shots).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.shots).length} Still Playing
                        </h3>
                    }
                    <p>
                        As Host you may end the tournament. This will take all players to a screen to view the final results across all four rounds of the tournament whether players
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
                isHost && props?.round < 9 &&
                <div className='HostInstruction'>
                    {
                        props?.players?.filter((player: any) => !!player.shots).length === props?.players?.length ?
                            <h3>
                                All Players are Finished
                            </h3>
                            :
                            <h3>
                                {props?.players?.filter((player: any) => !!player.shots).length} Player
                                {props?.players?.filter((player: any) => !!player.shots).length > 1 ? 's' : ''} Finished
                            </h3>
                    }
                    {
                        !!props?.players?.filter((player: any) => !player.shots).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.shots).length} Still Playing
                        </h3>
                    }
                    <p>
                        As Host you may advance to the next round. This will take all players to the game screen for the next round regardless of whether they have finished this round or not.
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
                    {
                        props?.players?.filter((player: any) => !!player.shots).length === props?.players?.length ?
                            <h3>
                                All Players are Finished
                            </h3>
                            :
                            <h3>
                                {props?.players?.filter((player: any) => !!player.shots).length} Player
                                {props?.players?.filter((player: any) => !!player.shots).length > 1 ? 's' : ''} Finished
                            </h3>
                    }
                    {
                        !!props?.players?.filter((player: any) => !player.shots).length &&
                        <h3>
                            {props?.players?.filter((player: any) => !player.shots).length} Still Playing
                        </h3>
                    }
                    <p>
                        {props?.round < 9 ? "Host must begin the next round" : "Host must end the tournament"}
                    </p>
                </div>
            }

            <ResultTable players={props.players} round={props.round} />
            <ResultGraphs players={props.players} round={props.round} />

        </div>
    )
}

export default RoundResults;