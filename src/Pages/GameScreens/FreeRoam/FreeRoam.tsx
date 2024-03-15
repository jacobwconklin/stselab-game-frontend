import { useState } from 'react';
import './FreeRoam.scss';
import ModuleResults from './ModuleResults';
import FreeRoamGame from './FreeRoamGame';
import FreeRoamSurvey from './FreeRoamSurvey';
import { RoundNames } from '../../../Utils/Utils';
import { ModuleResult } from '../../../Utils/Types';

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
    const [allResults, setAllResults] = useState<ModuleResult[]>([]);
    
    return (
        <div className='FreeRoam'>
            {
                props?.round === RoundNames.ExperimentalSurvey ?
                (
                    showModuleResultsSurvey ?
                    <ModuleResults 
                        results={allResults} 
                        origin={"Survey"} 
                        return={() => setShowModuleResultsSurvey(false)}
                        setAllResults={setAllResults} 
                    />
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
                    <ModuleResults 
                        results={allResults} 
                        origin={"Experiment"} 
                        return={() => setShowModuleResults(false)}            
                        setAllResults={setAllResults} 
                    />
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