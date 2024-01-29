import { Button, ColorPicker, DatePicker, Input, InputNumber, Select } from 'antd';
import './Register.scss';
import { useContext, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { UserInformation } from '../../Utils/Types';
import { UserContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';

// Register
const Register = (props: any) => {

    const [isSuccesfullySubmitted, setIsSuccesfullySubmitted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [num, setNum] = useState<string | number | null>(0);
    const [pet, setPet] = useState('None');
    const [color, setColor] = useState('#000000');
    const [joinCode, setJoinCode] = useState('');

    // disable submit button so it cannot be clicked more than once
    const [submitting, setSubmitting] = useState(false);

    // setIsHost can be retreived from context
    const { setIsHost } = useContext(UserContext) as any;
    // If playerType is 'host' then user is creating a new session, for any other value
    // (which should be 'join') then the user is joining a session.
    const { playerType } = useParams();
    // take users to session screen on successful submit
    const navigate = useNavigate();

    const submit = async () => {
        // if successful give a happy message, otherwise let them know after an error from the backend
        try {
            // Save to context whether a player is joining or hosting the session. The Player's unique playerId
            // will also need to be saved.
            // TODO save player ID to localstorage or cookies beyond just context. 
            if (playerType === 'host') {
                setSubmitting(true);
                const newUser: UserInformation = {
                    firstName,
                    lastName,
                    num: num ? parseInt(num.toString()) : 0,
                    birthDate,
                    pet,
                    color
                }
                const submitResult = await postRequest('player/host', JSON.stringify({...newUser}))
                if (submitResult.success) {
                    setIsSuccesfullySubmitted(true);
                    setIsHost(true);
                    navigate('/session');
                } else {
                    alert("Failed to submit form.");
                    console.log(submitResult)
                    setSubmitting(false);
                }
            } else {
                setSubmitting(true);
                const newUser: UserInformation = {
                    firstName,
                    lastName,
                    num: num ? parseInt(num.toString()) : 0,
                    birthDate,
                    pet,
                    color
                }
                const submitResult = await postRequest('player/join', JSON.stringify({...newUser, joinCode}))
                if (submitResult.success) {
                    setIsSuccesfullySubmitted(true);
                    setIsHost(false);
                    navigate('/session');
                } else {
                    alert("Failed to submit form.");
                    console.log(submitResult)
                    setSubmitting(false);
                }
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message);
            setSubmitting(false);
        }
    }

    return (
        <div className='Register'>
            <div className='Login'>
                <h1>{playerType === 'host' ? "Register to Create and Host a Session" : "Register to Join an Ongoing Session"}</h1>
                {
                    isSuccesfullySubmitted ?
                    <div className='SuccessfulSubmit'>
                        <h3>Congratulations your form has successfully been submitted!</h3>
                        <img src='https://media.tenor.com/LEhC5W9BQBIAAAAj/svtl-transparent.gif' alt='Success' />
                    </div>
                    :
                    <div className='InputForm'>
                        <p>First Name</p>
                        <Input 
                            placeholder='Jane'
                            maxLength={20}
                            value={firstName}
                            onChange={(event) => {
                                setFirstName(event.target.value && event.target.value.length > 20 ? event.target.value.substring(0, 20) : event.target.value);
                            }}
                        />
                        <p>Last Name</p>
                        <Input 
                            placeholder='Doe'
                            maxLength={20}
                            value={lastName}
                            onChange={(event) => {
                                setLastName(event.target.value && event.target.value.length > 20 ? event.target.value.substring(0, 20) : event.target.value);
                            }}
                        />
                        <p>Date of Birth</p>
                        <DatePicker
                            onChange={(date, dateString) => {
                                setBirthDate(dateString);
                            }}
                        />
                        <p>Favorite Number 1 - 99</p>
                        <InputNumber 
                            min={1}
                            max={99}
                            value={num}
                            onChange={setNum}
                        />
                        <p>Favorite Pet</p>
                        <Select 
                            defaultValue="None"
                            options={[
                                {value: 'None', label: 'None'},
                                {value: 'Dog', label: 'Dog'},
                                {value: 'Cat', label: 'Cat'},
                                {value: 'Fish', label: 'Fish'},
                                {value: 'Bird', label: 'Bird'},
                                {value: 'Other', label: 'Other'},
                            ]}
                            onChange={(newValue) => {
                                setPet(newValue);
                            }}
                        />
                        <div className='GolfBallContainer'>
                            <p>Golf ball</p>
                            <svg className='GolfBall' fill={color} stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m14 9a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm0-3a1 1 0 1 0 1 1 1 1 0 0 0 -1-1zm-2-4a10 10 0 1 0 10 10 10 10 0 0 0 -10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1 -8 8zm5-12a1 1 0 1 0 1 1 1 1 0 0 0 -1-1z"/></svg>
                        </div>
                        <ColorPicker
                            showText
                            disabledAlpha
                            defaultValue={'#000000'}
                            onChange={(value, hex) => {
                                setColor(hex);
                            }}
                        />
                        {
                            // If player is joining and not a host make them put in the join code
                            playerType !== 'host' &&
                            <div>
                                <p>Join Code</p>
                                <Input 
                                    placeholder='123456'
                                    maxLength={6}
                                    value={joinCode}
                                    onChange={(event) => {
                                        setJoinCode(event.target.value && event.target.value.length > 6 ? event.target.value.substring(0, 6) : event.target.value);
                                    }}
                                />
                            </div>
                        }
                        <br>
                        </br>
                        <div className='ButtonHolder'>
                            <Button 
                                disabled={!firstName || !lastName || !num || !birthDate || submitting || (playerType !== 'host' && !joinCode) } 
                                onClick={submit}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Register;