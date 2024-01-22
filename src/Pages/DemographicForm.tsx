import { Button, Input } from 'antd';
import './DemographicForm.scss';
import { useState } from 'react';

// DemographicForm
const DemographicForm = (props: any) => {

    const [isSuccesfullySubmitted, setIsSuccesfullySubmitted] = useState(false);

    const submit = () => {
        // if successful give a happy message, else let them know after an error from the backend
        try {

        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message);
        }
    }

    return (
        <div className='DemographicForm'>
            {
                isSuccesfullySubmitted ?
                <div className='SuccessfulSubmit'>
                    <h3>Congratulations your form has successfully been submitted!</h3>
                    <img src='https://media.tenor.com/LEhC5W9BQBIAAAAj/svtl-transparent.gif' alt='Success' />
                </div>
                :
                <div className='InputForm'>
                    <p>First Name</p>
                    <Input />
                    <p>Last Name</p>
                    <Input />
                    <p>Age</p>
                    <Input type='number' />
                    <br>
                    </br>
                    <div className='ButtonHolder'>
                        <Button onClick={submit}>Submit</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default DemographicForm;