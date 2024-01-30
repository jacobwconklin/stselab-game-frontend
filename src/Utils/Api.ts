// Handle communications to outside applications here such as the backend and potentially R script.
const getBackendUrl = () => {
    // this will handle automatically switching to the deployed backend in a production environment.
    if (process.env.NODE_ENV === 'production') {
        return 'https://stse-backend.azurewebsites.net/';
    } else {
        // when running locally can switch between these two lines to test locally or against deployed backend
        return 'http://127.0.0.1:5000/';
        // return 'https://stse-backend.azurewebsites.net/';
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