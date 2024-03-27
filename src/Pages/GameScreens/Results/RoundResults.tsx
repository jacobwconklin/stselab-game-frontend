import { useContext, useState } from 'react';
import './RoundResults.scss';
import { UserContext } from '../../../App';
import { Button } from 'antd';
import { advanceSession } from '../../../Utils/Api';
import ResultTable from './ResultTable';
import ResultGraphs from './ResultGraphs';
import { RoundResult, UserContextType } from '../../../Utils/Types';
import { RoundNames } from '../../../Utils/Utils';
import VerificationModal from '../../../ReusableComponents/VerificationModal';
// import golfBallSvg from '../../Assets/golfBall.svg';

// RoundResults
const RoundResults = (props: { round: number, players: Array<RoundResult> }) => {
    const { isHost, sessionId } = useContext(UserContext) as UserContextType;
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    return (
        <div className='RoundResults'>
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
            <div className='Instructions HostInstruction'>
                <h1>
                    Results for {props?.round >= RoundNames.TournamentStage1 ?
                        "Tournament Stage " + (props?.round - RoundNames.TournamentStage1 + 1) : "Round " + props?.round}
                </h1>
                {
                    props?.players?.filter((player: RoundResult) => !!player.shots).length === props?.players?.length ?
                        <h3>
                            All Players are Finished
                        </h3>
                        :
                        <h3>
                            {props?.players?.filter((player: RoundResult) => !!player.shots).length} Player
                            {props?.players?.filter((player: RoundResult) => !!player.shots).length > 1 ? 's' : ''} Finished
                        </h3>
                }
                {
                    !!props?.players?.filter((player: RoundResult) => !player.shots).length &&
                    <h3>
                        {props?.players?.filter((player: RoundResult) => !player.shots).length} Still Playing
                    </h3>
                }
                {
                    isHost && props?.round >= RoundNames.TournamentStage4 &&
                    <p>
                        As Host you may end the tournament. This will take all players to a screen to view the final results across all four rounds of the tournament whether players have finished playing this round or not. You may also remove players from the tournament by clicking on their row.
                    </p>
                }
                {
                    isHost && props?.round < RoundNames.TournamentStage4 &&
                    <p>
                        As Host you may advance to the next round. This will take all players to the game screen for the next round regardless of whether they have finished this round or not. You may also remove players from the tournament by clicking on their row.
                    </p>
                }
                {
                    !isHost &&
                    <p>
                        {props?.round < RoundNames.TournamentStage4 ? "Host must begin the next round" : "Host must end the tournament"}
                    </p>
                }
                {
                    isHost &&
                    <Button
                        disabled={!!hostClickedButton}
                        onClick={() => {
                            // IF not everyone is finished pull up a modal
                            if (props?.players?.filter((player: RoundResult) => !!player.shots).length === props?.players?.length) {
                                advanceSession(sessionId, setHostClickedButton);
                            } else {
                                // NOT ALL PLAYERS FINISHED ask host if they really want to continue
                                setShowVerificationModal(true);
                            }
                        }}
                        type='primary'
                    >
                        {props?.round < RoundNames.TournamentStage4 ? "Begin Next Round" : "End Tournament"}
                    </Button>
                }
            </div>

            <ResultTable players={props.players} round={props.round} />
            <ResultGraphs players={props.players} round={props.round} />

            {
                showVerificationModal &&
                <VerificationModal
                    title="Not All Players Have Finished"
                    message="Not all players have finished this round. Are you sure you want to advance to the next round?"
                    confirm={() => advanceSession(sessionId, setHostClickedButton)}
                    cancel={() => setShowVerificationModal(false)}
                />
            }

        </div>
    )
}

export default RoundResults;