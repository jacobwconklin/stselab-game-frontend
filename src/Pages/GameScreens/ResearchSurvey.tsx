import { Radio } from 'antd';
import './ResearchSurvey.css';

// This serves to ask players questions at the start and end of the game to gather data for research purposes 
// and record if the players have an improved understanding of modularization.
const ResearchSurvey = () => {

    return (
        <div className="ResearchSurvey">
            <h1>Research Survey</h1>
            <p>
                Thank you for participating in our research. Please answer to the best of your ability.
            </p>
            <Radio.Group >
                <p>1. How confident are you in your understanding of modularization?</p>
                <Radio value={1}>Not confident at all</Radio>
                <Radio value={2}>Slightly confident</Radio>
                <Radio value={3}>Moderately confident</Radio>
                <Radio value={4}>Very confident</Radio>
                <Radio value={5}>Extremely confident</Radio>
            </Radio.Group>
        </div>
    )
}

export default ResearchSurvey;