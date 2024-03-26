// Handle communications to outside applications here such as the backend and potentially R script.
export const getBackendUrl = () => {
    // this will handle automatically switching to the deployed backend in a production environment.
    if (process.env.NODE_ENV === 'production') {
        return 'https://stselab-games-backend.azurewebsites.net/';
    } else {
        // when running locally can switch between these two lines to test locally or against deployed backend
        return 'http://127.0.0.1:5000/';
        // return 'https://stselab-games-backend.azurewebsites.net/';
    }
}

// generic use for get requests to backend without query parameters
export const getRequest = async (endpoint: string) => {
    const response = await fetch(getBackendUrl() + endpoint);
    const data = await response.json();
    return data;
}

// generic use for post requests to backend with JSON payload
export const postRequest = async (endpoint: string, payload: string) => {
    const response = await fetch(getBackendUrl() + endpoint, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: payload
    });
    const data = await response.json();
    return data;
}

// Whenever Host advances session this function can be called. setAdvancingTournmanet is a function call back
// allowing the advance button to be disabled and avoid multiple clicks. 
export const advanceSession = async (sessionId: number | null, setAdvancingTournament: (val: Boolean) => void) => {
    try {
        setAdvancingTournament(true);
        const response = await postRequest("session/advance", JSON.stringify({ sessionId }));
        if (!response.success) {
            setAdvancingTournament(false);
            alert("Error beginning tournament, please try again.");
            console.error(response);
        }
    } catch (error) {
        setAdvancingTournament(false);
        console.error(error);
    }
}
