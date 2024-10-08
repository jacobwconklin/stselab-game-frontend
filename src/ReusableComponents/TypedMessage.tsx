import { Button } from "antd";
import { useEffect, useState } from "react";
import './TypedMessage.scss';

// Used at the start of the Golf Tournament and Mechanical Arm simulation 
const TypedMessage = (props: {
    type: string,
    confirm: () => void,
}) => {

    
    const golfMessage = "You have been selected to play in the STSELab Golf Tournament.\n Rather than play directly you will be choosing golfers to play the tournament for you.\n You will play 4 practice rounds to learn about the golfers you can select and how you can assign them to play different portions of the course.\n Then you will play 4 tournament rounds that are scored on specific objectives given to you.\n The player with the highest total score at the end of the tournament wins.\n \n Good luck!";

    const armMessage = "The International Space Station requires a new mechanical arm to complete its mission.\n You are in charge of hiring the right people to get it done.\n The arm needs to be as light as possible to save on fuel costs, but you also have a limited budget.\n Minimizing mass will allow the arm to be transported and installed more easily, and you can assume all other design requirements will be met while minimizing mass. \n You will compete with other agents to determine who can build the best arm.\n You will have 1 exploration round to learn about the solvers and components.\nThen you will play 4 rounds where you will be scored based on an objective given to you. In each round you must select a decomposition of the problem, and then for each subproblem select a solver out of the available solver types.\n  The agent with the highest total score will be selected for the mission. \n \n We are counting on you!";

    const text = props.type === "golf" ? golfMessage : armMessage;
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const delay = 40; // adjust the speed of the typing

        if (currentIndex < text.length) {
          const timeout = setTimeout(() => {
            setCurrentText(prevText => prevText + text[currentIndex]);
            setCurrentIndex(prevIndex => prevIndex + 1);
          }, delay);
      
          return () => clearTimeout(timeout);
        }
      }, [currentIndex, text]);




    return (
        <div className="TypedMessage"
            style={{margin: '0px'}}
        >
            <div className='ModalBody'>
                <h1 className='title-font'> {props.type === "golf" ? "Welcome to the STSELab Golf Tournament!" : 
                "Congratulations, You have been tasked with building a mission critical component for the International Space Station"} </h1>
                {
                    // split current text by new lines
                    currentText.split('\n').map((text, index) => {
                        return <p key={index}>{text}</p>
                    })
                }
                <br />
                <div className='ModalButtons'>
                    <Button
                        onClick={ async () => {
                            props.confirm();
                        }}
                        // disabled={currentIndex < text.length} // Coould leave disabled until message terminates
                        type="primary"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TypedMessage;