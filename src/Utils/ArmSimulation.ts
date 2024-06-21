// Handles static values for Arm simulation (meaning solvers, architectures, and componets), as
// well as methods to run the Arm simulations per component and per architecture.

import professionalIcon from '../Assets/MechArm/architect-96.svg';
import amateurIcon from '../Assets/MechArm/construction-worker-27.svg';
import mechanicalDesignSpecialistIcon from '../Assets/MechArm/designer-40.svg';
import electronicsSpecialistIcon from '../Assets/MechArm/customer-service-1-24.svg';
import computerScienceSpecialistIcon from '../Assets/MechArm/coding-4-21.svg';

import actionSoftwareIcon from '../Assets/MechArm/Subproblems/ActionSoftware.png';
import baseIcon from '../Assets/MechArm/Subproblems/Base.png';
import gripperIcon from '../Assets/MechArm/Subproblems/Gripper.png';
import mechanicalSystemIcon from '../Assets/MechArm/Subproblems/MechanicalSystem.png';
import manipulatorIcon from '../Assets/MechArm/Subproblems/Manipulator.png';
import positioningSoftwareIcon from '../Assets/MechArm/Subproblems/PositionSoftware.png';
import powerSupplyIcon from '../Assets/MechArm/Subproblems/PowerSupply.png';
import armIcon from '../Assets/MechArm/Subproblems/Arm.png';
import entireArmIcon from '../Assets/MechArm/Subproblems/EntireArm.png';


import { ArmComponentResult, ArmRoundResult } from './Types';
import { RoundNames } from './Utils';

/**
 * To change solver names 
 */

export enum ArmSolver {
    Professional = 1,
    Amateur = 2,
    MechanicalDesignSpecialist = 3,
    ElectronicsSpecialist = 4,
    ComputerScienceSpecialist = 5
}

export const armSolverNames = ['Professional', 'Amateur', 'Mechanical Design Specialist', 'Electronics Specialist', 'Computer Science Specialist'];

export const armSolverImages = [
    professionalIcon,
    amateurIcon,
    mechanicalDesignSpecialistIcon,
    electronicsSpecialistIcon,
    computerScienceSpecialistIcon
];

export const armSolverDescriptions = [
    "Cross-trained experts, good at everything. Think NASA Team X.",
    "Amateurs, explore each solution path randomly and do a mediocre job.",
    "Amazing at solving problems involving mechanical functions, bad at everything else.",
    "Amazing at solving problems involving electronic functions, bad at everything else.",
    "Amazing at algorithms and coding, bad at everything else."
];

