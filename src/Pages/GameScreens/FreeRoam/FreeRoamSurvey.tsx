import {
    Button,
    ColorPicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Table,
  } from 'antd';
import './FreeRoamSurvey.scss';
import { useContext, useEffect, useState } from 'react';
import { postRequest } from '../../../Utils/Api';
import { UserContext } from '../../../App';

// FreeRoamSurvey
const FreeRoamSurvey = (props: any) => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    // To make choices simple to store, can use values of:
    // 1 -> Professional
    // 2 -> Amateur
    // 3 -> Specialist
    // 4 -> Professional and Amateur
    // 5 -> Professional and Specialist
    // 6 -> Amateur and Specialist
    // 7 -> Professional, Amateur, and Specialist (could be stored in 3 bits!)
    const [isSuccesfullySubmitted, setIsSuccesfullySubmitted] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [driveChoice, setDriveChoice] = useState('');

    const modules = ["Drive", "Long", "Fairway", "Short", "Putt"]

    const { isHost } = useContext(UserContext);

    const submit = async () => {
        // if successful give a happy message, otherwise let them know after an error from the backend
        try {
            setSubmitting(true);
            setAttemptedSubmit(true);
            // TODO check for all 5 modules having values
            if (driveChoice) {
                // save player information
                const submitResult = await postRequest('player/freeRoamSurvey', JSON.stringify({
                    driveChoice,
                }));
                if (submitResult.success) {
                    setIsSuccesfullySubmitted(true);
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
                isSuccesfullySubmitted ? 
                <div className='SuccessfullySubmittedMessage'>
                    <h1>Well Done</h1>
                    <p> _______ Players still filling out survey</p>
                    {/* Take # of players in session - number of surveys in db (which will have to come with status? -> maybe should be written in session to make polling easy) */}
                    {
                        isHost ?
                        <div>
                            <h3>Continue the game for all players when you are ready</h3>
                            <Button>Continue</Button>
                        </div>
                        :
                        <div>
                            <h3>Wait for the host to continue the game</h3>
                        </div>
                    }
                </div>
                :
                <div className='SurveyForms'>
                    <h3>Please select who you believe are the best solvers for each module. You may select more than one.</h3>
                        <p className='FormTitle' id='ParticipationReason' >
                            <span style={{color: 'red', fontSize: 'large'}}>* </span>
                            Why are you interested in playing?
                        </p>
                        <Select 
                            className={attemptedSubmit && !driveChoice ? "ErrorForm" : "" }
                            defaultValue=""
                            options={[
                                {value: '', label: ''},
                                {value: 'Class activity', label: 'Class activity'},
                                {value: 'Leisure', label: 'Leisure'},
                                {value: 'Academic workshop', label: 'Academic workshop'},
                                {value: 'Professional training', label: 'Professional training'},
                                {value: 'Other', label: 'Other'},
                            ]}
                            onChange={(newValue) => {
                                setDriveChoice(newValue);
                            }}
                        />
                        <br>
                        </br>
                        <div className='ButtonHolder'>
                            <Button 
                                disabled={ submitting } 
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