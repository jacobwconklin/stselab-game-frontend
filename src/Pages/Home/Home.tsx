import { Button } from 'antd';
import './Home.scss';
import { useState } from 'react';
import DemographicForm from '../DemographicForm';
import { useNavigate } from 'react-router-dom';

// Home
const Home = (props: any) => {

    const [formIsStarted, setFormIsStarted] = useState(false);

    const navigate = useNavigate();

    return (
        <div className='Home'>
            <div className='Contents'>
                <br></br>
                <div className='WelcomeCard'>
                    <h1>Welcome to STSELab's Demo App!</h1>
                    <p>
                        This is a proof of concept to collect user demographic data and will be built out to run an online 
                        multiplayer game with the goal of teaching Industrial Systems Engineering topics. Please take the 
                        quiz below to test the website and feel free to make up any information as it is still a demo.
                    </p>
                </div>
                {
                    formIsStarted ? 
                    <DemographicForm />
                    :
                    <Button onClick={() => setFormIsStarted(true)} >Begin Form</Button>
                }
                <Button onClick={() => navigate('/Results')}>View All Results</Button>
                <br></br>
            </div>
        </div>
    )
}

export default Home;