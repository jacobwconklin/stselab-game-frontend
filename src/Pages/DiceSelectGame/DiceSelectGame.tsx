import { useContext, useEffect, useState } from 'react';
import './DiceSelectGame.scss';
import { Button } from 'antd';
import d6 from '../../Assets/Die/d6.png';
import d8 from '../../Assets/Die/d8.png';
import d10 from '../../Assets/Die/d10.png';
import d12 from '../../Assets/Die/d12.png';
import d20 from '../../Assets/Die/d20.png';
import { postRequest } from '../../Utils/Api';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import TextArea from 'antd/es/input/TextArea';
import { inDevMode, saveObjectToStorage } from '../../Utils/Utils';
const DiceSelectGame = (props: {
    isOnboarding: boolean;
    finished: () => void;
}) => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // props will tell if it is the oboarding or offboarding version of the game.
    const [credits, setCredits] = useState(props?.isOnboarding ? 8 : 8);
    const [totalToReach] = useState(props?.isOnboarding ? 12 : 12);
    const [randomRoll, setRandomRoll] = useState(0);
    const [selectedDie, setSelectedDie] = useState<{ val: number; cost: number; img: string; }[]>([]);
    const [clickedRoll, setClickedRoll] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [reasoning, setReasoning] = useState('');
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [finalReasoning, setFinalReasoning] = useState('');
    // const [reasoning1, setReasoning1] = useState('');
    const [reasoning2, setReasoning2] = useState('');
    const [reasoning3, setReasoning3] = useState('');
    const [reasoning4, setReasoning4] = useState('');
    const [reasoning5, setReasoning5] = useState('');

    // player id will be pulled from context
    const { playerId, sessionId } = useContext(UserContext) as UserContextType;

    // could make border of the die the player's chosen color maybe?
    // die must have image, and val
    const die = [
        {
            val: 6,
            cost: 2,
            img: d6
        },
        {
            val: 8,
            cost: 3,
            img: d8
        },
        {
            val: 10,
            cost: 4,
            img: d10
        },
        {
            val: 12,
            cost: 5,
            img: d12
        },
        {
            val: 20,
            cost: 6,
            img: d20
        }
    ];

    // check if total of selected die AT LEAST reaches the totalToReach
    const selectedDieCanReachTotal = () => {
        let sum = 0;
        selectedDie.forEach(die => {
            sum += die.val;
        });
        return sum >= totalToReach;
    }

    // recur through the selected die
    // index is the current die being cycled through, 
    const recursiveCorrectPossibilities = (index: number, sum: number): number => {
        if (index === selectedDie.length - 1) {
            // this is the final die, check if sum is >= the total to reach and add to total 
            let correctPossibilitiesFound = 0;
            // loop through values of die at current index
            for (let i = 1; i <= selectedDie[index].val; i++) {
                if (sum + i >= totalToReach) {
                    correctPossibilitiesFound++;
                };
            }
            return correctPossibilitiesFound;
        }

        let totalCorrectPossibilitesFound = 0;
        // loop through values of die at current index
        for (let i = 1; i <= selectedDie[index].val; i++) {
            totalCorrectPossibilitesFound += recursiveCorrectPossibilities(index + 1, sum + i);
        }

        return totalCorrectPossibilitesFound;

    }

    // score selected die by telling probability that roll >= desired total
    const scoreSelectedDie = () => {
        // set total number of possibilities
        let totalNumberOfPossibilities = 1;
        selectedDie.forEach(die => {
            totalNumberOfPossibilities *= die.val;
        });

        // Going to do a semi-ugly brute force calculation.
        // for each possible value of each die check all other possible values of all other die and whenever 
        // the sum is >= the desired total increment the totalNumberOfCorrectPossibilities
        // use recursive function to do this.
        const totalNumberOfCorrectPossibilities = recursiveCorrectPossibilities(0, 0)

        return 100 * (totalNumberOfCorrectPossibilities / totalNumberOfPossibilities);
    }

    // finish on / offboarding by rolling die
    const rollDie = () => {
        // set player's random value:
        let playerRandomRoll = 0;
        selectedDie.forEach(die => {
            playerRandomRoll += Math.floor(Math.random() * die.val) + 1;
        });
        setRandomRoll(playerRandomRoll);

        setShowModal(true);
    }

    // save reasoning to database and move on
    const saveAndContinue = async () => {
        // save die roll results to database then allow player to view the next page
        try {
            setClickedRoll(true);

            // save results to database
            const result = await postRequest('player/diceResult', JSON.stringify({
                d4: selectedDie.filter(die => die.val === 4).length,
                d6: selectedDie.filter(die => die.val === 6).length,
                d8: selectedDie.filter(die => die.val === 8).length,
                d10: selectedDie.filter(die => die.val === 10).length,
                d12: selectedDie.filter(die => die.val === 12).length,
                d20: selectedDie.filter(die => die.val === 20).length,
                playerId,
                onboarding: props.isOnboarding,
                score: scoreSelectedDie(),
                reasoning,
                // reasoning1,
                reasoning2,
                reasoning3,
                reasoning4,
                reasoning5,
                
                finalReasoning
            }));
            if (result.success) {
                // save results to local storgae in case user refreshes page and move on
                saveObjectToStorage("diceGameFinished", { sessionId, playerId, onboarding: props.isOnboarding });
                // props.finished();
                setShowModal(false); // Hide the first modal
                // setShowSecondModal(true);
                if (props.isOnboarding) {
                    // If onboarding, finish immediately
                    props.finished();
                } else {
                    // If offboarding, show the second modal
                    setShowSecondModal(true);
                }
            } else {
                console.error("Error saving dice results to database during: ", props.isOnboarding ? "onboarding" : "offboarding", result);
                setClickedRoll(false);
            }
        } catch (error) {
            console.error(error);
            setClickedRoll(false);
        }
    }

    return (
        // just give it a solid colored background?
        <div className='DiceSelectGame'>
            <div className='StaticBackground' />
            <div className='Instructions'>
                <h1>Goal: Roll a Sum of at Least {totalToReach}</h1>
                <h2>Remaining Credits: {credits}</h2>
                <p>
                    {
                        props.isOnboarding ?
                            "Play the Dice Game to join your session! You have " + credits + " credits to spend by selecting die to roll. Your goal is for the sum of all die you roll to be at least " + totalToReach + ". You may only roll once. Select die to roll below. Then click the image of the die here to remove them if you want to change your selection."
                            :
                            `Play the Dice Game to view your final results! You now have ${credits} credits to spend by selecting die to roll. Your goal is for the sum of all die you roll to be at least ${totalToReach}. You may only roll once. Select die to roll below. Then click the image of the die here to remove them if you want to change your selection.`
                    }
                </p>
                <div className='SelectedDie'>
                    {
                        selectedDie.map((die, index) => {
                            return (
                                <div className='NameAndImage' key={index}>
                                    <h3>D{die.val}</h3>
                                    <img src={die.img} className='DiceImage' alt='die' onClick={() => {
                                        setSelectedDie(selectedDie => selectedDie.filter((d, i) => i !== index))
                                        setCredits(credits => credits + die.cost);
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>
                <Button
                    disabled={!selectedDieCanReachTotal() || clickedRoll}
                    onClick={() => {
                        rollDie();
                    }}
                >
                    Roll
                </Button>
            </div>
            <div className='DiceContainer'>
                {
                    die.map((die, index) => {
                        return (
                            <div className='DiceCard' key={index}>
                                <h2>D{die.val}</h2>
                                <h3>Cost: {die.cost} Credits</h3>
                                <img src={die.img} className='DiceImage' alt='die' />
                                <Button
                                    disabled={credits < die.cost}
                                    onClick={() => {
                                        setCredits(credits => credits - die.cost);
                                        setSelectedDie(selectedDie => selectedDie.concat([die]))
                                    }}
                                >
                                    Select
                                </Button>
                            </div>
                        )
                    })
                }
            </div>
            {
                // show modal view for set amount of seconds displaying message
                showModal &&
                <div className='Modal'
                // Can have click out here but they may not read
                >
                    <div className='ModalBody'>
                        <h2>
                            You rolled: {randomRoll}
                        </h2>
                        <p>
                            {/* {randomRoll >= totalToReach ? " Congratulations!" : " Better Luck Next Time!"} */}
                        </p>
                        
                        {/* {
                            !props.isOnboarding &&
                            <p>
                                The probaility that you would roll a sum of at least {totalToReach} was {scoreSelectedDie().toFixed(2)}%
                            </p>
                        } */}
                        <h2 style={{ width: '100%', textAlign: 'center' }} >
                            Briefly, could you please explain why you picked this dice combo?
                        </h2>
                        <TextArea
                            autoSize
                            placeholder='Enter your reasoning here'
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={1000}
                            value={reasoning}
                            onChange={(event) => {
                                setReasoning(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 1000) : event.target.value);
                            }}
                        />
                        <br></br>
                        <Button
                            disabled={!inDevMode() && reasoning.trim().length < 10}
                            onClick={() => {
                                saveAndContinue();
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            }
            {
            // !props.isOnboarding && showSecondModal &&
            showSecondModal &&
            <div 
            className='Modal' 
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '1200px', // Adjust as needed
                maxHeight: '300vh', // Limit the height of the modal
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.3)',
                overflow: 'auto', // Prevent content overflow outside the modal
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div 
                className='ModalBody' 
                style={{
                    padding: '10px',
                    width: '97%',
                    maxHeight: '290vh', // Adjust based on Modal max-height
                    overflowY: 'visible',
                    // flexGrow: 1 // Enable vertical scrolling if content overflows
                }}
            >
                    <h2 style={{ marginBottom: '1px', width: '100%', fontSize: '18px'}}> 1. Compared to the first dice roll, do you think the golf game influenced your decision making for this question? If it did, could you briefly explain how?</h2>
                    <TextArea
                            autoSize
                            // placeholder='Enter your input here'
                            style={{
                                width: '100%', // Make TextArea take up full width
                                marginBottom: '0px',
                                padding: '5px',
                                fontSize: '18px',
                                boxSizing: 'border-box',
                                height:'max-content',
                            }}
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={3000}
                            value={finalReasoning}
                            onChange={(event) => {
                                setFinalReasoning(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 3000) : event.target.value);
                            }}
                        />
                        <br></br>

                    <h2 style={{ marginBottom: '1px', width: '100%', fontSize: '18px'}}> 2. Could you please list any good heuristics that you were able to identify in this game?</h2>
                    <TextArea
                            autoSize
                            // placeholder='Enter your input here'
                            style={{
                                width: '100%', // Make TextArea take up full width
                                marginBottom: '0px',
                                padding: '5px',
                                fontSize: '18px',
                                boxSizing: 'border-box',
                                height:'max-content',
                            }}
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={3000}
                            value={reasoning2}
                            onChange={(event) => {
                                setReasoning2(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 3000) : event.target.value);
                            }}
                        />
                        <br></br>

                    <h2 style={{ marginBottom: '1px', width: '100%', fontSize: '18px'}}> 3. Do you think the heuristics you listed in the previous question could be applicable to real-world problems? Please briefly explain why? </h2>
                    <TextArea
                            autoSize
                            // placeholder='Enter your input here'
                            style={{
                                width: '100%', // Make TextArea take up full width
                                marginBottom: '0px',
                                padding: '5px',
                                fontSize: '18px',
                                boxSizing: 'border-box',
                                height:'max-content',
                            }}
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={3000}
                            value={reasoning3}
                            onChange={(event) => {
                                setReasoning3(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 3000) : event.target.value);
                            }}
                        />
                        <br></br>
                    
                    <h2 style={{ marginBottom: '1px', width: '100%', fontSize: '18px'}}> 4. Could you please list any bad heuristics that you were able to identify in this game? </h2>
                    <TextArea
                            autoSize
                            // placeholder='Enter your input here'
                            style={{
                                width: '100%', // Make TextArea take up full width
                                marginBottom: '0px',
                                padding: '5px',
                                fontSize: '18px',
                                boxSizing: 'border-box',
                                height:'max-content',
                            }}
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={3000}
                            value={reasoning4}
                            onChange={(event) => {
                                setReasoning4(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 3000) : event.target.value);
                            }}
                        />
                        <br></br>

                    <h2 style={{ marginBottom: '1px', width: '100%', fontSize: '18px'}}>5. Do you think the bad heuristics you listed in the previous question could be applicable to real-world problems? Please briefly explain why? </h2>
                    <TextArea
                            autoSize
                            // placeholder='Enter your input here'
                            style={{
                                width: '100%', // Make TextArea take up full width
                                marginBottom: '0px',
                                padding: '5px',
                                fontSize: '18px',
                                boxSizing: 'border-box',
                                height:'max-content',
                            }}
                            // style={{width: '80%', margin: 'auto'}}
                            maxLength={3000}
                            value={reasoning5}
                            onChange={(event) => {
                                setReasoning5(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 3000) : event.target.value);
                            }}
                        />
                        <br></br>
                        <Button
                            disabled={!inDevMode() && reasoning5.trim().length < 10}
                            onClick={() => {
                                saveAndContinue();
                                setShowSecondModal(false);
                                props.finished();
                            }}
                        >
                            Continue
                        </Button>
                    {/* <Button onClick={() => {
                        setShowSecondModal(false);
                        props.finished();
                    }}>
                        Submit
                    </Button> */}
                    
                </div>
            </div>
        }
        </div>
    )
}

export default DiceSelectGame;