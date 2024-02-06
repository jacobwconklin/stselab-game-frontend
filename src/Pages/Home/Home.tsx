import { Button } from 'antd';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Home
const Home = (props: any) => {

    const navigate = useNavigate();
    const [collapseWhat, setCollapseWhat] = useState(false);
    const [collapseHow, setCollapseHow] = useState(false);
    const [collapseLearn, setCollapseLearn] = useState(false); 

    return (
        <div className='Home'>
            <div className='Contents'>
                {/* TODO add hero image for welcoming players to home page */}
                <div className='Hero'>
                    <div className='PictogramBlue'></div>
                    <div className='PictogramGreen'></div>
                    <div className='PictogramPink'></div>
                    <div className='PictogramOrange'></div>
                    <div className='WelcomeCard'>
                        <h1>
                            Welcome to STSELab's Golf Tournament
                        </h1>
                        {/* <div>
                            <p>
                                This free multiplayer game is designed to be instructional and fun. You will learn about Industrial 
                                Systems Engineering concepts, support research, play golf, and have a chance to beat your 
                                competitors all at the same time!
                            </p>
                        </div> */}
                    </div>
                </div>
                <div className='DialogCard'>
                    <h2 className='CollapsableTitle' onClick={() => {setCollapseWhat(val => !val)}}>
                        What is STSELab Golf
                        {
                            collapseWhat ?
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                            
                            :
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                        
                        }    
                    </h2>
                    <div className='CollapsableSection' style={{maxHeight: collapseWhat? '0px': '1000px'}}>
                        <p>
                            STSELab Golf is a multiplayer game designed to teach and introduce Industrial Systems Engineering topics.
                            In this game players will get to select golfers for various tasks on the golf course in order to acheive the lowest
                            score possible, without going over an alloted cost. The different types of golfers that the player can choose from are 
                            known as the solvers. 

                            edit this - usually you pick your golf club but with this game you pick your golfer.
                        </p><p>   
                            The three options for solvers are: 1 Professional golfer, 3 long drive specialists, 
                            and 50 amatuers. When choosing the specialists and amatuers the results of all 3 or 50 golfers will be simulated and
                            the best result will be used. The three solvers represent ways that Industrial Systems Engineers can solve major 
                            manufacturing problems. Through major companies, represented by the professional, through teams of specialists, 
                            represented by the long drive specialists, and through amateur crowd sourcing solutions, represented by the amatuers. 
                        </p><p>   
                            Each solver comes with their own costs and drawbacks, and the player hopes to optimize the number of shots needed as 
                            well as this overall cost. The shots needed represent time required to complete real world challenges, and the cost will
                            be the cost of a solution.
                        </p>
                    </div>
                </div>
                <div className='DialogCard'>
                    <h2 className='CollapsableTitle' onClick={() => {setCollapseHow(val => !val)}}>
                        How to Play
                        {
                            collapseHow ?
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                            
                            :
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                        
                        }    
                    </h2>
                    <div className='CollapsableSection' style={{maxHeight: collapseHow ? '0px' : '1000px'}}>
                        <p>
                            The game is played with one user who serves as the host, and an unlimited number of other users who join the game.
                            When the host creates a new game they will receive a code to share with all players who wish to join. Playing 
                            involves 3 rounds of golf. 
                        </p><p>   
                            In the first round the players will choose one type of golfer, or solver, to play for them for the 
                            entire course. The player chooses between 1 Professional golfer, 3 long drive specialists, and 50 amatuers. These 
                            solvers will play for 5 holes and then the total scores of all players in the game will be displayed. 
                        </p><p>    
                            Next in the second round the players will choose one solver for each of the 5 holes on the course. 
                        </p><p>   
                            Finally in the third round the player can choose a solver type for driving, mid-range, and putting. This means 
                            that for each hole, the 
                        </p>
                    </div>
                </div>
                <div className='DialogCard'>
                    <h2 className='CollapsableTitle' onClick={() => {setCollapseLearn(val => !val)}}>
                        Theories and Research
                        {
                            collapseLearn ?
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                            
                            :
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                        
                        }
                    </h2>
                    <div className='CollapsableSection' style={{maxHeight: collapseLearn ? '0px' : '1000px'}}>
                        <p>
                            Teach ....

                        </p><p>   
                            Based on research by ...

                        </p><p>   
                            utilizing ... 

                        </p>
                    </div>
                </div>
                <div className='DialogCard BeginGameCard'>
                    <h1>Ready to Begin?</h1>
                    <p>Choose below to join a running tournament or to host and create a new game</p>
                    <div className='BeginButtons'>
                        <Button
                            onClick={() => {
                                navigate('/register/host');
                            }}
                        >
                            Host a new Game
                        </Button>
                        <Button
                            onClick={() => {
                                navigate('/register/join');
                            }}
                        >
                            Join a Tournament 
                        </Button>
                    </div>
                </div>
                {/* <Button onClick={() => navigate('/Results')}>View Past Results</Button> */}
                <br></br>
            </div>
        </div>
    )
}

export default Home;