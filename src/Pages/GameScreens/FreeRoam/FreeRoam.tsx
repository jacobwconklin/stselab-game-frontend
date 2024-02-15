import { useContext, useState } from 'react';
import './FreeRoam.scss';
import { Solver, runPlayDrive, runPlayFairway, runPlayLong, runPlayPutt, runPlayShort, solverNames  } from '../../../Utils/Simulation';
import { Button, Tooltip } from 'antd';
import professionalIcon from '../../../Assets/man-golfing-dark-skin-tone.svg';
import specialistIcon from '../../../Assets/woman-golfing-light-skin-tone.svg';
import amateurIcon from '../../../Assets/person-golfing-medium-light-skin-tone.svg';
import { UserContext } from '../../../App';
import { postRequest } from '../../../Utils/Api';
import { ProfessionalSolverCard, SpecialistSolverCard, AmateurSolverCard } from '../../../ReusableComponents/SolverCards';
import PlayGolfBackground from '../../../ReusableComponents/PlayGolfBackground';
import ModuleResults from './ModuleResults';
import FreeRoamGame from './FreeRoamGame';
import FreeRoamSurvey from './FreeRoamSurvey';

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
const FreeRoam = (props: {round?: number}) => {

    const [showModuleResults, setShowModuleResults] = useState(false);
    const [showModuleResultsSurvey, setShowModuleResultsSurvey] = useState(false);
    // const modules = ['Drive', 'Long', 'Fairway', 'Short', 'Putt'];
    
    const [showExplanationModal, setShowExplanationModal] = useState(true);

    const [surveySuccesfullySubmitted, setSurveySuccesfullySubmitted] = useState(false);

    // STORES ALL accumulate results of one player in a free roam session, could get quite big
    const [allResults, setAllResults] = useState<{shots: number, distance: number, solver: Solver, module: string}[]>([]);
    
    return (
        <div className='FreeRoam'>
            {
                props?.round === -1 ?
                (
                    showModuleResultsSurvey ?
                    <ModuleResults results={allResults} origin={"Survey"} return={() => setShowModuleResultsSurvey(false)} />
                    :
                    <FreeRoamSurvey 
                        setShowModuleResultsSurvey={setShowModuleResultsSurvey} 
                        surveySuccesfullySubmitted={surveySuccesfullySubmitted}
                        setSurveySuccessfullySubmitted={setSurveySuccesfullySubmitted}
                    />
                )
                :
                (
                    showModuleResults ?
                    <ModuleResults results={allResults} origin={"Experiment"} return={() => setShowModuleResults(false)} />
                    :
                    <FreeRoamGame 
                        allResults={allResults} 
                        setAllResults={setAllResults} 
                        setShowModuleResults={setShowModuleResults} 
                        showExplanationModal={showExplanationModal}
                        setShowExplanationModal={setShowExplanationModal}
                    />
                )
            }
        </div>
    )
}

export default FreeRoam;