export const armSolverInformation = armSolverNames.map((name, index) => (
    {
        armSolver: index + 1,
        name,
        image: armSolverImages[index],
        description: armSolverDescriptions[index]
    }
));

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
                image: entireArmIcon
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
                image: manipulatorIcon
            }, 
            {
                component: "Gripper",
                description: "The hand for the mechanical arm. Handles grabbing and releasing on command.",
                image: gripperIcon
            }
        ]
    },
    {
        architecture: "Arm and Base",
        description: "This breaks construction down into developing a smart base component and a simple arm component.",
        components: [
            {
                component: "Arm",
                description: "Everything above the joint connecting the arm and base. An arm that grabs and moves as instructed.",
                image: armIcon
            }, 
            {
                component: "Base",
                description: "A functional base capable of attatching the arm to the ISS and instructing the arm component.",
                image: baseIcon
            }
        ]
    },
    {
        architecture: "Structure, Power, and Software",
        description: "This breaks construction down into developing a mechanical structure, a power supply, a software system to handle major actions, and a software system to handle precise positioning of the arm",
        components: [
            {
                component: "Mechanical System",
                description: "The physical structure of the arm that can move and grab objects as instructed.",
                image: mechanicalSystemIcon
            }, 
            {
                component: "Power Supply",
                description: "The power supply and wiring that provides energy to the arm and base components.",
                image: powerSupplyIcon
            }, 
            {
                component: "Action Software",
                description: "The software system that instructs the arm and base to perform basic actions such as attatch, pan, tilt, and stow.",
                image: actionSoftwareIcon
            }, 
            {
                component: "Positioning Software",
                description: "The software system that instructs the arm to move to precise locations and avoid damaging the ISS.",
                image: positioningSoftwareIcon
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

// used for deterministic-ish evaluation, will be replaced by python simulation from Athul
// Lower is better
// mass will be somewhere in the range of 400 to 2000 grams
const solverComponentWeights = [
    // solver 1 professional
    {
        "Entire Arm": {base: 30, range: 10},
        "Manipulator": {base: 22, range: 8},
        "Gripper": {base: 7, range: 6},
        "Arm": {base: 15, range: 8},
        "Base": {base: 15, range: 8},
        "Mechanical System": {base: 20, range: 9},
        "Power Supply": {base: 5, range: 2},
        "Action Software": {base: 2, range: 2},
        "Positioning Software": {base: 2, range: 2}
    },
    // materials scientist
    {
        "Entire Arm": {base: 20, range: 15},
        "Manipulator": {base: 15, range: 10},
        "Gripper": {base: 5, range: 5},
        "Arm": {base: 10, range: 10},
        "Base": {base: 10, range: 10},
        "Mechanical System": {base: 15, range: 10},
        "Power Supply": {base: 2, range: 3},
        "Action Software": {base: 2, range: 2},
        "Positioning Software": {base: 2, range: 2}
    },
    // computer scientist
    {
        "Entire Arm": {base: 40, range: 15},
        "Manipulator": {base: 25, range: 10},
        "Gripper": {base: 15, range: 5},
        "Arm": {base: 20, range: 10},
        "Base": {base: 20, range: 10},
        "Mechanical System": {base: 25, range: 10},
        "Power Supply": {base: 4, range: 1},
        "Action Software": {base: 1, range: 1},
        "Positioning Software": {base: 1, range: 1}
    },
    // Industrial Systems Engineer
    {
        "Entire Arm": {base: 25, range: 10},
        "Manipulator": {base: 5, range: 10},
        "Gripper": {base: 15, range: 5},
        "Arm": {base: 15, range: 10},
        "Base": {base: 5, range: 10},
        "Mechanical System": {base: 35, range: 10},
        "Power Supply": {base: 6, range: 4},
        "Action Software": {base: 5, range: 2},
        "Positioning Software": {base: 5, range: 2}
    },
    // copy of mech engineer from above
    {
        "Entire Arm": {base: 30, range: 10},
        "Manipulator": {base: 22, range: 8},
        "Gripper": {base: 7, range: 6},
        "Arm": {base: 15, range: 8},
        "Base": {base: 15, range: 8},
        "Mechanical System": {base: 20, range: 9},
        "Power Supply": {base: 5, range: 2},
        "Action Software": {base: 2, range: 2},
        "Positioning Software": {base: 2, range: 2}
    }
]

// cost is dollars * hours worked. Estimated when problem is assigned, no RNG. 
const solverComponentCosts = [
    // solver 1 professional
    {
        "Entire Arm": {base: 35, range: 10},
        "Manipulator": {base: 15, range: 10},
        "Gripper": {base: 25, range: 10},
        "Arm": {base: 20, range: 10},
        "Base": {base: 20, range: 10},
        "Mechanical System": {base: 15, range: 10},
        "Power Supply": {base: 10, range: 10},
        "Action Software": {base: 10, range: 10},
        "Positioning Software": {base: 10, range: 10}
    },
    // amateur
    {
        "Entire Arm": {base: 50, range: 10},
        "Manipulator": {base: 30, range: 10},
        "Gripper": {base: 10, range: 10},
        "Arm": {base: 30, range: 10},
        "Base": {base: 10, range: 10},
        "Mechanical System": {base: 30, range: 10},
        "Power Supply": {base: 10, range: 10},
        "Action Software": {base: 10, range: 10},
        "Positioning Software": {base: 10, range: 10}
    },
    // mechanical design specialist
    {
        "Entire Arm": {base: 45, range: 10},
        "Manipulator": {base: 35, range: 10},
        "Gripper": {base: 25, range: 10},
        "Arm": {base: 30, range: 10},
        "Base": {base: 30, range: 10},
        "Mechanical System": {base: 30, range: 10},
        "Power Supply": {base: 10, range: 10},
        "Action Software": {base: 5, range: 10},
        "Positioning Software": {base: 5, range: 10}
    },
    // Industrial Systems Engineer
    {
        "Entire Arm": {base: 30, range: 10},
        "Manipulator": {base: 25, range: 10},
        "Gripper": {base: 15, range: 10},
        "Arm": {base: 20, range: 10},
        "Base": {base: 20, range: 10},
        "Mechanical System": {base: 20, range: 10},
        "Power Supply": {base: 10, range: 10},
        "Action Software": {base: 10, range: 10},
        "Positioning Software": {base: 10, range: 10}
    },
    // copy of mech engineer from above
    {
        "Entire Arm": {base: 35, range: 10},
        "Manipulator": {base: 15, range: 10},
        "Gripper": {base: 25, range: 10},
        "Arm": {base: 20, range: 10},
        "Base": {base: 20, range: 10},
        "Mechanical System": {base: 15, range: 10},
        "Power Supply": {base: 10, range: 10},
        "Action Software": {base: 10, range: 10},
        "Positioning Software": {base: 10, range: 10}
    }
]

// Functions used to ficticiously evaluate and then score arm mission (but at least in a more sensible way than randomly to make the game feel more deterministic for now)
const evaluateArmRound = (
    architecture: string,
    solverOne: ArmSolver, 
    solverTwo?: ArmSolver, 
    solverThree?: ArmSolver, 
    solverFour?: ArmSolver ): {weight: number, cost: number} => {
        const chosenSolvers: any[] = [solverOne, solverTwo, solverThree, solverFour]
        let weight = 0;
        let cost = 0;
        armArchitectures.find((arch) => arch.architecture === architecture)?.components.forEach((component: any, index) => {
            const solverIndex = chosenSolvers[index] - 1;
            const componentWeight = (solverComponentWeights as any[])[solverIndex][component.component].base;
            const componentWeightRange = (solverComponentWeights as any[])[solverIndex][component.component].range;
            weight += componentWeight + Math.floor(Math.random() * componentWeightRange);

            const componentCost = (solverComponentCosts as any[])[solverIndex][component.component].base;
            const componentRange = (solverComponentCosts as any[])[solverIndex][component.component].range;
            cost += componentCost + Math.floor(Math.random() * componentRange);
        })
        return {weight, cost}
    }

const scoreArmRound = (round: number, weight: number, cost: number, customPerformance?: number): number => {
    // all scores are out of 100 maximum points and 0 minimum points

    if (round === RoundNames.ArmGame1) {
        // On round 1 best performance is rewarded no matter the cost
        // 0 weight is perfect (and impossible) = score of 100
        // 100 weight is overly bad = score of 0 
        return (100 - weight);
    } else if (round === RoundNames.ArmGame2) {
        // On round 7 minimum cost is rewarded as long as the performance is <= 40 kg
        // minimum cost is 0 = score of 100
        // maximum cost is 100 = score of 0
        const score = 100 - cost;
        if (weight > 40) {
            // divide score by amount as penalty
            return Math.floor(score / 10);
        } else {
            return score;
        }
    } else if (round === RoundNames.ArmGame3) {
        // use reward function to balance cost and shots
        // for now use 50 50 split
        const weightScore = 100 - weight;
        const costScore = 100 - cost;
        return (weightScore + costScore) / 2;
    } else if (round === RoundNames.ArmGame4 && customPerformance ) {
        // let users define custom reward function
        const weightScore = (100 - weight) * customPerformance;
        const costScore = (100 - cost) * (1 - customPerformance);
        return weightScore + costScore;
    } 
    console.error("Error scoring arm round");
    return -1;
}


// Run simulation on a specific component with a specific solver
export const runArmComponentSimulation = (solver: ArmSolver, component: string): ArmComponentResult => {

    const componentWeight = (solverComponentWeights as any[])[solver - 1][component].base;
    const componentWeightRange = (solverComponentWeights as any[])[solver - 1][component].range;
    const weight = componentWeight + Math.floor(Math.random() * componentWeightRange);

    const componentCost = (solverComponentCosts as any[])[solver - 1][component].base;
    const componentCostRange = (solverComponentCosts as any[])[solver - 1][component].range;
    const cost = componentCost + Math.floor(Math.random() * componentCostRange);

    return {
        weight,
        cost,
        component,
        solver
    }
}

// TODO write Function for each architecture given a specific set of solvers
export const runArmArchitectureSimulation = (
    playerId: string, 
    architecture: string,
    round: number,
    solverOne: ArmSolver, 
    solverTwo?: ArmSolver, 
    solverThree?: ArmSolver, 
    solverFour?: ArmSolver, 
    customPerformance?: number
): ArmRoundResult => {
    // Gets weight and cost from evaluateArmRound method
    const {weight, cost} = evaluateArmRound(architecture, solverOne, solverTwo, solverThree, solverFour);
    // then gets score based on round being played from scoreArmRound method.
    return {
        id: playerId,
        architecture,
        round,
        solverOne,
        solverTwo, // optional
        solverThree, // optional
        solverFour, // optional
        weight,
        cost,
        score: scoreArmRound(round, weight, cost, customPerformance),
    }
}