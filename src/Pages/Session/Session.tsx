import { useEffect, useState } from 'react';
import './Session.scss';
import { getRequest } from '../../Utils/Api';
import { Navigate } from 'react-router-dom';
// import { UserInformation } from '../../Utils/Types';

// Shows all players in a given session. If the user is the host they can remove players or begin the session.
// other wise players have to wait or leave the session. Also show Hosts the session join code (and maybe link) so they
// can invite players to join their session.
const Session = (props: any) => {

    const [allPlayers, setAllPlayers] = useState<[any] | []>([]);
    // use to make sure user is in a valid session
    const [inValidSession, setInValidSession] = useState(true);

    useEffect(() => {
        // Pull all Session players from server 
        const getSession = async () => {
            try {
                const response = await getRequest('allplayers');
                console.log(response);
                // if response tells us that session is invalid then redirect to home page
                if (response.error === "invalid session") {
                    setInValidSession(false);
                }
                setAllPlayers(response.users);
            } catch (error) {
                console.log("Error pulling all resulsts: ", error);
            }
        }
        getSession();
    }, []);

    // Only allow users to session page if they are registered
    if (!inValidSession) {
        return <Navigate to="/" />
    } else 
        return (
        <div className='Session'>
            <h2>Players in this Tournament:</h2>
            {
                allPlayers && allPlayers.length > 0 && 
                <div className='GridHeader'>
                    <p onClick={() => {setAllPlayers(Session => Session.sort((a, b) => a.id - b.id))}}>Number</p>
                    <p onClick={() => {setAllPlayers(Session => Session.sort((a, b) => a.firstName - b.firstName))}}>First Name</p>
                    <p onClick={() => {setAllPlayers(Session => Session.sort((a, b) => a.lastName - b.lastName))}}>Last Name</p>
                    <p onClick={() => {setAllPlayers(Session => Session.sort((a, b) => a.birthDate - b.birthDate))}}>Birth Date</p>
                    <p onClick={() => {setAllPlayers(Session => Session.sort((a, b) => a.num - b.num))}}>Favorite Number</p>
                    <p>Favorite Pet</p>
                </div>
            }
            {
                // TODO rather than use border color just show the player's golf balls. 
                allPlayers && allPlayers.length > 0 && 
                allPlayers.map((result: any, index: number) => (
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

export default Session;