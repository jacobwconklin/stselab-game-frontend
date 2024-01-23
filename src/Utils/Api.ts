// Handle communications to outside applications here such as the backend and potentially R script.
export const getBackendUrl = () => {
    // TODO this will handle automatically switching to the deployed backend in a production environment.
    // for now it just returns the locally run back end url
    return 'http://127.0.0.1:5000/';
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