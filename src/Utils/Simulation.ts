// Handles calling simulation written in R
const SimulationUrl = "http://127.0.0.1:6081/";

// use for post requests to simulation
const simulationPostRequest = async (endpoint: string, payload: string) => {
    const response = await fetch(SimulationUrl + endpoint, {
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

export enum Solver {
    Professional = 1,
    Amatuer = 2,
    Specialist = 3
}

export const solverNames = ['Professional', 'Amatuer', 'Specialist'];

const groupSizePerSolver = [1, 50, 3];

// methods for each specific simulation run
// TODO can set up hole length, holes, and runs to be dynamic if desired

// run h_arch simulation where one solver handles entire course
export const runSimEntireHole = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('h_arch', JSON.stringify({
            HoleLength: 700,
            Expertise: solver, 
            TournamentSize: groupSizePerSolver[solver - 1],
            Holes: 5,
            runs: 1
        }));
        return {shots: response[0][0], cost: response[4][0]};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}