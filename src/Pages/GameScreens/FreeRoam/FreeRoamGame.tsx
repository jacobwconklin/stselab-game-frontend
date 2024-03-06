import { SetStateAction, useContext, useState } from 'react';
import './FreeRoamGame.scss';
import { Solver, runPlayDrive, runPlayFairway, runPlayLong, runPlayPutt, runPlayShort, solverNames } from '../../../Utils/Simulation';
import { Button, Tooltip } from 'antd';
import professionalIcon from '../../../Assets/man-golfing-dark-skin-tone.svg';
import specialistIcon from '../../../Assets/woman-golfing-light-skin-tone.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';
import { UserContext } from '../../../App';
import { advanceSession, postRequest } from '../../../Utils/Api';
import { ProfessionalSolverCard, SpecialistSolverCard, AmateurSolverCard } from '../../../ReusableComponents/SolverCards';
import PlayGolfBackground from '../../../ReusableComponents/PlayGolfBackground';
import { UserContextType } from '../../../Utils/Types';

// Free Roam
// Allow players to freely play around with selecting solvers for the 5 various modules.
// Players will stay on this screen until the host moves them, so there should be a modal for 
// them to view data visualizations of their scores. These scores should also be recorded but not count 
// towards tournament scoring. 
// Players will be able to select between the 5 different modules, learn what each one is (probably with tooltips),
// and select one solver then play them over and over. Let users select the modules from the Instructions section or 
// by clicking on the corresponding part of the golf course (a little tricky as many overlap like short and putt, but 
// I can probably just make the smaller ones sit on top). 
// Requires no props, and should not even require being in a tournament. 
const FreeRoamGame = (props: {
    setShowModuleResults: (val: SetStateAction<boolean>) => void,
    allResults: { shots: number, distance: number, solver: Solver, module: string }[],
    setAllResults: (newValue: { shots: number, distance: number, solver: Solver, module: string }[]) => void,
    showExplanationModal: boolean, setShowExplanationModal: (val: SetStateAction<boolean>) => void
}) => {

    const { playerColor, playerId, isHost, sessionId } = useContext(UserContext) as UserContextType;
    const modules = ['Drive', 'Long', 'Fairway', 'Short', 'Putt'];
    const moduleDescriptions = [
        "Driving off the Tee involves hitting the ball as far as possible towards the hole. Driving is only the first hit, so it will always only be one shot.",
        "Playing Long means Driving the ball off of the Tee and then continuing to hit the ball until it is on the green. Here the green is considered 15 units of distance from the hole.",
        "Playing the Fairway is played after the ball is driven off the Tee, so it has been hit exactly once. Playing the Fairway begins wherever the ball landed from the drive, but for this experiment it starts at 450 units of distance from the hole. It continues to hit until reaching the green, which is 15 units of distance from the hole.",
        "Playing short is played after the ball is driven off the Tee, so it has been hit exactly once. Playing short begins wherever the ball landed from the drive, but for this experiment it starts at 450 units of distance from the hole. It continues to shoot until successfully putting the ball in the hole.",
        "Putting is played after the ball has been hit onto the green, which is 15 units of distance from the hole. Putting continues until the ball is in the hole."
    ]

    // use value to switch between selecting long and close golfers
    const [selectedModule, setSelectedModule] = useState<string>('Drive');
    const [selectedSolver, setSelectedSolver] = useState<Solver>(Solver.Professional);
    // Allows immediately showing user their shot and distance results of the last round played
    const [latestShot, setLatestShot] = useState<number | null>(null);
    const [latestDistance, setLatestDistance] = useState<number | null>(null);
    // Set true when user simulates all rounds to tell user it was successful
    const [simulatedAll, setSimulatedAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hostClickedButton, setHostClickedButton] = useState<Boolean>(false);

    // Play round
    const playModule = async () => {
        try {
            setSimulatedAll(false);
            setLoading(true);
            let result = { shots: -1, distance: -1 };
            if (selectedModule === 'Drive') {
                result = await runPlayDrive(selectedSolver);
            } else if (selectedModule === 'Long') {
                result = await runPlayLong(selectedSolver);
            } else if (selectedModule === 'Fairway') {
                result = await runPlayFairway(selectedSolver);
            } else if (selectedModule === 'Short') {
                result = await runPlayShort(selectedSolver);
            } else if (selectedModule === 'Putt') {
                result = await runPlayPutt(selectedSolver);
            }
            setLatestShot(result.shots);
            setLatestDistance(result.distance);
            setLoading(false);
            props.setAllResults([...props.allResults, { shots: result.shots, distance: result.distance, solver: selectedSolver, module: selectedModule }]);
            // For now do not save free roam results to database only for all 
            // only save it for those in tournaments
            if (playerId) {
                saveFreeRoamResult(result.shots, result.distance);
            }
            // saveFreeRoamResult(result.shots, result.distance);
        } catch (error) {
            console.error("Error playing module: ", error);
        }
    }

    const simulateAll = async () => {
        try {
            setLoading(true);
            // save all results as it goes
            const simulatedResults = [];
            // For each solver play each module once
            for (let i = 1; i < 4; i++) {
                let result = await runPlayDrive(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Drive' });
                result = await runPlayLong(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Long' });
                result = await runPlayFairway(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Fairway' });
                result = await runPlayShort(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Short' });
                result = await runPlayPutt(i);
                simulatedResults.push({ shots: result.shots, distance: result.distance, solver: i, module: 'Putt' });
            }
            // For now do not save free roam results to database only for all 
            // only save it for those in tournaments
            if (playerId) {
                await Promise.all(simulatedResults.map(async (result) => {
                    await saveFreeRoamResult(result.shots, result.distance);
                    return null;
                }));
            }
            // saveFreeRoamResult(result.shots, result.distance);
            props.setAllResults([...props.allResults, ...simulatedResults]);
            setSimulatedAll(true);
            setLoading(false);
        } catch (error) {
            console.error("Error simulating all: ", error);
        }
    }

    const saveFreeRoamResult = async (shots: number, distance: number) => {
        try {
            await postRequest('player/freeRoamResult', JSON.stringify({
                playerId,
                shots,
                distance: Math.floor(distance * 100),
                solver: selectedSolver,
                module: modules.indexOf(selectedModule) + 1,
            }));

        } catch (error) {
            console.error("Error saving free roam result: ", error)
        }
    }

    return (
        <div className='FreeRoamGame'>
            <div className='FreeRoamExperiment'>
                <PlayGolfBackground playerColor={playerColor} />
                <div className={`Highlight Long ${selectedModule === 'Long' ? "Active" : " "}`}
                    onClick={() => setSelectedModule('Long')}
                >Long</div>
                <div className={`Highlight Drive ${selectedModule === 'Drive' ? "Active" : " "}`}
                    onClick={() => setSelectedModule('Drive')}
                >Drive</div>
                <div className={`Highlight Fairway ${selectedModule === 'Fairway' ? "Active" : " "}`}
                    onClick={() => setSelectedModule('Fairway')}
                >Fairway</div>
                <div className={`Highlight Short ${selectedModule === 'Short' ? "Active" : " "}`}
                    onClick={() => setSelectedModule('Short')}
                >Short</div>
                <div className={`Highlight Putt ${selectedModule === 'Putt' ? "Active" : " "}`}
                    onClick={() => setSelectedModule('Putt')}
                >&nbsp;&nbsp;&nbsp;&nbsp;Putt</div>
                {/* <div className={`Position${selectedModule} SolverIcon`}>
                    <img className='SolverIconImage' src={solverIcons[selectedSolver - 1]} alt="Solver Icon" />
                </div> */}
                <div className='Controls'>
                    <div className='Instructions'>
                        <h1>
                            Experimental Round
                            <Button className='InfoButtonHolder' onClick={() => props.setShowExplanationModal(true)}>
                                &nbsp;
                                <svg width="24" height="24" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                        </h1>
                        <div className='Modules'>
                            {
                                modules.map((module, index) => (
                                    <div className='SelectableModule' key={module}>
                                        <Tooltip title={moduleDescriptions[index]}>
                                            <Button
                                                type={selectedModule === module ? 'primary' : 'default'}
                                                onClick={() => setSelectedModule(module)}
                                                className='ModuleButton'
                                            >
                                                {module}
                                                &nbsp;
                                                <svg width="12" height="12" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='InformationHorizontalSplit'>
                            <div className='SelectionsAndActions'>
                                {/* <div className='Selections'>
                                        <h2>
                                            Selected Module: {selectedModule}
                                        </h2>
                                        <h2>
                                            Selected Solver: {solverNames[selectedSolver - 1]}
                                        </h2>
                                </div> */}
                                <br></br>
                                <div className='PlayAndShowResults'>
                                    <Button
                                        onClick={() => playModule()}
                                        disabled={loading}
                                    >
                                        Play {solverNames[selectedSolver - 1]} on {selectedModule}
                                    </Button>
                                    <Button
                                        onClick={() => simulateAll()}
                                        disabled={loading}
                                    >
                                        Simulate All
                                    </Button>
                                    <Button
                                        onClick={() => { props.setShowModuleResults(true) }}
                                        disabled={props.allResults.length === 0}
                                    >
                                        View Results
                                    </Button>
                                </div>
                            </div>
                            <div className='SolverIcons'>
                                {
                                    selectedSolver === Solver.Professional &&
                                    <img className='ProfessionalIconImage' src={professionalIcon} alt="Professional Solver Icon" />
                                }
                                {
                                    selectedSolver === Solver.Specialist &&
                                    <div className='SpecialistIcons'>
                                        <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                        <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                        <img className='SpecialistIconImage' src={specialistIcon} alt="Specialist Solver Icon" />
                                    </div>
                                }
                                {
                                    selectedSolver === Solver.Amateur &&
                                    <div className='AmateurIcons'>
                                        {
                                            Array.apply(null, Array(25)).map(() => (
                                                <img className='AmateurIconImage' src={amateurIcon} alt="Amateur Solver Icon" />
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            loading &&
                            <div className='LatestResults'>
                                <p>Simulating ... </p>
                            </div>
                        }
                        {
                            simulatedAll && !loading &&
                            <div className='LatestResults'>
                                <p>Each solver has been simulated for each module once. See view results.</p>
                            </div>
                        }
                        {
                            !simulatedAll && latestShot !== null && latestDistance !== null && !loading &&
                            <div className='LatestResults'>
                                <p>
                                    They took {latestShot} shot{latestShot === 1 ? '' : 's'} and
                                    {latestDistance <= 0.5 ? " made it in the hole!"
                                        : " hit the ball " + (latestDistance) + " units towards the hole!"}
                                </p>
                            </div>
                        }
                        {
                            isHost &&
                            <Button
                                className='EndRoundButton'
                                type='primary'
                                onClick={() => advanceSession(sessionId, setHostClickedButton)}
                                disabled={!!hostClickedButton}
                            >
                                End Experimental Round
                            </Button>
                        }
                    </div>
                    <div className='Solvers'>
                        <ProfessionalSolverCard select={setSelectedSolver} />
                        <SpecialistSolverCard select={setSelectedSolver} />
                        <AmateurSolverCard select={setSelectedSolver} />
                    </div>
                </div>
                {
                    props.showExplanationModal &&
                    <div className='ExplanationModal'
                        onClick={() => props.setShowExplanationModal(false)}
                    >
                        <div className='ExplanationModalBody'>
                            <h2>What is the Experimental Round?</h2>
                            <p>
                                In this round scores still do not count towards the Tournament rankings. Instead this is an opportunity for players to test different solvers on different modules.
                            </p>
                            <p>
                                Play as much as you would like with as many different combinations as you would like. This will go on until the host moves the game forward.
                            </p>
                            <p>
                                Select different modules by clicking their name at the top of the screen or by clicking on the corresponding part of the golf course at the bottom of the screen. Then choose your solver and click play game. All of you scores can be seen by clicking view results. Click Simulate All to have every golfer play every module once.
                            </p>
                            <p>
                                This experiment should allow you to familiarize yourself with how golf can be broken down into modules to be solved in more novel ways.
                            </p>
                            <div className='ModalButtons'>
                                <Button onClick={() => props.setShowExplanationModal(false)}>Continue</Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default FreeRoamGame;