// Handles static values for Arm simulation (meaning solvers, architectures, and componets), as
// well as methods to run the Arm simulations per component and per architecture.
import computerScientistIcon from '../Assets/MechArm/laptop-woman.svg';
import industrialSystemsEngineerIcon from '../Assets/MechArm/web-developer.svg';
import mechanicalEngineerIcon from '../Assets/MechArm/construction-worker.svg';
import materialsScientistIcon from '../Assets/MechArm/chemist.svg';
import { ArmComponentResult, ArmRoundResult } from './Types';

export enum ArmSolver {
    MechanicalEngineer = 1,
    MaterialsScientist = 2,
    ComputerScientist = 3,
    IndustrialSystemsEngineer = 4,
}

export const armSolverNames = ['Mechanical Engineer', 'Materials Scientist', 'Computer Scientist', 'Industrial Systems Engineer'];

export const armSolverImages = [
    mechanicalEngineerIcon,
    materialsScientistIcon,
    computerScientistIcon,
    industrialSystemsEngineerIcon
];

export const armSolverInformation = [
    {
        armSolver: ArmSolver.MechanicalEngineer,
        name: "Mechanical Engineer",
        image: mechanicalEngineerIcon,
    },
    {
        armSolver: ArmSolver.MaterialsScientist,
        name: "Materials Scientist",
        image: materialsScientistIcon,
    },
    {
        armSolver: ArmSolver.ComputerScientist,
        name: "Computer Scientist",
        image: computerScientistIcon,
    },
    {
        armSolver: ArmSolver.IndustrialSystemsEngineer,
        name: "Industrial Systems Engineer",
        image: industrialSystemsEngineerIcon,
    }
]

/*
    Architectures and Components from research paper:

    1. (entire arm)
        SRA smart robotic arm = entrie arm

    2. (smart arm and base)
        SFA smart fine-positioning arm = arm
        SAM smart attatchment mechanism = base

    3. (arm and smart base)
        SCA smart coarse-position arm = also arm ? 
        SPAM smart positioning and attatchment mechanism = also base ?

    4. (structure, power, and software)
        EMA electro-mechanical arm = mechanical system
        CDPD command, data and power distribution system = power supply 
        RASA robotic arm software architecture = Brain for basic actions (attatch, pan, tilt, stow) 
        PSA positioning software architecture = Move arm to precise location avoiding ISS 
*/
export const armArchitectures = [
    {
        architecture: "Entire Arm",
        description: "This is the entire arm that will be built. This means one Solver type will be assigned to complete all aspects of the arm.",
        components: [
            {
                component: "Entire Arm",
                description: "The entire functional mechanical arm that will be built.",
            }
        ]
    },
    {
        architecture: "Smart Arm and Base",
        description: "This breaks construction down into developing a smart arm component and a simple base component.",
        components: [
            {
                component: "Smart Arm",
                description: "A functional arm capable of positioning itself and grabbing objects.",
            }, 
            {
                component: "Base",
                description: "A simple base that attatches the arm to the ISS on command.",
            }
        ]
    },
    {
        architecture: "Arm and Smart Base",
        description: "This breaks construction down into developing a smart base component and a simple arm component.",
        components: [
            {
                component: "Arm",
                description: "A simple arm that grabs and moves as it is instructed."
            }, 
            {
                component: "Smart Base",
                description: "A functional base capable of attatching the arm to the ISS and instructing the arm component."
            }
    ]
    },
    {
        architecture: "Structure, Power, and Software",
        description: "This breaks construction down into developing a mechanical structure, a power supply, a software system to handle major actions, and a software system to handle precise positioning of the arm",
        components: [
            {
                component: "Mechanical System",
                description: "The physical structure of the arm that can move and grab objects as instructed."
            }, 
            {
                component: "Power Supply",
                description: "The power supply and wiring that provides energy to the arm and base components."
            }, 
            {
                component: "Action Software",
                description: "The software system that instructs the arm and base to perform basic actions such as attatch, pan, tilt, and stow."
            }, 
            {
                component: "Positioning Software",
                description: "The software system that instructs the arm to move to precise locations and avoid damaging the ISS."
            }
        ]
    }
];

export const armComponents = [
    "Entire Arm",
    "Smart Arm",
    "Base",
    "Arm",
    "Smart Base",
    "Mechanical System",
    "Power Supply",
    "Action Software",
    "Positioning Software"
]


// Run simulation on a specific component with a specific solver
export const runArmComponentSimulation = (solver: ArmSolver, component: string): ArmComponentResult => {
    return {
        weight: Math.floor(Math.random() * 80) + 20,
        cost: Math.floor(Math.random() * 80) + 20,
        component,
        solver
    }
}

// TODO write Function for each architecture given a specific set of solvers
export const runArmArchitectureSimulation = (
    playerId: string, 
    architecture: string,
    solverOne: ArmSolver, 
    solverTwo?: ArmSolver, 
    solverThree?: ArmSolver, 
    solverFour?: ArmSolver, 
): ArmRoundResult => {
    // TODO get score based on round being played:
    return {
        id: playerId,
        architecture,
        solverOne,
        solverTwo, // optional
        solverThree, // optional
        solverFour, // optional
        weight: Math.floor(Math.random() * 80) + 20,
        cost: Math.floor(Math.random() * 80) + 20,
        score: Math.floor(Math.random() * 80) + 20,
        round: 1
    }
}