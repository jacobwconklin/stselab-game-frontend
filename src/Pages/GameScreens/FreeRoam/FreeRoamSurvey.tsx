import {
    Button,
    Checkbox,
} from 'antd';
import './FreeRoamSurvey.scss';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { advanceSession, postRequest } from '../../../Utils/Api';
import { UserContext } from '../../../App';
import { solverNames } from '../../../Utils/Simulation';

// FreeRoamSurvey
const FreeRoamSurvey = (props: {
    setShowModuleResultsSurvey: (val: SetStateAction<boolean>) => void,
    surveySuccesfullySubmitted: Boolean, setSurveySuccessfullySubmitted: (val: SetStateAction<boolean>) => void
}) => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
    const [surveysSubmitted, setSurveysSubmitted] = useState<number | null>(null);

    const { isHost, playerId, sessionId } = useContext(UserContext);

    // TODO as per meeting add ("Not sure") option to each question
    // TODO also may want to add or move simulate all button into view-results page
    // TODO may also want to write survey results to localStorage 

    useEffect(() => {
        // Pull all session information from the server, which checks the database, which is the Single Source of Truth.
        // Interval will regularly poll back-end for updates 
        const interval = setInterval(async () => {
            try {
                if (!totalPlayers || !surveysSubmitted || surveysSubmitted < totalPlayers) {
                    const response = await postRequest('session/surveyssubmitted', JSON.stringify({ sessionId }));
                    if (response.success) {
                        setTotalPlayers(response.totalPlayers);
                        setSurveysSubmitted(response.surveysSubmitted);
                    }
                }
            } catch (error) {
                console.error("Error pulling suverys submitted: ", error);
            }
        }, 2500); // This is the frequency of the polling in milliseconds.

        // clear interval when component unmounts
        return () => {
            clearInterval(interval);
        }
    }, [sessionId, surveysSubmitted, totalPlayers]);

    // To make choices simple to store, can use values of:
    // 1 -> Professional
    // 2 -> Amateur
    // 3 -> Specialist
    // 4 -> Professional and Amateur
    // 5 -> Professional and Specialist
    // 6 -> Amateur and Specialist
    // 7 -> Professional, Amateur, and Specialist (could be stored in 3 bits!)
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [driveChoice, setDriveChoice] = useState([]);
    const [longChoice, setLongChoice] = useState([]);
    const [fairwayChoice, setFairwayChoice] = useState([]);
    const [shortChoice, setShortChoice] = useState([]);
    const [puttChoice, setPuttChoice] = useState([]);
    // const modules = ["Drive", "Long", "Fairway", "Short", "Putt"]
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);

    const convertChoicesToNumber = (choices: string[]) => {
        let number = 0;
        if (choices.includes("Professional") && choices.includes("Amateur") && choices.includes("Specialist")) {
            number = 7;
        } else if (choices.includes("Amateur") && choices.includes("Specialist")) {
            number = 6;
        } else if (choices.includes("Professional") && choices.includes("Specialist")) {
            number = 5;
        } else if (choices.includes("Professional") && choices.includes("Amateur")) {
            number = 4;
        } else if (choices.includes("Specialist")) {
            number = 3;
        } else if (choices.includes("Amateur")) {
            number = 2;
        } else if (choices.includes("Professional")) {
            number = 1;
        }
        return number;
    }

    const submit = async () => {
        // if successful give a happy message, otherwise let them know after an error from the backend
        try {
            setSubmitting(true);
            setAttemptedSubmit(true);
            // Check for all 5 modules having values
            if (driveChoice.length > 0 && longChoice.length > 0 && fairwayChoice.length > 0 &&
                shortChoice.length > 0 && puttChoice.length > 0) {
                // save player information
                const submitResult = await postRequest('player/freeRoamSurvey', JSON.stringify({
                    drive: convertChoicesToNumber(driveChoice),
                    long: convertChoicesToNumber(longChoice),
                    fairway: convertChoicesToNumber(fairwayChoice),
                    short: convertChoicesToNumber(shortChoice),
                    putt: convertChoicesToNumber(puttChoice),
                    playerId // example of one in db -> "06DB4206-1E4D-46E8-A261-AC8B545519FE"
                }));
                if (submitResult.success) {
                    props.setSurveySuccessfullySubmitted(true);
                } else {
                    alert("Failed to submit free roam survey.");
                    console.error(submitResult)
                    setSubmitting(false);
                }
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message);
            setSubmitting(false);
        }
    }

    return (
        <div className='FreeRoamSurvey'>
            {
                props.surveySuccesfullySubmitted ?
                    <div className='SuccessfullySubmittedMessage'>
                        <h1>Survey Submitted!</h1>
                        {
                            totalPlayers && surveysSubmitted && totalPlayers === surveysSubmitted ?
                                <h3>All players have submitted their surveys</h3>
                                :
                                (
                                    totalPlayers && surveysSubmitted ?
                                    <div>
                                        <h3>
                                            {surveysSubmitted} player{surveysSubmitted > 1 ? 's have' : ' has'} submitted their surveys
                                        </h3>
                                        <h3>
                                            {totalPlayers - surveysSubmitted} player{totalPlayers - surveysSubmitted > 1 ? 's are' : ' is'} still taking the survey
                                        </h3>
                                    </div>
                                    :
                                    <></>
                                )
                        }
                        {
                            isHost ?
                                <div className='VerticalContainer'>
                                    <Button
                                        onClick={() => props.setShowModuleResultsSurvey(true)}
                                    >
                                        Review Results
                                    </Button>
                                    <h3>Continue the game and begin the tournament for all players when you are ready</h3>
                                    <Button
                                        onClick={() => advanceSession(sessionId, setHostClickedButton)}
                                        disabled={!!hostClickedButton}
                                    >
                                        Begin Tournament
                                    </Button>
                                </div>
                                :
                                <div className='VerticalContainer'>
                                    <Button
                                        onClick={() => props.setShowModuleResultsSurvey(true)}
                                    >
                                        Review Results
                                    </Button>
                                    <h3>Wait for the host to continue the game and begin the tournament</h3>
                                </div>
                        }
                    </div>
                    :
                    <div className='SurveyForms'>
                        <h2>Please select who you believe are the best solvers for each module. You may select more than one.</h2>
                        <Button
                            onClick={() => props.setShowModuleResultsSurvey(true)}
                        >
                            Review Results
                        </Button>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Drive module?
                        </h3>
                        <Checkbox.Group
                            className={attemptedSubmit && driveChoice.length === 0 ? 'ErrorCheckBox' : ''}
                            options={solverNames}
                            value={driveChoice}
                            onChange={(checkedValues) => { setDriveChoice(checkedValues) }}
                        />
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Long module?
                        </h3>
                        <Checkbox.Group
                            className={attemptedSubmit && longChoice.length === 0 ? 'ErrorCheckBox' : ''}
                            options={solverNames}
                            value={longChoice}
                            onChange={(checkedValues) => { setLongChoice(checkedValues) }}
                        />
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Fairway module?
                        </h3>
                        <Checkbox.Group
                            className={attemptedSubmit && fairwayChoice.length === 0 ? 'ErrorCheckBox' : ''}
                            options={solverNames}
                            value={fairwayChoice}
                            onChange={(checkedValues) => { setFairwayChoice(checkedValues) }}
                        />
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Short module?
                        </h3>
                        <Checkbox.Group
                            className={attemptedSubmit && shortChoice.length === 0 ? 'ErrorCheckBox' : ''}
                            options={solverNames}
                            value={shortChoice}
                            onChange={(checkedValues) => { setShortChoice(checkedValues) }}
                        />
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Putt module?
                        </h3>
                        <Checkbox.Group
                            className={attemptedSubmit && puttChoice.length === 0 ? 'ErrorCheckBox' : ''}
                            options={solverNames}
                            value={puttChoice}
                            onChange={(checkedValues) => { setPuttChoice(checkedValues) }}
                        />
                        <br></br>
                        <br></br>
                        <div className='ButtonHolder'>
                            <Button
                                disabled={submitting}
                                onClick={submit}
                            >
                                Submit
                            </Button>
                        </div>
                        <br></br>
                    </div>
            }
        </div>
    )
}

export default FreeRoamSurvey;