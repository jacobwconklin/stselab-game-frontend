import { useEffect, useState } from 'react';
import './Results.scss';
import { getRequest } from '../../Utils/Api';
// import { UserInformation } from '../../Utils/Types';

// Results
const Results = (props: any) => {

    const [allResults, setAllResults] = useState<[any] | []>([]);

    useEffect(() => {
        // Pull all results from server 
        const getResults = async () => {
            try {
                const response = await getRequest('allusers');
                console.log(response);
                setAllResults(response.users);
            } catch (error) {
                console.log("Error pulling all resulsts: ", error);
            }
        }
        getResults();
    }, []);

    return (
        <div className='Results'>
            <h2>All results obtained so far are as follows:</h2>
            {
                allResults && allResults.length > 0 && 
                <div className='GridHeader'>
                    <p onClick={() => {setAllResults(results => results.sort((a, b) => a.id - b.id))}}>Number</p>
                    <p onClick={() => {setAllResults(results => results.sort((a, b) => a.firstName - b.firstName))}}>First Name</p>
                    <p onClick={() => {setAllResults(results => results.sort((a, b) => a.lastName - b.lastName))}}>Last Name</p>
                    <p onClick={() => {setAllResults(results => results.sort((a, b) => a.birthDate - b.birthDate))}}>Birth Date</p>
                    <p onClick={() => {setAllResults(results => results.sort((a, b) => a.num - b.num))}}>Favorite Number</p>
                    <p>Favorite Pet</p>
                </div>
            }
            {
                allResults && allResults.length > 0 && 
                allResults.map((result: any, index: number) => (
                    <div className='UserResult' style={{border: `4px solid ${result.color}`}}>
                        <p>{result.id}</p>
                        <p>{result.firstName}</p>
                        <p>{result.lastName}</p>
                        <p>{result.birthDate}</p>
                        <p>{result.num}</p>
                        <p>{result.pet}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Results;