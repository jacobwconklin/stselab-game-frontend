import './PlayScreen.scss';
import { Solver, runDAP, runLP, runSimEntireHole} from '../../Utils/Simulation';
import { useContext, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { UserContext } from '../../App';
import GolfBall from '../../ReusableComponents/GolfBall';
import RoundOne from './RoundScreens/RoundOne';
import RoundTwo from './RoundScreens/RoundTwo';
import RoundFour from './RoundScreens/RoundFour';
import RoundThree from './RoundScreens/RoundThree';

// PlayScreen
const PlayScreen = (props: any) => {

    // prevent players from clicking play round multiple times
    const [playingRound, setPlayingRound] = useState(false);

    // pull playerId from Context
    const {playerId, playerColor} = useContext(UserContext) as any;

    // Plays round with selected solver
    const playRound = async (solver1: Solver, solver2?: Solver, solver3?: Solver) => {

            setPlayingRound(true);
            let score = {shots: 0, cost: 0};
            if (props.round < 3) {
                score = await runSimEntireHole(solver1);
            } else if (props.round === 3 && solver2) {
                score = await runLP(solver1, solver2);
            } else if (props.round === 4 && solver2 && solver3) {
                score = await runDAP(solver1, solver2, solver3);
            } else {
                alert("Error playing round, please try again");
                setPlayingRound(false);
                return;
            }

            console.log(score);
            // save score to database and record that player has completed the round
            const response = await postRequest('player/result', JSON.stringify({
                playerId,
                shots: score.shots,
                cost: score.cost,
                solverOne: solver1,
                solverTwo: solver2,
                solverThree: solver3,
                round: props.round
            }));
            if (response.success) {
                props.setFinishedRound((val: [Boolean, Boolean, Boolean, Boolean]) => {
                    const copy = val;
                    copy[props.round - 1] = true;
                    return copy;
                });
            } else {
                alert("Error playing round, please try again");
                console.error(response);
                setPlayingRound(false);
            }
        
    }

    return (
        <div className='PlayScreen'>
            <div className='ScrollingBackground'></div>
            <div className='GrassBackground'></div>
            <div className='Tee'></div>
            <div className='TeeTop'></div>
            <div className='PlayerBall'>
                <GolfBall color={playerColor ? playerColor : '#ffffff'}/>
            </div>
            <svg className='FlagAndHole' viewBox="0 0 793.7 1122.5" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <linearGradient id="j" x1=".26274" x2=".7261" y1="-.36265" y2="1.3706">
                <stop stop-color="#fff" offset="0"/>
                <stop stop-color="#fff" stop-opacity="0" offset="1"/>
                </linearGradient>
                <linearGradient id="g" x1=".50003" x2=".50003" y1=".87761" y2=".97313">
                <stop stop-color="#e2c500" offset="0"/>
                <stop stop-color="#eaf800" stop-opacity="0" offset="1"/>
                </linearGradient>
                <linearGradient id="i" x1=".18486" x2=".85461" y1=".40423" y2=".41031">
                <stop stop-color="#ff5c36" offset="0"/>
                <stop stop-color="#c42400" offset=".5"/>
                <stop stop-color="#ff3000" offset="1"/>
                </linearGradient>
                <linearGradient id="h" x1="-.22574" x2="1.6449" y1=".008961" y2=".99403">
                <stop stop-color="#f8f8f8" offset="0"/>
                <stop stop-color="#f8f8f8" stop-opacity="0" offset="1"/>
                </linearGradient>
                <linearGradient id="f" x1=".30938" x2=".54918" y1="1.156" y2="-.28778">
                <stop offset="0"/>
                <stop stop-opacity="0" offset="1"/>
                </linearGradient>
                </defs>
                <path d="m372.44 450.52a39.286 22.857 0 1 1 -78.571 0 39.286 22.857 0 1 1 78.571 0z" fill="url(#f)" stroke-width=".2"/>
                <rect x="325" y="179.65" width="18.571" height="290.71" fill="url(#g)" stroke-width=".2"/>
                <rect x="327.6" y="201.77" width="8.4556" height="224.55" rx="4.2278" ry="16.335" fill="url(#h)" stroke-width=".179"/>
                <g stroke-width=".2">
                <path d="m543.51 223.99c0-3.0182-210.34 46.552-203.94 48.061 6.4037 1.5091 6.4037-97.631 0-96.122-6.4037 1.5091 203.94 51.079 203.94 48.061z" fill="url(#i)"/>
                <path d="m350.67 175.47a16.429 16.429 0 1 1 -32.857 0 16.429 16.429 0 1 1 32.857 0z" fill="#ff9800"/>
                <path d="m340.76 162.31c1.8294 2.755-2.4167 7.5368-8.0778 11.296s-11.235 5.4581-13.065 2.7031c-1.8294-2.755 0.39639-9.6834 6.0575-13.443 5.6611-3.7592 13.256-3.3115 15.085-0.55653z" fill="url(#j)"/>
                </g>
            </svg>
            {
                props.round === 1 &&
                <RoundOne round={props.round} playingRound={playingRound} playRound={playRound} />
            }
            {
                props.round === 2 &&
                <RoundTwo round={props.round} playingRound={playingRound} playRound={playRound} />
            }
            {
                props.round === 3 &&
                <RoundThree round={props.round} playingRound={playingRound} playRound={playRound} />
            }
            {
                props.round === 4 &&
                <RoundFour round={props.round} playingRound={playingRound} playRound={playRound} />
            }
        </div>
    )
}

export default PlayScreen;