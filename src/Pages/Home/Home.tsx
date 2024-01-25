import { Button } from 'antd';
import './Home.scss';
import { useState } from 'react';
import DemographicForm from '../DemographicForm';
import { useNavigate } from 'react-router-dom';

// Home
const Home = (props: any) => {

    const R = require('r-script');

    const runR = () => {
        let result = R.executeRCommand("max(1,2,3)");
        console.log(result);

        // let result = R.executeRScript("./scripts/test.R");
        // console.log(result);

        var out = R("test.r")
            .data("hello world", 20)
            .callSync();
            
        console.log(out);
    }

    const [formIsStarted, setFormIsStarted] = useState(false);

    const navigate = useNavigate();

    return (
        <div className='Home'>
            <div className='Contents'>
                <br></br>
                <div className='WelcomeCard'>
                    <h1>Welcome to STSELab's Golf Tournament</h1>
                    <p>
                        This is a proof of concept to collect user demographic data and will be built out to run an online 
                        multiplayer game with the goal of teaching Industrial Systems Engineering topics. Please take the 
                        quiz below to test the website and feel free to make up any information as it is still a demo.
                    </p>
                </div>
                <p>More cards with information about what and why and how to play and what is host vs join</p>
                
                <Button
                    onClick={() => {
                        // run local r script here
                        runR();
                    }}
                >
                    Run R
                </Button>

                <div className='BeginButtons'>
                    <Button>
                        Host a new Game
                    </Button>
                    <Button>
                        Join a Tournament
                    </Button>
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