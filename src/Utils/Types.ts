// Temporary global types file to hold all types, will be further organized as data load increases.

import { ArmSolver } from "./ArmSimulation";
import { Solver } from "./Simulation";

// Smaller structure to hold just information necessary to poll during the game
export interface PlayerBrief {
    id?: string;
    name: string;
    color: string;
    sessionId?: number;
}

// All information for players obtained from the registration form
export interface PlayerInformation {
    id?: string;
    name: string;
    participationReason: string;
    gender: string;
    age: null | number;
    residence: string;
    ethnicity: string;

    isCollegeStudent: number;
    university?: string;
    degreeProgram?: string;
    yearsInProgram?: null | number;

    // Education levels: "HighSchool", "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate", "Other"
    highschoolEducation?: string;
    bachelorsEducation?: string;
    mastersEducation?: string;
    doctorateEducation?: string;
    otherEducationName?: string | null;
    otherEducation?: string;

    riskAnalysisExperience: null | number;
    supplierExperience: null | number;
    proposalOrStatementOfWorkExperience: null | number;
    bidsForRequestsExperience: null | number;
    systemArchitectureExperience: null | number;
    golfExperience: null | number;
    systemsEngineeringExpertise: null | number;
    statementOfWorkExpertise: null | number;
}

export interface SessionStatus {
    sessionId: number;
    players: PlayerBrief[];
    round: number;
    startDate: Date;
    endDate: Date;
}

export interface RoundResult {
    id: string;
    name: string;
    color: string;
    shots: number;
    cost: number;
    solverOne: Solver;
    solverTwo: Solver;
    solverThree: Solver;
    architecture: string;
    score: number;
    round: number;
    customPerformanceWeight?: number;
}

export interface DisplayRoundResult {
    key: string;
    name: string;
    color: string;
    shots: number | string;
    cost: number | string;
    solvers: number[];
    architecture?: string;
    score?: {score: number | string, customPerformanceWeight?: number};
    round?: number | string;
}

export interface ModuleResult {
    shots: number; 
    distance: number; 
    solver: Solver; 
    module: string;
}

export interface Score {
    round: number;
    score: number;
    shots: number;
    cost: number;
    solverOne: Solver;
    solverTwo: Solver;
    solverThree: Solver;
    architecture: string;
}

export interface DisplayScore {
    key: string;
    score: number | string;
    shots: number | string;
    cost: number | string;
}

export interface FinalResult {
    id: string;
    name: string;
    color: string;
    scores: Score[];
}

export interface UserContextType {
    isHost: Boolean;
    setIsHost: (isHost: boolean) => void;
    sessionId: number | null;
    setSessionId: (id: number) => void;
    playerId: string | null;
    setPlayerId: (id: string) => void;
    playerColor: string | null;
    setPlayerColor: (id: string) => void;
}


// Mechanical Arm game types:
export interface ArmRoundResult {
    id: string;
    name?: string;
    color?: string;
    architecture: string;
    solverOne: ArmSolver;
    solverTwo?: ArmSolver;
    solverThree?: ArmSolver;
    solverFour?: ArmSolver;
    weight: number;
    cost: number;
    score: number;
    round: number;
}

// Used for results from experimental round where a single component is run by a single solver
export interface ArmComponentResult {
    weight: number; 
    cost: number; 
    component: string; 
    solver: ArmSolver;
}

export interface ArmScore {
    key?: string;
    round: number;
    score: number;
    weight: number;
    cost: number;
    solverOne: ArmSolver;
    solverTwo?: ArmSolver;
    solverThree?: ArmSolver;
    solverFour?: ArmSolver
    architecture: string;
}

// export interface ArmDisplayScore {
//     key: string;
//     score: number | string;
//     weight: number | string;
//     cost: number | string;
// }

export interface ArmFinalResult {
    id: string;
    name: string;
    color: string;
    scores: ArmScore[];
}