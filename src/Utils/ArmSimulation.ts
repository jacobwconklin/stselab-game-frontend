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
    Architectures:

    from paper:
    4 decompositions on page 11

    1. (entire arm)
        SRA smart robotic arm = entrie arm

    2. (manipulator and gripper)
        SFA smart fine-positioning arm = manipulator
        SAM smart attatchment mechanism = gripper

    3. (arm and base)
        SCA smart coarse-position arm = arm above shoulder joint
        SPAM smart positioning and attatchment mechanism = base below shoulder joint

    4. ()
        EMA electro-mechanical arm = mechanical system
        CDPD command, data and power distribution system = power supply 
        RASA robotic arm software architecture = Brain for basic actions (attatch, pan, tilt, stow) 
        PSA positioning software architecture = Move arm to precise location avoiding ISS 

    explanations of modules here:
    https://data.mendeley.com/datasets/79xc6bkgjt/1
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
        architecture: "Gripper and Maniuplator",
        description: "This breaks construction down into developing a positioning system and a grabbing mechanism.",
        components: [
            {
                component: "Manipulator",
                description: "The base and extension for the mechanical arm. Gets the arm to the right location.",
            }, 
            {
                component: "Gripper",
                description: "The hand for the mechanical arm. Handles grabbing and releasing on command.",
            }
        ]
    },
    {
        architecture: "Arm and Base",
        description: "This breaks construction down into developing a smart base component and a simple arm component.",
        components: [
            {
                component: "Arm",
                description: "Everything above the joint connecting the arm and base. An arm that grabs and moves as instructed."
            }, 
            {
                component: "Base",
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
    "Manipulator",
    "Gripper",
    "Arm",
    "Base",
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