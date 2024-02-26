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
                <div className='Hero'>
                    <div className='PictogramBlue'></div>
                    <div className='PictogramGreen'></div>
                    <div className='PictogramPink'></div>
                    <div className='PictogramOrange'></div>
                    <div className='WelcomeCard'>
                        <h1>
                            Welcome to STSELab's Golf Tournament
                        </h1>
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
                            STSELab Golf is a multiplayer game designed to introduce and teach Industrial Systems Engineering topics.
                            In this game rounds of golf represent Industrial Systems Engineering problems. The traditional method to solve
                            these problems is often to utilize a single large corporation for the entrie project. However, this game will 
                            demonstrate that breaking a problem down into smaller components and finding solutions that better fit each 
                            component can lead to better solutions. 
                        </p><p>   
                            Throughout rounds of golf, users will have increased freedom to choose different types of golfers to play specific portions of the course. 
                            These types of golfers are known as solvers and represent different potential avenues to solve a problem. 
                            They come with different trade offs in terms of costs and skill levels.
                            The number of shots needed to complete a round of golf is analogous to the time required to 
                            complete a real world project, and the cost is representative of the total cost spent on a solution. 
                        </p><p>   
                            The three options for solvers are: 1 Professional golfer, 3 long drive specialists, 
                            and 25 amateurs. When choosing the specialists and amateurs the results of all 3 or 25 golfers will be simulated and
                            the best result will be used. The three solvers represent ways that Industrial Systems Engineers can solve major 
                            manufacturing problems. Through experts, represented by the professional, through teams of specialists, 
                            represented by the long drive specialists, and through amateur crowd sourcing solutions, represented by the amateurs. 
                            The goal of this game is to show that while the traditional approach works very well for handling large problems,
                            breaking problems down into smaller components and finding solutions that better fit each component can lead to
                            improved results.
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
                            1) One player serves as the Host and and unlimited number of other users join the game.
                        </p><p>
                            2) Three practice rounds are played to familiarize players with the Solvers: Professional, Specialist, and Amateur.
                        </p><p>

                            3) An experimental round lets players test breaking the golf course down into smaller modules.
                        </p><p>

                            4) The tournament begins. It consists of four rounds each with a unique objective which will reward points. Players will choose how they want to break the golf course into modules, and what solvers they want for each module to best meet the objective.
                        </p><p>

                            5) The final results are shown, and the player who collected the most points wins the tournament.
                        </p>
                        {/* <p>
                            The game is played with one user who serves as the host, and an unlimited number of other users who join the game.
                            When the host creates a new game they will receive a code and link to share with all players who wish to join. Playing 
                            involves 4 rounds of golf, with 5 holes in each round. 
                            The host will control when the game progresses to the next round. 
                            In each round players will run the simulation and then see the results of all other players in the tournament for 
                            that round. At the end of the tournament the results of the entire game will be displayed. Finally users can view 
                            the aggregate results of all games played on the site. 
                        </p><p>   
                            The first round simulates the standard practice today, by having one professional golfer play the entire course.
                            This shows how well the professional is suited for handling each portion of the course. Players will simply run 
                            the simulation and see their results, which will be fairly close together.
                        </p><p>    
                            In the second round the players will each choose one type of golfer, or solver, to again play for them for the 
                            entire course. The player chooses between 1 Professional golfer, 3 long drive specialists, and 25 amateurs. These 
                            solvers will play for 5 holes and then the total scores of all players in the game will again be displayed. This time
                            there will be increased variation in the number of shots and costs based on the solvers chosen.
                        </p>
                        <p>   
                            In the third round players have increased freedom and are able to choose one solver to play the half of the golf 
                            course closer to the hole, and another solver to play the half of the golf course further from the hole. This allows
                            players to begin picking solvers based on their strengths. Players may select the same solver for both halves, in which
                            case the results will be the same as selecting one solver for the entire course. 
                        </p>
                        <p>   
                            Finally, In the fourth round players can choose ione solver type for driving from long range, another solver for 
                            playing mid-range, which is referred to as the fairway, and another solver for putting close to the hole. The player will 
                            choose their solver for each section of the course, and all 5 holes will be simulated with the chosen selection. The results
                            for the round will be shown again, and then the host can take all players in the session to a screen showing the combined 
                            results of the entire tournament. Good shooting!
                        </p> */}
                    </div>
                </div>
                <div className='DialogCard'>
                    <h2 className='CollapsableTitle' onClick={() => {setCollapseLearn(val => !val)}}>
                        Research and Credits
                        {
                            collapseLearn ?
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m240.971 130.524 194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04l-154.746-154.02-154.745 154.021c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941l194.343-194.343c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>                            
                            :
                            <svg className='ChevronIcon' viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m207.029 381.476-194.343-194.344c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04l154.746 154.021 154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941l-194.342 194.344c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>                        
                        }
                    </h2>
                    <div className='CollapsableSection' style={{maxHeight: collapseLearn ? '0px' : '1000px'}}>
                        <p>
                            The research on this subject, including use of the golf simulation, is found in the paper: "Towards a solver-aware systems 
                            architecting framework: leveraging experts, specialists and the crowd to design innovative complex systems" by 
                            Zoe Szajnfarber, Taylan G. Topcu, and Hila Lifshitz-Assaf. The paper is available &nbsp;
                            <a href='https://www.cambridge.org/core/journals/design-science/article/towards-a-solveraware-systems-architecting-framework-leveraging-experts-specialists-and-the-crowd-to-design-innovative-complex-systems/A2BE1A0A4384E2859915F209383228D5'>
                                 here
                            </a>
                        </p><p>   
                            The abstract: 
                            This article proposes the solver-aware system architecting framework for leveraging the combined strengths of 
                            experts, crowds and specialists to design innovative complex systems. Although system architecting theory has 
                            extensively explored the relationship between alternative architecture forms and performance under operational 
                            uncertainty, limited attention has been paid to differences due to who generates the solutions. The recent rise 
                            in alternative solving methods, from gig workers to crowdsourcing to novel contracting structures emphasises the 
                            need for deeper consideration of the link between architecting and solver-capability in the context of complex 
                            system innovation. We investigate these interactions through an abstract problem-solving simulation, representing 
                            alternative decompositions and solver archetypes of varying expertise, engaged through contractual structures that 
                            match their solving type. We find that the preferred architecture changes depending on which combinations of solvers 
                            are assigned. In addition, the best hybrid decomposition-solver combinations simultaneously improve performance and 
                            cost, while reducing expert reliance. To operationalise this new solver-aware framework, we induce two heuristics for 
                            decomposition-assignment pairs and demonstrate the scale of their value in the simulation. We also apply these two 
                            heuristics to reason about an example of a robotic manipulator design problem to demonstrate their relevance in 
                            realistic complex system settings.
                        </p><p>   
                            This web application utilizes the golf simulation written in R from the research paper. The web application 
                            was created by Jacob Conklin.
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