import { useEffect, useState } from 'react';
import './Results.scss';

// Results
const Results = (props: any) => {

    const [allResults, setAllResults] = useState([]);

    useEffect(() => {
        // Pull all results from server
    }, []);

    return (
        <div className='Results'>
            <h2>All results obtained so far are as follows:</h2>

            {
            
            }
        </div>
    )
}

export default Results;