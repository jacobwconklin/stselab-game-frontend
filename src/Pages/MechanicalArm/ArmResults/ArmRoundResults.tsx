import { useState } from 'react';
import './ArmRoundResults.scss';
import { Button } from 'antd';
import ResultTable from './ArmResultTable';
import ResultGraphs from './ArmResultGraphs';
import { ArmRoundResult, RoundResult } from '../../../Utils/Types';
import { RoundNames, getDisplayRound } from '../../../Utils/Utils';
import VerificationModal from '../../../ReusableComponents/VerificationModal';
import SpaceBackground from '../../../ReusableComponents/SpaceBackground';
// import golfBallSvg from '../../Assets/golfBall.svg';

// RoundResults
const ArmRoundResults = (props: { 
    round: number, 
    players: Array<RoundResult>, 
    results: Array<ArmRoundResult>, 
    advanceRound: () => void
}) => {
    // const { isHost, sessionId } = useContext(UserContext) as UserContextType;
    const isHost = true;
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    return (
        <div className='ArmRoundResults'>
            <SpaceBackground />
            <div className='Instructions HostInstruction'>
                <h1>
                    Results for Mission Round {getDisplayRound(props?.round)}
                </h1>
                {
                    props?.players?.filter((player: RoundResult) => !!player.shots).length === props?.players?.length ?
                        <h3>
                            All Agents are Finished
                        </h3>
                        :
                        <h3>
                            {props?.players?.filter((player: RoundResult) => !!player.shots).length} Agent
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
                    isHost && props?.round >= RoundNames.ArmGame4 &&
                    <p>
                        As Host you may end the Mission. This will take all agents to a screen to view the final results across all four rounds of the Mission whether agents have finished playing this round or not. You may also remove agents from the Mission by clicking on their row.
                    </p>
                }
                {
                    isHost && props?.round < RoundNames.ArmGame4 &&
                    <p>
                        As Host you may advance to the next round. This will take all agents to the game screen for the next round regardless of whether they have finished this round or not. You may also remove agents from the Mission by clicking on their row.
                    </p>
                }
                {
                    !isHost &&
                    <p>
                        {props?.round < RoundNames.ArmGame4 ? "Host must begin the next round" : "Host must end the mission"}
                    </p>
                }
                {
                    isHost &&
                    <Button
                        disabled={!!hostClickedButton}
                        onClick={() => {
                            // IF not everyone is finished pull up a modal
                            if (props?.players?.filter((player: RoundResult) => !!player.shots).length === props?.players?.length) {
                                // advanceSession(sessionId, setHostClickedButton);
                                props.advanceRound();
                            } else {
                                // NOT ALL PLAYERS FINISHED ask host if they really want to continue
                                setShowVerificationModal(true);
                            }
                        }}
                        type='primary'
                    >
                        {props?.round < RoundNames.ArmGame4 ? "Begin Next Round" : "End The Mission"}
                    </Button>
                }
            </div>

            <ResultTable players={props.players} round={props.round} results={props.results} />
            <ResultGraphs players={props.players} round={props.round} results={props.results} />

            {
                showVerificationModal &&
                <VerificationModal
                    title="Not All Players Have Finished"
                    message="Not all players have finished this round. Are you sure you want to advance to the next round?"
                    // confirm={() => advanceSession(sessionId, setHostClickedButton)}
                    confirm={() => { setHostClickedButton(true); props.advanceRound()}}
                    cancel={() => setShowVerificationModal(false)}
                />
            }

        </div>
    )
}

export default ArmRoundResults;