import { DAP_Arch, DS_Arch, H_Arch, LP_Arch, PlayDrive, PlayFairway, PlayLong, PlayPutt, PlayShort } from "./GolfSimulation";

// Handles calling simulation written in R
// const SimulationUrl = "http://64.23.136.232/date/";

// Update to change holes played on each architecture:
const holesPerArchitecture = 5;

export enum Solver {
    Professional = 1,
    Amateur = 2,
    Specialist = 3
}

export const solverNames = ['Professional', 'Amateur', 'Specialist'];

const groupSizePerSolver = [1, 25, 3];

export const moduleDescriptions = [
    "Driving off the Tee involves hitting the ball as far as possible towards the hole. Driving is only the first hit, so it will always only be one shot.",
    "Long means Driving the ball off of the Tee and then continuing to hit the ball until it is on the Green. Here the green is considered 15 units of distance from the hole.",
    "Fairway begins wherever the ball landed from the Drive. It continues to hit until reaching the green, which is 15 units of distance from the hole.",
    "Short begins wherever the ball landed from the drive and continues until successfully putting the ball in the hole.",
    "Putting is played after the ball has been placed on the Green, which is 15 units of distance from the hole, and. continues until the ball is in the hole.",
    "Playing the entire hole involves driving off the tee and then hitting the ball until it is in the hole. The full distance of 700 units will be covered."
];

// methods for each specific simulation run
// TODO can set up hole length, holes, and runs to be dynamic if desired and changable by host on a settings page

// run h_arch simulation where one solver handles entire course
export const runSimEntireHole = async(solver: Solver, overwriteSolverSize?: number, numberOfHoles?: number) => {
    try {
        const response =  H_Arch(700, solver, overwriteSolverSize ? overwriteSolverSize : groupSizePerSolver[solver - 1], numberOfHoles ? numberOfHoles : holesPerArchitecture)
        console.log(response)

        return {shots: response[1], cost: response[5]};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run lp_arch simulation where one solver handles far away and one solver putts on the green
export const runLP = async(solverLong: Solver, solverClose: Solver) => {
    try {
        const response = LP_Arch(700, solverLong, solverClose, groupSizePerSolver[solverLong - 1], groupSizePerSolver[solverClose - 1], 1, holesPerArchitecture)
        console.log(response)

        return {shots: response[1], cost: response[5]};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run dap_arch simulation where one solver drives (hitting it only once), one solver plays the fairway, and
// one solver putts on the green.
export const runDAP = async(solverDrive: Solver, solverFairway: Solver, solverPutt: Solver) => {
    try {
        const response = DAP_Arch(700, solverDrive, solverFairway, solverPutt, groupSizePerSolver[solverDrive - 1], groupSizePerSolver[solverFairway - 1], groupSizePerSolver[solverPutt - 1], holesPerArchitecture);
        console.log(response)

        return {shots: response[1], cost: response[5]};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}

// run ds_arch simulation where one solver drives (hitting it only once) and another solver handles the rest
export const runDS = async(solverDrive: Solver, solverShort: Solver) => {
    try {
        const response = DS_Arch (700, solverDrive, solverShort, groupSizePerSolver[solverDrive-1],groupSizePerSolver[solverShort - 1], 5)  
        console.log(response)  

        // change access to response
        return {shots: response[1], cost: response[5]};

    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 40), cost: Math.floor(Math.random() * 50)};
    }
}


// Methods for running individual modules:
// Distance is saved as distance * 100 then floored to save precisely 2 decimal places and be usable as an int

// run playDrive module giving players back the number of strokes and the remaining distance to the hole
export const runPlayDrive = async(solver: Solver) => {
    try {
        const response = PlayDrive(700, solver, groupSizePerSolver[solver - 1], 1, 1);
        console.log(response)

        // Save distance traveled to two decimal places
        return {shots: response[response.length - 2], distance: Math.floor((700 - response[response.length - 1]) * 100) / 100};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: 1, distance: Math.floor(Math.random() * 700)};
    }
}

// run playLong module giving players back the number of strokes and the remaining distance to the hole
export const runPlayLong = async(solver: Solver) => {
    try {
        const response = PlayLong(700, solver, groupSizePerSolver[solver - 1], 2);
        console.log(response)

        return {shots: response[response.length - 2], distance: Math.floor((700 - response[response.length - 1]) * 100) / 100};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 10), distance: Math.floor(Math.random() * 700)};
    }
}

// run playFairway module giving players back the number of strokes and the remaining distance to the hole
export const runPlayFairway = async(solver: Solver) => {
    try {
        const response = PlayFairway(450, solver, groupSizePerSolver[solver - 1], 2, 0);
        console.log(response)

        return {shots: response[response.length - 2], distance: Math.floor((450 - response[response.length - 1]) * 100) / 100};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 7), distance: Math.floor(Math.random() * 700)};
    }
}

// run playShort module giving players back the number of strokes. Will end with ball in hole.
export const runPlayShort = async(solver: Solver) => {
    try {
        const response = PlayShort(450, solver, groupSizePerSolver[solver - 1], 0.5);
        console.log(response)

        return {shots: response[response.length - 2], distance: 450};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 10), distance: 450};
    }
}

// run playPutt module giving players back the number of strokes. Will end with ball in hole.
export const runPlayPutt = async(solver: Solver) => {
    try {
        const response = PlayPutt(15, solver, groupSizePerSolver[solver - 1], 0.5);
        console.log(response)
        
        return {shots: response[response.length - 2], distance: 15};
    } catch (error) {
        // generate random value to not break deployed
        console.error("UNABLE TO HIT R SIMULATION, MAKING UP RANDOM VALUES")
        return {shots: Math.floor(Math.random() * 5), distance: 15};
    }
}