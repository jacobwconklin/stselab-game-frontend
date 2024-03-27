import { ArmRoundResult } from "../../Utils/Types";


const ArmPlayScreen = (props: {
    results: ArmRoundResult[],
    setFinishedRound: (val: Array<Boolean>) => void, 
    finishedRounds: Array<Boolean>
    round: number
}) => {

    return (
        <div className="ArmPlayScreen">
            
        </div>
    )
}

export default ArmPlayScreen;