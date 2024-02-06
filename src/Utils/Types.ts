// Temporary global types file to hold all types, will be further organized as data load increases.

// Smaller structure to hold just information necessary to poll during the game
export interface PlayerBrief {
    id?: number;
    name: string;
    color: string;
    sessionId?: number;
}

// All information for players obtained from the registration form
export interface PlayerInformation {
    id?: number;
    name: string;
    participationReason: string;
    gender: string;
    age: null | number;
    country: string;
    hobbies: string;

    isCollegeStudent: number;
    university?: string;
    degreeProgram?: string;
    yearsInProgram?: null | number;

    // Education levels: "HighSchool", "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate", "Other"
    highschoolEducation?: string;
    associatesEducation?: string;
    bachelorsEducation?: string;
    mastersEducation?: string;
    professionalEducation?: string;
    doctorateEducation?: string;
    otherEducationName?: string | null;
    otherEducation?: string;

    // Specializations: "Aerospace Engineering", "Design", "Electrical Engineering", "Industrial Engineering", 
    //    "Manufacturing", "Material Science or Engineering", "Mechanical Engineering", "Project Management", 
    //    "Robotics or Mechatronics", "Software or Computer Engineering or Computer Science", "Systems Engineering"
    aerospaceEngineeringSpecialization?: number;
    designSpecialization?: number;
    electricalEngineeringSpecialization?: number;
    industrialEngineeringSpecialization?: number;
    manufacturingSpecialization?: number;
    materialScienceSpecialization?: number;
    mechanicalEngineeringSpecialization?: number;
    projectManagementSpecialization?: number;
    roboticsSpecialization?: number;
    softwareSpecialization?: number;
    systemsEngineeringSpecialization?: number;
    otherSpecializationName?: string | null;
    otherSpecialization?: number;

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