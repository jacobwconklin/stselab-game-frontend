// Handles calling simulation written in R
const SimulationUrl = "http://64.23.136.232/date/";

// Update to change holes played on each architecture:
const holesPerArchitecture = 5;

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
// TODO can set up hole length, holes, and runs to be dynamic if desired and changable by host on a settings page

// run h_arch simulation where one solver handles entire course
export const runSimEntireHole = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('h_arch', JSON.stringify({
            HoleLength: 700,
            Expertise: solver, 
            TournamentSize: groupSizePerSolver[solver - 1],
            Holes: holesPerArchitecture,
            runs: 1
        }));
        // TODO if decimal costs are desired update database to accept floats
        return {shots: Math.floor(response[0][0]), cost: Math.floor(response[4][0])};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run lp_arch simulation where one solver handles far away and one solver putts on the green
export const runLP = async(solverLong: Solver, solverClose: Solver) => {
    try {
        const response = await simulationPostRequest('lp_arch', JSON.stringify({
            HoleLength: 700,
            Expertise_L: solverLong,
            Expertise_P: solverClose,
            TournamentSize_L: groupSizePerSolver[solverLong - 1],
            TournamentSize_P: groupSizePerSolver[solverClose - 1],
            Rule: 1,
            Holes: holesPerArchitecture,
            runs: 1
        }));
        return {shots: Math.floor(response[0][0]), cost: Math.floor(response[4][0])};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run dap_arch simulation where one solver drives (hitting it only once), one solver plays the fairway, and
// one solver putts on the green.
export const runDAP = async(solverDrive: Solver, solverFairway: Solver, solverPutt: Solver) => {
    try {
        console.log("Solvers: ", solverDrive, solverFairway, solverPutt);
        const response = await simulationPostRequest('dap_arch', JSON.stringify({
            HoleLength: 700,
            Expertise_D: solverDrive,
            Expertise_F: solverFairway,
            Expertise_P: solverPutt,
            TournamentSize_D: groupSizePerSolver[solverDrive - 1],
            TournamentSize_F: groupSizePerSolver[solverFairway - 1],
            TournamentSize_P: groupSizePerSolver[solverPutt - 1],
            Holes: holesPerArchitecture,
            runs: 1
        }));
        return {shots: Math.floor(response[0][0]), cost: Math.floor(response[4][0])};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run ds_arch simulation where one solver drives (hitting it only once) and another solver handles the rest
export const runDS = async(solverDrive: Solver, solverShort: Solver) => {
    try {
        const response = await simulationPostRequest('lp_arch', JSON.stringify({
            HoleLength: 700,
            Expertise_D: solverDrive,
            Expertise_S: solverShort,
            TournamentSize_D: groupSizePerSolver[solverDrive - 1],
            TournamentSize_S: groupSizePerSolver[solverShort - 1],
            Holes: 5,
            runs: 1
        }));
        return {shots: Math.floor(response[0][0]), cost: Math.floor(response[4][0])};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}


// Methods for running individual modules:
// Distance is saved as distance * 100 then floored to save precisely 2 decimal places and be usable as an int

// run playDrive module giving players back the number of strokes and the remaining distance to the hole
export const runPlayDrive = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('playDrive', JSON.stringify({
            HoleDist: 700,
            Expertise: solver,
            N: groupSizePerSolver[solver - 1],
            rule: 1,
            strategy: 1
        }));
        return {shots: Math.floor(response[response.length - 2]), distance: Math.floor(response[response.length - 1] * 100)};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: 1, distance: Math.floor(Math.random() * 700)};
    }
}

// run playLong module giving players back the number of strokes and the remaining distance to the hole
export const runPlayLong = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('playLong', JSON.stringify({
            BallNow: 700,
            Expertise: solver,
            N: groupSizePerSolver[solver - 1],
            rule: 2, // TODO Decide between optimize distance to hole or shots
        }));
        console.log(response);
        return {shots: Math.floor(response[response.length - 2]), distance: Math.floor(response[response.length - 1] * 100)};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 10), distance: Math.floor(Math.random() * 700)};
    }
}

// run playFairway module giving players back the number of strokes and the remaining distance to the hole
export const runPlayFairway = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('playFairway', JSON.stringify({
            BallNow: 450,
            Expertise: solver,
            N: groupSizePerSolver[solver - 1],
            rule: 2,
            strategy: 0
        }));
        console.log(response);
        return {shots: Math.floor(response[response.length - 2]), distance: Math.floor(response[response.length - 1] * 100)};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 7), distance: Math.floor(Math.random() * 700)};
    }
}

// run playShort module giving players back the number of strokes. Will end with ball in hole.
export const runPlayShort = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('playShort', JSON.stringify({
            BallNow: 100,
            Expertise: solver,
            N: groupSizePerSolver[solver - 1],
            size: 0.5
        }));
        return {shots: Math.floor(response[response.length - 2]), distance: 0};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 10), distance: 0};
    }
}

// run playPutt module giving players back the number of strokes. Will end with ball in hole.
export const runPlayPutt = async(solver: Solver) => {
    try {
        const response = await simulationPostRequest('playPutt', JSON.stringify({
            BallNow: 100,
            Expertise: solver,
            N: groupSizePerSolver[solver - 1],
            size: 0.5
        }));
        return {shots: Math.floor(response[response.length - 2]), distance: 0};
    } catch (error) {
        // generate random value to not break deployed
        console.log("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 5), distance: 0};
    }
}