import { Button } from 'antd';
import './SessionResults.scss';
import { useNavigate } from 'react-router-dom';

// SessionResults
const SessionResults = (props: any) => {

    const navigate = useNavigate();

    return (
        <div className='SessionResults'>
            <h1>Thanks for playing!</h1>
            <Button onClick={() => navigate('/')}>Return Home</Button>
            <Button>View Lifetime Results</Button>
            <Button>Save Results</Button>
            <h1>Session Results: </h1>
            
        </div>
    )
}

export default SessionResults;