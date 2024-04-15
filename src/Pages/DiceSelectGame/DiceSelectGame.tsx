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
const DiceSelectGame = (props: {
    isOnboarding: boolean;
    finished: () => void;
}) => {
    
    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // props will tell if it is the oboarding or offboarding version of the game.
    const [credits, setCredits] = useState(props?.isOnboarding ? 8 : 10);
    const [totalToReach] = useState(props?.isOnboarding ? 12 : 20);
    const [randomRoll, setRandomRoll] = useState(0);
    const [selectedDie, setSelectedDie] = useState<{ val: number; cost: number; img: string; }[]>([]);
    const [clickedRoll, setClickedRoll] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // player id will be pulled from context
    const { playerId } = useContext(UserContext) as UserContextType;

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
        // set player's random value:
        let playerRandomRoll = 0;
        // set total number of possibilities
        let totalNumberOfPossibilities = 1;
        selectedDie.forEach(die => {
            totalNumberOfPossibilities *= die.val;
            playerRandomRoll += Math.floor(Math.random() * die.val) + 1;
        });
        setRandomRoll(playerRandomRoll);

        // Going to do a semi-ugly brute force calculation for now.
        // TODO find prettier solution (not found by me yet) look here from Prof: https://anydice.com/

        // for each possible value of each die check all other possible values of all other die and whenever 
        // the sum is >= the desired total increment the totalNumberOfCorrectPossibilities
        // use recursive function to do this.
        const totalNumberOfCorrectPossibilities = recursiveCorrectPossibilities(0, 0)

        return 100 * (totalNumberOfCorrectPossibilities / totalNumberOfPossibilities);
    }

    // finish on / offboarding by rolling die
    const rollDie = async () => {
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
                score: scoreSelectedDie()
            }));
            if (result.success) {
                // show results for a few seconds then move on
                setShowModal(true);
                setTimeout(() => {
                    props.finished();
                }, 5000);
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
                <h3>
                    {
                        props.isOnboarding ?
                        "Play the Dice Game to join your session! You have 8 credits to spend by selecting die to roll. Your goal is for the sum of all die you roll to be at least 12. You may only roll once. Select die to roll below. Then click the image of the die here to remove them if you want to change your selection." 
                        : 
                        "Play the Dice Game to view your final results! You now have 10 credits to spend by selecting die to roll. Your new goal is for the sum of all die you roll to be at least 20. You may only roll once. Select die to roll below. Then click the image of the die here to remove them if you want to change your selection."
                    }
                </h3>
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
                        </h2><h2>
                            {randomRoll >= totalToReach ? " Congratulations!" : " Better Luck Next Time!"}
                        </h2> 
                        <p style={{width: '100%', textAlign: 'center'}} >
                            Thank you. Your selection has been recorded. You will now be taken to the next page.
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}

export default DiceSelectGame;