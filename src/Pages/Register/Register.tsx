import {
    Button,
    ColorPicker,
    Input,
    InputNumber,
    Radio,
    Select,
    SelectProps,
    Table,
} from 'antd';
import './Register.scss';
import { useContext, useEffect, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { PlayerInformation, PlayerBrief, UserContextType, EssentialPlayerInformation } from '../../Utils/Types';
import { UserContext } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import GolfBall from '../../ReusableComponents/GolfBall';
import { allCountriesArray } from '../../Utils/Countries';

// Register
const Register = () => {

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
    const [residence, setResidence] = useState('');

    // ethnicity is a multi select that is converted to a comma separated string
    const ethnicityOptions: SelectProps['options'] = [
        { value: 'American Indian or Alaska Native', label: 'American Indian or Alaska Native' },
        { value: 'Asian or Asian American', label: 'Asian or Asian American' },
        { value: 'Black or African American', label: 'Black or African American' },
        { value: 'Hispanic or Latino', label: 'Hispanic or Latino' },
        { value: 'Middle Eastern or North African', label: 'Middle Eastern or North African' },
        { value: 'Native Hawai\'ian or Other Pacific Islander', label: 'Native Hawai\'ian or Other Pacific Islander' },
        { value: 'White or European', label: 'White or European' },
        { value: 'Prefer not to say', label: 'Prefer not to say' },
    ]
    const [ethnicity, setEthnicity] = useState<string[]>([]);

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
    const educationLevels = ["Highschool", "Bachelors", "Masters", "Doctorate"]

    const [educationalBackgroundCompleted, setEducationalBackgroundCompleted] = useState(Array(educationLevels.length + 1).fill(0));
    const [educationalBackgroundSubjectArea, setEducationalBackgroundSubjectArea] = useState(Array(educationLevels.length + 1).fill('N/A'));
    const [otherEducation, setOtherEducation] = useState('');

    // Create each row of table
    const getEducationalBackgroundDataSource = () => {
        const dataSourceArray = educationLevels.map((educationLevel, index) => {
            return {
                key: "Key: " + index,
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
                        <Radio value={2}>Current</Radio>
                    </Radio.Group>
                </div>,
                SubjectArea: <div>
                    <Input
                        value={educationalBackgroundSubjectArea[index]}
                        onChange={(e) => {
                            const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                            newEducationalBackgroundSubjectArea[index] = e.target.value;
                            setEducationalBackgroundSubjectArea((prev) => {
                                const newEducationalBackgroundSubjectArea = [...prev];
                                newEducationalBackgroundSubjectArea[index] = e.target.value;
                                return newEducationalBackgroundSubjectArea;
                            });
                        }}
                        maxLength={64}
                        disabled={educationalBackgroundCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: "Key: Other Education",
            EducationLevel: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherEducation}
                    onChange={(e) => setOtherEducation(e.target.value)}
                    maxLength={64}
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
                    <Radio value={2}>Current</Radio>
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
                    maxLength={64}
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

    // 7 point questions:
    const experienceQuestions = ["riskAnalysisExperience", "supplierExperience", "proposalOrStatementOfWorkExperience", "bidsForRequestsExperience", "systemArchitectureExperience", "golfExperience", "systemsEngineeringExpertise",
        "statementOfWorkExpertise"];
    // how experience questions are presented to users:
    const experienceQuestionPrompts=[
        "How experienced are you with probabilistic reasoning and/or risk analysis?",
        "Do you have any experience with working with suppliers or contractors?",
        "Do you have any experience evaluating or creating request for proposal (RFP), or statement of work (SOW) documents?",
        "Do you have any experience submitting bids for requests for proposal (RFPs)?",
        "Do you have any experience with creating or evaluating system architectures?",
        "How familiar are you with the game of Golf?",
        "A systems engineering problem is:",
        "Defining statement of work documents and / or work contracts is:",
    ];
    // values saved for experience questions:
    const [experienceValues, setExperienceValues] = useState<Array<null | number>>(Array(experienceQuestions.length).fill(null));

    const [color, setColor] = useState('#ffffff');
    const [joinCode, setJoinCode] = useState(joinCodeUrl ? joinCodeUrl : '');

    // disable submit button so it cannot be clicked more than once
    const [submitting, setSubmitting] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // setIsHost, setSessionId, and setPlayerId can be retreived from context
    const { setIsHost, setSessionId, setPlayerId, setPlayerColor } = useContext(UserContext) as UserContextType;
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
        } else if (!residence) {
            document.getElementById('Residence')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (ethnicity.length === 0) {
            document.getElementById('Ethnicity')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (isCollegeStudent && (!university || !degreeProgram || !yearsInProgram)) {
            document.getElementById('IsCollegeStudent')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else {
            // check all 7 point experience questions
            for (let i = 0; i < experienceValues.length; i++) {
                if (experienceValues[i] === null) {
                    document.getElementById(experienceQuestions[i])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                }
            }
            return true;
        }
    }


    const [pulledFromLocalStorage, setPulledFromLocalStorage] = useState(false);

    // if user info in localStorage, pull it out
    useEffect(() => {
        if (localStorage.getItem('playerInformation') && !pulledFromLocalStorage) {
            // stored education and specialization names:
            const educationLevelsStored = ["highschoolEducation", "bachelorsEducation", "mastersEducation", "doctorateEducation", "otherEducation"];
            const experienceQuestionsStored = ["riskAnalysisExperience", "supplierExperience", "proposalOrStatementOfWorkExperience", "bidsForRequestsExperience", "systemArchitectureExperience", "golfExperience", "systemsEngineeringExpertise",
                "statementOfWorkExpertise"];

            const playerInformation = JSON.parse(localStorage.getItem('playerInformation') as string);
            setName(playerInformation.name);
            setColor(playerInformation.color);
            setParticipationReason(playerInformation.participationReason);
            setGender(playerInformation.gender);
            setAge(playerInformation.age);
            setResidence(playerInformation.residence);
            setEthnicity(playerInformation.ethnicity? playerInformation.ethnicity.split(', '): []);
            setIsCollegeStudent(playerInformation.isCollegeStudent);
            if (playerInformation.university) setUniversity(playerInformation.university);
            if (playerInformation.degreeProgram) setDegreeProgram(playerInformation.degreeProgram);
            if (playerInformation.yearsInProgram) setYearsInProgram(playerInformation.yearsInProgram);
            const newEducationalBackgroundCompleted = Array(educationLevels.length + 1).fill(0);
            const newEducationalBackgroundSubjectArea = Array(educationLevels.length + 1).fill("N/A");
            educationLevelsStored.forEach((educationLevel, index) => {
                if (playerInformation[educationLevel]) {
                    newEducationalBackgroundCompleted[index] = playerInformation[educationLevel].startsWith("Yes") ? 1 : 2;
                    newEducationalBackgroundSubjectArea[index] 
                        = playerInformation[educationLevel].substring(playerInformation[educationLevel].indexOf(":") + 1);
                } else {
                    newEducationalBackgroundCompleted[index] = 0;
                }
            });
            setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
            setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
            if (playerInformation.otherEducationName) setOtherEducation(playerInformation.otherEducationName);

            const newExperienceValues = [...experienceValues];
            experienceQuestionsStored.forEach((experienceQuestion, index) => {
                if (playerInformation[experienceQuestion]) {
                    newExperienceValues[index] = playerInformation[experienceQuestion];
                }
            });
            setExperienceValues(newExperienceValues);

            setPulledFromLocalStorage(true);
        }
    }, [pulledFromLocalStorage, experienceValues, educationLevels.length]);

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
                    residence,
                    ethnicity: ethnicity.join(', '), // convert array to string

                    isCollegeStudent: isCollegeStudent,
                    university,
                    degreeProgram,
                    yearsInProgram,

                    // TODO may be better to just send arrays? Instead of so many ungrouped fields for education levels and specializations ... 
                    // All selected education values begin with "Yes:" or "Current:".
                    highschoolEducation: educationalBackgroundCompleted[0] ? 
                    ((educationalBackgroundCompleted[0] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[0])  : undefined,
                    bachelorsEducation: educationalBackgroundCompleted[1] ? 
                    ((educationalBackgroundCompleted[1] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[1])  : undefined,
                    mastersEducation: educationalBackgroundCompleted[2] ? 
                    ((educationalBackgroundCompleted[2] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[2])  : undefined,
                    doctorateEducation: educationalBackgroundCompleted[3] ? 
                    ((educationalBackgroundCompleted[3] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[3])  : undefined,
                    otherEducationName: educationalBackgroundCompleted[educationLevels.length] ? otherEducation : null,
                    otherEducation: educationalBackgroundCompleted[educationLevels.length]
                        ? ((educationalBackgroundCompleted[educationLevels.length] === 1 ? "Yes:" : "Current:") 
                        + educationalBackgroundSubjectArea[educationLevels.length])  : undefined,

                    riskAnalysisExperience: experienceValues[0],
                    supplierExperience: experienceValues[1],
                    proposalOrStatementOfWorkExperience: experienceValues[2],
                    bidsForRequestsExperience: experienceValues[3],
                    systemArchitectureExperience: experienceValues[4],
                    golfExperience: experienceValues[5],
                    systemsEngineeringExpertise: experienceValues[6],
                    statementOfWorkExpertise: experienceValues[7],
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
                        // save essential information to local storage
                        const essentialPlayerInformation: EssentialPlayerInformation = 
                        {
                            isHost: true,
                            sessionId: submitResult.joinCode,
                            playerId: submitResult.playerId,
                            playerColor: color
                        }
                        localStorage.setItem('essentialPlayerInformation', JSON.stringify(essentialPlayerInformation))

                        navigate('/game');
                    } else {
                        alert("Failed to submit form. \n\nThe database or backend may be rebooting, please wait one minute and try again.");
                        console.error(submitResult)
                        setSubmitting(false);
                    }
                } else {
                    const submitResult = await postRequest('player/join', JSON.stringify({ ...newPlayerBrief, ...newPlayerInformation, joinCode }))
                    if (submitResult.success) {
                        setIsSuccesfullySubmitted(true);
                        setIsHost(false);
                        setSessionId(Number(joinCode));
                        setPlayerId(submitResult.playerId);
                        setPlayerColor(color);
                        // save essential information to local storage
                        const essentialPlayerInformation: EssentialPlayerInformation = 
                        {
                            isHost: false,
                            sessionId: Number(joinCode),
                            playerId: submitResult.playerId,
                            playerColor: color
                        }
                        localStorage.setItem('essentialPlayerInformation', JSON.stringify(essentialPlayerInformation))

                        navigate('/game');
                    } else if (submitResult.error === "Session has already started") {
                        alert("Cannot join session, it has already started.");
                        setSubmitting(false);
                    } else {
                        alert("Failed to submit form. \n\nEnsure the Join Code is Correct");
                        console.error(submitResult)
                        setSubmitting(false);
                    }
                }
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message + " \n\nThe database or backend may be rebooting, please wait one minute and try again.");
            setSubmitting(false);
        }
    }

    return (
        <div className='Register'>
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
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
                            <p className='FormTitle' id='Residence' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Country of Residence
                            </p>
                            <Select
                                className={attemptedSubmit && !residence ? "ErrorForm" : ""}
                                showSearch
                                filterOption={(input: string, option?: { label: string; value: string }) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                defaultValue=""
                                value={residence}
                                options={
                                    allCountriesArray.map((country) => { return { value: country, label: country } })
                                }
                                onChange={(newValue) => {
                                    setResidence(newValue);
                                }}
                            />

                            <p className='FormTitle' id='Ethnicity' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Ethnicity Identity (check all that apply):
                            </p>
                            <Select
                                className={attemptedSubmit && ethnicity.length === 0 ? "ErrorForm" : ""}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                defaultValue={[]}
                                value={ethnicity}
                                onChange={(value: string[]) => {
                                    if (value.includes('Prefer not to say')) {
                                        setEthnicity(['Prefer not to say'])
                                    } else {
                                        setEthnicity(value)
                                    }
                                }}
                                options={ethnicityOptions}
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
                                // key={"" + educationalBackgroundCompleted + educationalBackgroundSubjectArea + otherEducation}
                                dataSource={getEducationalBackgroundDataSource()}
                                columns={educationalBackgroundColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <h3>
                                For the following questions please answer how much experience you have in each of the following areas. With the left-most circle being the least experience and the right-most circle being the most experience.
                            </h3>

                            {
                                // show all experience questions
                                experienceValues.map((value, index) => (
                                    <div key={index + " value of: " + value}>
                                        <p id={experienceQuestions[index]}>
                                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                            {experienceQuestionPrompts[index]}
                                        </p>
                                        <div className={`ExpertiseGrid ${value === null
                                            && attemptedSubmit ? "ErrorForm" : ""}`}>
                                                <p>Outside my field of expertise</p>
                                                <p>.....</p>
                                                <p>.....</p>
                                                <p>At the boundary of my field of Expertise</p>
                                                <p>.....</p>
                                                <p>.....</p>
                                                <p>Inside my field of expertise</p>

                                                <Radio checked={value === 0} value={value === 0} onClick={() => {
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 0;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                                <Radio checked={value === 1} value={value === 1} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 1;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                                <Radio checked={value === 2} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 2;
                                                    setExperienceValues(newValues);
                                                }}></Radio>
                                                <Radio checked={value === 3} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 3;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                                <Radio checked={value === 4} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 4;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                                <Radio checked={value === 5} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 5;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                                <Radio checked={value === 6} onClick={() => { 
                                                    const newValues = [...experienceValues];
                                                    newValues[index] = 6;
                                                    setExperienceValues(newValues) 
                                                }}></Radio>
                                        </div>
                                        <br/>
                                    </div>
                                ))
                            }

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