import {
    Button,
    ColorPicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Table,
} from 'antd';
import './Register.scss';
import { useContext, useEffect, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { PlayerInformation, PlayerBrief } from '../../Utils/Types';
import { UserContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import GolfBall from '../../ReusableComponents/GolfBall';
import { allCountriesArray } from '../../Utils/Countries';

// Register
const Register = (props: any) => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    // If playerType is 'host' then user is creating a new session, for any other value
    // (which should be 'join') then the user is joining a session.
    const { playerType, joinCodeUrl } = useParams();

    const [isSuccesfullySubmitted, setIsSuccesfullySubmitted] = useState(false);
    const [name, setName] = useState('');
    const [participationReason, setParticipationReason] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState<number | null>(0);
    const [country, setCountry] = useState('');
    const [hobbies, setHobbies] = useState('');

    // If user is an undergraduate or graduate college student open the college 
    // questions to them
    const [isCollegeStudent, setIsCollegeStudent] = useState(0);
    // Begin only for college students
    const [university, setUniversity] = useState('');
    const [degreeProgram, setDegreeProgram] = useState('');
    const [yearsInProgram, setYearsInProgram] = useState<null | number>(0);
    // End only for college students

    /**
     * Information for Table for gathering Educational Background
     */
    const educationLevels = ["Highschool", "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate"]

    const [educationalBackgroundCompleted, setEducationalBackgroundCompleted] = useState(Array(educationLevels.length + 1).fill(0));
    const [educationalBackgroundSubjectArea, setEducationalBackgroundSubjectArea] = useState(Array(educationLevels.length + 1).fill('N/A'));
    const [otherEducation, setOtherEducation] = useState('');

    // Create each row of table
    const getEducationalBackgroundDataSource = () => {

        const dataSourceArray = educationLevels.map((educationLevel, index) => {
            return {
                key: index,
                EducationLevel: <p>{educationLevel}</p>,
                Completed: <div>
                    <Radio.Group
                        onChange={(e) => {
                            const newEducationalBackgroundCompleted = [...educationalBackgroundCompleted];
                            newEducationalBackgroundCompleted[index] = e.target.value;
                            setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                        }}
                        value={educationalBackgroundCompleted[index]}>
                        <Radio value={0}>No</Radio>
                        <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                </div>,
                SubjectArea: <div>
                    <Input
                        value={educationalBackgroundSubjectArea[index]}
                        onChange={(e) => {
                            const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                            newEducationalBackgroundSubjectArea[index] = e.target.value;
                            setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
                        }}
                        disabled={educationalBackgroundCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: educationLevels.length,
            EducationLevel: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherEducation}
                    onChange={(e) => setOtherEducation(e.target.value)}
                />
            </div>,
            Completed: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Radio.Group
                    onChange={(e) => {
                        const newEducationalBackgroundCompleted = [...educationalBackgroundCompleted];
                        newEducationalBackgroundCompleted[educationLevels.length] = e.target.value;
                        setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                    }}
                    value={educationalBackgroundCompleted[educationLevels.length]}>
                    <Radio value={0}>No</Radio>
                    <Radio value={1}>Yes</Radio>
                </Radio.Group>
            </div>,
            SubjectArea: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Input
                    value={educationalBackgroundSubjectArea[educationLevels.length]}
                    onChange={(e) => {
                        const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                        newEducationalBackgroundSubjectArea[educationLevels.length] = e.target.value;
                        setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
                    }}
                    disabled={educationalBackgroundCompleted[educationLevels.length] === 0}
                />
            </div>,

        })
        return dataSourceArray;
    }

    const educationalBackgroundColumns = [
        {
            title: 'Education',
            dataIndex: 'EducationLevel',
            key: 'Education Level',
            width: '25%'
        },
        {
            title: 'Completed',
            dataIndex: 'Completed',
            key: 'Completed',
            width: '25%'
        },
        {
            title: 'Subject Area \n (e.g., Chemistry) \n Please no acryonyms',
            dataIndex: 'SubjectArea',
            key: 'SubjectArea',
            width: '50%'
        },
    ];

    /**
     * End information for Table for gathering Educational Background
     */


    /**
     * Information for Table for gathering Technical Organization Background and years of specializations
     */
    const specializations = ["Aerospace Engineering", "Design", "Electrical Engineering", "Industrial Engineering",
        "Manufacturing", "Material Science or Engineering", "Mechanical Engineering", "Project Management",
        "Robotics or Mechatronics", "Software or Computer Engineering or Computer Science", "Systems Engineering"];

    const [specializationCompleted, setSpecializationCompleted] = useState(Array(specializations.length + 1).fill(0));
    const [specializationYears, setSpecializationYears] = useState(Array(specializations.length + 1).fill(0));
    const [otherSpecialization, setOtherSpecialization] = useState('');


    // Create each row of table
    const getSpecializationDataSource = () => {

        const dataSourceArray = specializations.map((specialization, index) => {
            return {
                key: index,
                Specialization: <p>{specialization}</p>,
                Completed: <div>
                    <Radio.Group
                        onChange={(e) => {
                            const newSpecializationCompleted = [...specializationCompleted];
                            newSpecializationCompleted[index] = e.target.value;
                            setSpecializationCompleted(newSpecializationCompleted);
                        }}
                        value={specializationCompleted[index]}>
                        <Radio value={0}>No</Radio>
                        <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                </div>,
                Years: <div>
                    <InputNumber
                        value={specializationYears[index]}
                        min={0}
                        max={99}
                        onChange={(e) => {
                            const newSpecializationYears = [...specializationYears];
                            newSpecializationYears[index] = e;
                            setSpecializationYears(newSpecializationYears);
                        }}
                        disabled={specializationCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: specializations.length,
            Specialization: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherSpecialization}
                    onChange={(e) => setOtherSpecialization(e.target.value)}
                />
            </div>,
            Completed: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Radio.Group
                    onChange={(e) => {
                        const newSpecializationCompleted = [...specializationCompleted];
                        newSpecializationCompleted[specializations.length] = e.target.value;
                        setSpecializationCompleted(newSpecializationCompleted);
                    }}
                    value={specializationCompleted[specializations.length]}>
                    <Radio value={0}>No</Radio>
                    <Radio value={1}>Yes</Radio>
                </Radio.Group>
            </div>,
            Years: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <InputNumber
                    value={specializationYears[specializations.length]}
                    min={0}
                    max={99}
                    onChange={(e) => {
                        const newSpecializationYears = [...specializationYears];
                        newSpecializationYears[specializations.length] = e;;
                        setSpecializationYears(newSpecializationYears);
                    }}
                    disabled={specializationCompleted[specializations.length] === 0}
                />
            </div>,

        })
        return dataSourceArray;
    }

    const specializationColumns = [
        {
            title: 'Specialization',
            dataIndex: 'Specialization',
            key: 'Specialization',
            width: '30%'
        },
        {
            title: 'Have you worked or volunteered in this field?',
            dataIndex: 'Completed',
            key: 'Completed',
            width: '30%'
        },
        {
            title: 'Number of Years',
            dataIndex: 'Years',
            key: 'Years',
            width: '30%'
        },
    ];

    /**
     * End information for Table for gathering Educational Background
     */

    const [systemsEngineeringExpertise, setSystemsEngineeringExpertise] = useState<number | null>(null);
    const [statementOfWorkExpertise, setStatementOfWorkExpertise] = useState<number | null>(null);

    const [color, setColor] = useState('#ffffff');
    const [joinCode, setJoinCode] = useState(joinCodeUrl ? joinCodeUrl : '');

    // disable submit button so it cannot be clicked more than once
    const [submitting, setSubmitting] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // setIsHost, setSessionId, and setPlayerId can be retreived from context
    const { setIsHost, setSessionId, setPlayerId, setPlayerColor } = useContext(UserContext) as any;
    // take users to session screen on successful submit
    const navigate = useNavigate();

    // verify user can submit
    const canSubmit = () => {
        // check for invalid elements and scroll to top element that is invalid
        if (!name) {
            document.getElementById('Name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!participationReason) {
            document.getElementById('ParticipationReason')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!gender) {
            document.getElementById('Gender')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!age) {
            document.getElementById('Age')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!country) {
            document.getElementById('Country')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (isCollegeStudent && (!university || !degreeProgram || !yearsInProgram)) {
            document.getElementById('IsCollegeStudent')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (systemsEngineeringExpertise === null) {
            document.getElementById('SystemsExpertise')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (statementOfWorkExpertise === null) {
            document.getElementById('StatementOfWorkExpertise')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else {
            return true;
        }
    }


    const [pulledFromLocalStorage, setPulledFromLocalStorage] = useState(false);

    // if user info in localStorage, pull it out
    useEffect(() => {
        if (localStorage.getItem('playerInformation') && !pulledFromLocalStorage) {
            // stored education and specialization names:
            const educationLevelsStored = ["highschoolEducation", "associatesEducation", "bachelorsEducation", "mastersEducation", "professionalEducation", "doctorateEducation", "otherEducation"];
            const specializationsStored = ["aerospaceEngineeringSpecialization", "designSpecialization", "electricalEngineeringSpecialization", "industrialEngineeringSpecialization", "manufacturingSpecialization", "materialScienceSpecialization", "mechanicalEngineeringSpecialization", "projectManagementSpecialization", "roboticsSpecialization", "softwareSpecialization", "systemsEngineeringSpecialization", "otherSpecialization"]

            const playerInformation = JSON.parse(localStorage.getItem('playerInformation') as string);
            setName(playerInformation.name);
            setColor(playerInformation.color);
            setParticipationReason(playerInformation.participationReason);
            setGender(playerInformation.gender);
            setAge(playerInformation.age);
            setCountry(playerInformation.country);
            if (playerInformation.hobbies) setHobbies(playerInformation.hobbies);
            setIsCollegeStudent(playerInformation.isCollegeStudent);
            if (playerInformation.university) setUniversity(playerInformation.university);
            if (playerInformation.degreeProgram) setDegreeProgram(playerInformation.degreeProgram);
            if (playerInformation.yearsInProgram) setYearsInProgram(playerInformation.yearsInProgram);
            educationLevelsStored.forEach((educationLevel, index) => {
                if (playerInformation[educationLevel]) {
                    const newEducationalBackgroundCompleted = [...educationalBackgroundCompleted];
                    newEducationalBackgroundCompleted[index] = true;
                    setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                    const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                    newEducationalBackgroundSubjectArea[index] = playerInformation[educationLevel];
                    setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
                }
            });
            if (playerInformation.otherEducationName) setOtherEducation(playerInformation.otherEducationName);

            specializationsStored.forEach((specialization, index) => {
                if (playerInformation[specialization]) {
                    const newSpecializationCompleted = [...specializationCompleted];
                    newSpecializationCompleted[index] = true;
                    setSpecializationCompleted(newSpecializationCompleted);
                    const newSpecializationYears = [...specializationYears];
                    newSpecializationYears[index] = playerInformation[specialization];
                    setSpecializationYears(newSpecializationYears);
                }
            });
            if (playerInformation.otherSpecializationName) setOtherSpecialization(playerInformation.otherSpecializationName);

            if (playerInformation.systemsEngineeringExpertise) setSystemsEngineeringExpertise(playerInformation.systemsEngineeringExpertise);
            if (playerInformation.statementOfWorkExpertise) setStatementOfWorkExpertise(playerInformation.statementOfWorkExpertise);

            setPulledFromLocalStorage(true);
        }
    }, [educationalBackgroundCompleted, educationalBackgroundSubjectArea, pulledFromLocalStorage, specializationCompleted, specializationYears]);

    const submit = async () => {
        // if successful give a happy message, otherwise let them know after an error from the backend
        try {
            setSubmitting(true);
            setAttemptedSubmit(true);
            if (canSubmit()) {
                // save player information
                const newPlayerBrief: PlayerBrief = {
                    name,
                    color
                }
                const newPlayerInformation: PlayerInformation = {
                    name,
                    participationReason,
                    gender,
                    age,
                    country,
                    hobbies,

                    isCollegeStudent: isCollegeStudent,
                    university,
                    degreeProgram,
                    yearsInProgram,

                    // TODO may be better to just send arrays? Instead of so many ungrouped fields for education levels and specializations
                    // TODO Sanatize Inputs more so no strings are very long and no SQL injections are possible
                    highschoolEducation: educationalBackgroundCompleted[0] ? educationalBackgroundSubjectArea[0] : null,
                    associatesEducation: educationalBackgroundCompleted[1] ? educationalBackgroundSubjectArea[1] : null,
                    bachelorsEducation: educationalBackgroundCompleted[2] ? educationalBackgroundSubjectArea[2] : null,
                    mastersEducation: educationalBackgroundCompleted[3] ? educationalBackgroundSubjectArea[3] : null,
                    professionalEducation: educationalBackgroundCompleted[4] ? educationalBackgroundSubjectArea[4] : null,
                    doctorateEducation: educationalBackgroundCompleted[5] ? educationalBackgroundSubjectArea[5] : null,
                    otherEducationName: educationalBackgroundCompleted[educationLevels.length] ? otherEducation : null,
                    otherEducation: educationalBackgroundCompleted[educationLevels.length]
                        ? educationalBackgroundSubjectArea[educationLevels.length] : null,

                    aerospaceEngineeringSpecialization: specializationCompleted[0] ? specializationYears[0] : null,
                    designSpecialization: specializationCompleted[1] ? specializationYears[1] : null,
                    electricalEngineeringSpecialization: specializationCompleted[2] ? specializationYears[2] : null,
                    industrialEngineeringSpecialization: specializationCompleted[3] ? specializationYears[3] : null,
                    manufacturingSpecialization: specializationCompleted[4] ? specializationYears[4] : null,
                    materialScienceSpecialization: specializationCompleted[5] ? specializationYears[5] : null,
                    mechanicalEngineeringSpecialization: specializationCompleted[6] ? specializationYears[6] : null,
                    projectManagementSpecialization: specializationCompleted[7] ? specializationYears[7] : null,
                    roboticsSpecialization: specializationCompleted[8] ? specializationYears[8] : null,
                    softwareSpecialization: specializationCompleted[9] ? specializationYears[9] : null,
                    systemsEngineeringSpecialization: specializationCompleted[10] ? specializationYears[10] : null,
                    otherSpecializationName: specializationCompleted[specializations.length] ? otherSpecialization : null,
                    otherSpecialization: specializationCompleted[specializations.length]
                        ? specializationYears[specializations.length] : null,

                    systemsEngineeringExpertise,
                    statementOfWorkExpertise,
                }

                // Save to context whether a player is joining or hosting the session. The Player's unique playerId
                // will also need to be saved.

                // Save player information to localStorage and retreive it if it is there on start
                localStorage.setItem('playerInformation', JSON.stringify({ ...newPlayerBrief, ...newPlayerInformation }));


                if (playerType === 'host') {
                    const submitResult = await postRequest('player/host', JSON.stringify({ ...newPlayerBrief, ...newPlayerInformation }))
                    if (submitResult.success) {
                        setIsSuccesfullySubmitted(true);
                        setIsHost(true);
                        setSessionId(submitResult.joinCode);
                        setPlayerId(submitResult.playerId);
                        setPlayerColor(color);
                        navigate('/game');
                    } else {
                        alert("Failed to submit form.");
                        console.error(submitResult)
                        setSubmitting(false);
                    }
                } else {
                    const submitResult = await postRequest('player/join', JSON.stringify({ ...newPlayerBrief, ...newPlayerInformation, joinCode }))
                    if (submitResult.success) {
                        setIsSuccesfullySubmitted(true);
                        setIsHost(false);
                        setSessionId(joinCode);
                        setPlayerId(submitResult.playerId);
                        setPlayerColor(color);
                        navigate('/game');
                    } else {
                        alert("Failed to submit form.");
                        console.error(submitResult)
                        setSubmitting(false);
                    }
                }
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message);
            setSubmitting(false);
        }
    }

    return (
        <div className='Register'>
            <div className='Login'>
                <h1>{playerType === 'host' ? "Register to Create and Host a Session" : "Register to Join an Ongoing Session"}</h1>
                {
                    isSuccesfullySubmitted ?
                        <div className='SuccessfulSubmit'>
                            <h3>Congratulations your form has successfully been submitted!</h3>
                            <img src='https://media.tenor.com/LEhC5W9BQBIAAAAj/svtl-transparent.gif' alt='Success' />
                        </div>
                        :
                        <div className='InputForm'>
                            <h3>All Asterisks are required</h3>
                            <p className="FormTitle" id='Name' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Name
                            </p>
                            <Input
                                className={attemptedSubmit && !name ? "ErrorForm" : ""}
                                placeholder='Jane Doe'
                                maxLength={20}
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value && event.target.value.length > 20 ? event.target.value.substring(0, 20) : event.target.value);
                                }}
                            />
                            <p className='FormTitle' id='ParticipationReason' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Why are you interested in playing?
                            </p>
                            <Select
                                className={attemptedSubmit && !participationReason ? "ErrorForm" : ""}
                                defaultValue=""
                                value={participationReason}
                                options={[
                                    { value: '', label: '' },
                                    { value: 'Class activity', label: 'Class activity' },
                                    { value: 'Leisure', label: 'Leisure' },
                                    { value: 'Academic workshop', label: 'Academic workshop' },
                                    { value: 'Professional training', label: 'Professional training' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                onChange={(newValue) => {
                                    setParticipationReason(newValue);
                                }}
                            />
                            <p className='FormTitle' id='Gender' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                How do you Identify?
                            </p>
                            <Select
                                className={attemptedSubmit && !gender ? "ErrorForm" : ""}
                                defaultValue=""
                                value={gender}
                                options={[
                                    { value: '', label: '' },
                                    { value: 'Nonbinary', label: 'Nonbinary' },
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                                ]}
                                onChange={(newValue) => {
                                    setGender(newValue);
                                }}
                            />
                            <p className='FormTitle' id='Age' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                How old are you?
                            </p>
                            <InputNumber
                                className={attemptedSubmit && !age ? "ErrorForm" : ""}
                                min={1}
                                max={99}
                                value={age}
                                onChange={(e) => setAge(e)}
                                addonAfter="Years Old"
                            />
                            <p className='FormTitle' id='Country' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Country
                            </p>
                            <Select
                                className={attemptedSubmit && !country ? "ErrorForm" : ""}
                                showSearch
                                filterOption={(input: string, option?: { label: string; value: string }) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                defaultValue=""
                                value={country}
                                options={
                                    allCountriesArray.map((country) => { return { value: country, label: country } })
                                }
                                onChange={(newValue) => {
                                    setCountry(newValue);
                                }}
                            />

                            <p className='FormTitle' id='Hobbies' >Have you ever participated in any sports or serious hobbies? If so, please list them:</p>
                            <Input
                                value={hobbies}
                                onChange={(event) => {
                                    setHobbies(event.target.value);
                                }}
                                placeholder='Soccer, Chess, etc.'
                            />


                            <div className='PageBreak'></div>



                            <p className='FormTitle' id='IsCollegeStudent' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Are you currenlty a student in an undergraduate or graduate program?
                            </p>
                            <Radio.Group
                                value={isCollegeStudent}
                            >
                                <Radio value={0} onClick={() => { setIsCollegeStudent(0) }}>No</Radio>
                                <Radio value={1} onClick={() => { setIsCollegeStudent(1) }}>Yes</Radio>
                            </Radio.Group>
                            {
                                !!isCollegeStudent &&
                                <div className='IsCollegeStudent'>
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        University
                                    </p>
                                    <Input
                                        className={attemptedSubmit && isCollegeStudent && !university ? "ErrorForm" : ""}
                                        placeholder='Virginia Tech'
                                        maxLength={64}
                                        value={university}
                                        onChange={(event) => {
                                            setUniversity(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 64) : event.target.value);
                                        }}
                                    />
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        Degree Program
                                    </p>
                                    <Input
                                        className={attemptedSubmit && isCollegeStudent && !degreeProgram ? "ErrorForm" : ""}
                                        placeholder='Industrial Systems Engineering'
                                        maxLength={64}
                                        value={degreeProgram}
                                        onChange={(event) => {
                                            setDegreeProgram(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 64) : event.target.value);
                                        }}
                                    />
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        Years in Program
                                    </p>
                                    <InputNumber
                                        className={attemptedSubmit && isCollegeStudent && !yearsInProgram ? "ErrorForm" : ""}
                                        min={1}
                                        max={99}
                                        value={yearsInProgram}
                                        onChange={(e) => setYearsInProgram(e)}
                                        addonAfter="Years"
                                    />
                                </div>
                            }

                            <div className='PageBreak'></div>

                            <p>Educational Background. Please fill in all of your degrees and / or certifications</p>
                            <Table
                                dataSource={getEducationalBackgroundDataSource()}
                                columns={educationalBackgroundColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <p>
                                If you have ever worked in a technical organization, for each area of specialization,
                                indicate your number of years of experience.
                            </p>
                            <Table
                                dataSource={getSpecializationDataSource()}
                                columns={specializationColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <p id='SystemsExpertise'>
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                A systems engineering problem is:
                            </p>
                            <div className={`ExpertiseGrid ${systemsEngineeringExpertise === null && attemptedSubmit ? "ErrorForm" : ""}`}>
                                <p>Outside my field of expertise</p>
                                <p>.....</p>
                                <p>.....</p>
                                <p>At the boundary of my field of Expertise</p>
                                <p>.....</p>
                                <p>.....</p>
                                <p>Inside my field of expertise</p>

                                <Radio checked={systemsEngineeringExpertise === 0} onClick={() => { setSystemsEngineeringExpertise(0) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 1} onClick={() => { setSystemsEngineeringExpertise(1) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 2} onClick={() => { setSystemsEngineeringExpertise(2) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 3} onClick={() => { setSystemsEngineeringExpertise(3) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 4} onClick={() => { setSystemsEngineeringExpertise(4) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 5} onClick={() => { setSystemsEngineeringExpertise(5) }}></Radio>
                                <Radio checked={systemsEngineeringExpertise === 6} onClick={() => { setSystemsEngineeringExpertise(6) }}></Radio>
                            </div>

                            <p id='StatementOfWorkExpertise'>
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Defining statement of work documents and / or work contracts is:
                            </p>
                            <div className={`ExpertiseGrid ${!statementOfWorkExpertise && attemptedSubmit ? "ErrorForm" : ""}`}>
                                <p>Outside my field of expertise</p>
                                <p>.....</p>
                                <p>.....</p>
                                <p>At the boundary of my field of Expertise</p>
                                <p>.....</p>
                                <p>.....</p>
                                <p>Inside my field of expertise</p>

                                <Radio checked={statementOfWorkExpertise === 0} onClick={() => { setStatementOfWorkExpertise(0) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 1} onClick={() => { setStatementOfWorkExpertise(1) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 2} onClick={() => { setStatementOfWorkExpertise(2) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 3} onClick={() => { setStatementOfWorkExpertise(3) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 4} onClick={() => { setStatementOfWorkExpertise(4) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 5} onClick={() => { setStatementOfWorkExpertise(5) }}></Radio>
                                <Radio checked={statementOfWorkExpertise === 6} onClick={() => { setStatementOfWorkExpertise(6) }}></Radio>
                            </div>

                            <div className='PageBreak'></div>

                            <div className='GolfBallContainer'>
                                <p className='FormTitle' >Golf ball</p>
                                <GolfBall color={color} />
                            </div>
                            <ColorPicker
                                showText
                                disabledAlpha
                                defaultValue={'#000000'}
                                onChange={(value, hex) => {
                                    setColor(hex);
                                }}
                            />
                            {
                                // If player is joining and not a host make them put in the join code
                                playerType !== 'host' &&
                                <div className='InputForm'>
                                    <p className='FormTitle' >Join Code</p>
                                    <Input className={(playerType !== 'host' && !joinCode && attemptedSubmit) ? "ErrorForm" : ""}
                                        placeholder='123456'
                                        maxLength={6}
                                        value={joinCode}
                                        onChange={(event) => {
                                            setJoinCode(event.target.value && event.target.value.length > 6 ? event.target.value.substring(0, 6) : event.target.value);
                                        }}
                                    />
                                </div>
                            }
                            <br>
                            </br>
                            <div className='ButtonHolder'>
                                <Button
                                    disabled={submitting}
                                    onClick={submit}
                                >
                                    Submit
                                </Button>
                            </div>
                            <br></br>
                        </div>
                }
            </div>
        </div>
    )
}

export default Register;