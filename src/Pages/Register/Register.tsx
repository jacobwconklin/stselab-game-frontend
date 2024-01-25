import { Button, ColorPicker, DatePicker, Input, InputNumber, Select } from 'antd';
import './Register.scss';
import { useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { UserInformation } from '../../Utils/Types';

// Register
const Register = (props: any) => {

    const [isSuccesfullySubmitted, setIsSuccesfullySubmitted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [num, setNum] = useState<string | number | null>(0);
    const [pet, setPet] = useState('None');
    const [color, setColor] = useState('#FFFFFF');
    // disable submit button so it cannot be clicked more than once
    const [submitting, setSubmitting] = useState(false);

    // isHost should be saved in context.

    const submit = async () => {
        // if successful give a happy message, else let them know after an error from the backend
        try {
            setSubmitting(true);
            const newUser: UserInformation = {
                firstName,
                lastName,
                num: num ? parseInt(num.toString()) : 0,
                birthDate,
                pet,
                color
            }
            const submitResult = await postRequest('submitform', JSON.stringify({...newUser}))
            if (submitResult.success) {
                setIsSuccesfullySubmitted(true);
            } else {
                alert("Failed to submit form.");
                console.log(submitResult)
                setSubmitting(false);
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message);
            setSubmitting(false);
        }
    }

    return (
        <div className='Register'>
            <h1>Register</h1>
            <div className='Login'>
                
                {/* example hitting backend successfully
                <Button onClick={async () => {
                    const count = await getRequest('addcount');
                    alert("Count is: " + count.count);
                }}></Button> */}
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
                        <p>Golf ball color</p>
                        <ColorPicker
                            showText
                            disabledAlpha
                            defaultValue={'#FFFFFF'}
                            onChange={(value, hex) => {
                                setColor(hex);
                            }}
                        />
                        {/* could assign users random scores <div className='ScoreMaker'>
                            <div className='ScoreDisplay'>
                                Score: {score}
                            </div>
                            <Button>
                                Get Random Score
                            </Button>
                            <div className='DiceResult'>

                            </div>
                        </div> */}
                        {
                            // If player is joining and not a host make them put in the join code
                        }
                        <br>
                        </br>
                        <div className='ButtonHolder'>
                            <Button disabled={!firstName || !lastName || !num || !birthDate || submitting } onClick={submit}>Submit</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Register;