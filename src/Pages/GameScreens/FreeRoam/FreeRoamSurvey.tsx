import {
    Button,
    Checkbox,
    Radio,
} from 'antd';
import './FreeRoamSurvey.scss';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { advanceSession, postRequest } from '../../../Utils/Api';
import { UserContext } from '../../../App';
import VerificationModal from '../../../ReusableComponents/VerificationModal';
import { solverNames } from '../../../Utils/Simulation';

// FreeRoamSurvey
const FreeRoamSurvey = (props: {
    setShowModuleResultsSurvey: (val: SetStateAction<boolean>) => void,
    surveySuccesfullySubmitted: Boolean, setSurveySuccessfullySubmitted: (val: SetStateAction<boolean>) => void,
}) => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
    const [surveysSubmitted, setSurveysSubmitted] = useState<number | null>(null);

    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const { isHost, playerId, sessionId } = useContext(UserContext);

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

    const [driveNotSure, setDriveNotSure] = useState(false);
    const [longNotSure, setLongNotSure] = useState(false);
    const [fairwayNotSure, setFairwayNotSure] = useState(false);
    const [shortNotSure, setShortNotSure] = useState(false);
    const [puttNotSure, setPuttNotSure] = useState(false);

    // const modules = ["Drive", "Long", "Fairway", "Short", "Putt"]
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);

    // pull player choices from localStorage if there
    useEffect(() => {
        const choices = localStorage.getItem('freeRoamSurveyChoices');
        if (choices) {
            const parsedChoices = JSON.parse(choices);
            setDriveChoice(parsedChoices.driveChoice);
            setLongChoice(parsedChoices.longChoice);
            setFairwayChoice(parsedChoices.fairwayChoice);
            setShortChoice(parsedChoices.shortChoice);
            setPuttChoice(parsedChoices.puttChoice);
            setDriveNotSure(parsedChoices.driveNotSure);
            setLongNotSure(parsedChoices.longNotSure);
            setFairwayNotSure(parsedChoices.fairwayNotSure);
            setShortNotSure(parsedChoices.shortNotSure);
            setPuttNotSure(parsedChoices.puttNotSure);
        }
    }, []);

    const saveCurrentChoices = () => {
        localStorage.setItem('freeRoamSurveyChoices', JSON.stringify({
            driveChoice,
            longChoice,
            fairwayChoice,
            shortChoice,
            puttChoice,
            driveNotSure,
            longNotSure,
            fairwayNotSure,
            shortNotSure,
            puttNotSure
        }));
    }

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
            if ((driveChoice.length > 0 || driveNotSure) && (longChoice.length > 0 || longNotSure) && (fairwayChoice.length > 0 ||
                fairwayNotSure) && (shortChoice.length > 0 || shortNotSure) && (puttChoice.length > 0 || puttNotSure)) {
                // save player information
                const submitResult = await postRequest('player/freeRoamSurvey', JSON.stringify({
                    drive: driveNotSure ? 0 : convertChoicesToNumber(driveChoice),
                    long: longNotSure ? 0 : convertChoicesToNumber(longChoice),
                    fairway: fairwayNotSure ? 0 : convertChoicesToNumber(fairwayChoice),
                    short: shortNotSure ? 0 : convertChoicesToNumber(shortChoice),
                    putt: puttNotSure ? 0 : convertChoicesToNumber(puttChoice),
                    playerId // example of one in db -> "06DB4206-1E4D-46E8-A261-AC8B545519FE"
                }));
                if (submitResult.success) {
                    // clear local storage
                    localStorage.removeItem('freeRoamSurveyChoices');
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
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
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
                                        onClick={() => 
                                        {
                                            // IF not everyone is finished skip a modal
                                            if (totalPlayers && surveysSubmitted && totalPlayers === surveysSubmitted) {
                                                advanceSession(sessionId, setHostClickedButton);
                                            } else {
                                                // NOT ALL PLAYERS FINISHED ask host if they really want to continue
                                                setShowVerificationModal(true);
                                            }

                                        }}
                                        disabled={!!hostClickedButton}
                                        type='primary'
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
                            onClick={() => {
                                // save current choices into memory so that they can be returned to after reviewing results
                                saveCurrentChoices();
                                props.setShowModuleResultsSurvey(true);
                            }}
                        >
                            Review Results
                        </Button>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Drive module?
                        </h3>
                        <div 
                            className={`CheckboxAndRadio ${attemptedSubmit && driveChoice.length === 0 && !driveNotSure ? 'ErrorCheckBox' : ''}`}
                        >
                            <Checkbox.Group
                                disabled={driveNotSure}
                                options={solverNames}
                                value={driveChoice}
                                onChange={(checkedValues) => { setDriveChoice(checkedValues) }}
                            />
                            <Radio
                                value={driveNotSure}
                                checked={driveNotSure}
                                onClick={(e) => setDriveNotSure(value => !value)}
                            >
                                Not Sure
                            </Radio>
                        </div>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Long module?
                        </h3>
                        <div 
                            className={`CheckboxAndRadio' ${attemptedSubmit && longChoice.length === 0 && !longNotSure ? 'ErrorCheckBox' : ''}`}
                        >
                            <Checkbox.Group
                                disabled={longNotSure}
                                options={solverNames}
                                value={longChoice}
                                onChange={(checkedValues) => { setLongChoice(checkedValues) }}
                            />
                            <Radio
                                value={longNotSure}
                                checked={longNotSure}
                                onClick={(e) => setLongNotSure(value => !value)}
                            >
                                Not Sure
                            </Radio>
                        </div>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Fairway module?
                        </h3>
                        <div 
                            className={`CheckboxAndRadio ${attemptedSubmit && fairwayChoice.length === 0 && !fairwayNotSure ? 'ErrorCheckBox' : ''}`}
                        >
                            <Checkbox.Group
                                disabled={fairwayNotSure}
                                options={solverNames}
                                value={fairwayChoice}
                                onChange={(checkedValues) => { setFairwayChoice(checkedValues) }}
                            />
                            <Radio
                                value={fairwayNotSure}
                                checked={fairwayNotSure}
                                onClick={(e) => setFairwayNotSure(value => !value)}
                            >
                                Not Sure
                            </Radio>
                        </div>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Short module?
                        </h3>
                        <div 
                            className={`CheckboxAndRadio ${attemptedSubmit && shortChoice.length === 0 && !shortNotSure ? 'ErrorCheckBox' : ''}`}
                        >
                            <Checkbox.Group
                                disabled={shortNotSure}
                                options={solverNames}
                                value={shortChoice}
                                onChange={(checkedValues) => { setShortChoice(checkedValues) }}
                            />
                            <Radio
                                value={shortNotSure}
                                checked={shortNotSure}
                                onClick={(e) => setShortNotSure(value => !value)}
                            >
                                Not Sure
                            </Radio>
                        </div>
                        <br></br>
                        <h3 className='FormTitle' id='ParticipationReason' >
                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                            Who is best for the Putt module?
                        </h3>
                        <div 
                            className={`CheckboxAndRadio ${attemptedSubmit && puttChoice.length === 0 && !puttNotSure ? 'ErrorCheckBox' : ''}`}
                        >
                            <Checkbox.Group
                                disabled={puttNotSure}
                                options={solverNames}
                                value={puttChoice}
                                onChange={(checkedValues) => { setPuttChoice(checkedValues) }}
                            />
                            <Radio
                                value={puttNotSure}
                                checked={puttNotSure}
                                onClick={(e) => setPuttNotSure(value => !value)}
                            >
                                Not Sure
                            </Radio>
                        </div>
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

            {
                showVerificationModal &&
                <VerificationModal
                    title="Not All Players Have Finished"
                    message="Not all players have finished the Survey. Are you sure you want to advance to the next round?"
                    confirm={() => advanceSession(sessionId, setHostClickedButton)}
                    cancel={() => setShowVerificationModal(false)}
                />
            }
        </div>
    )
}

export default FreeRoamSurvey;