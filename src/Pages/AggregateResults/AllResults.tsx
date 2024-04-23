import { Button, Checkbox, Spin, Table } from 'antd';
import './AllResults.scss';
import { DisplayRoundResult, RoundResult } from '../../Utils/Types';
import { useEffect, useState } from 'react';
import { getRequest } from '../../Utils/Api';
import { useNavigate } from 'react-router-dom';
import AggregateResultGraphs from './AggregateResultGraphs';
import GolfBall from '../../ReusableComponents/GolfBall';
import { Solver, solverNames } from '../../Utils/Simulation';
import { RoundNames } from '../../Utils/Utils';

// AllResults
// Only show for tournament stage results (not professional only or h_arch)
const AllResults = () => {

    const navigate = useNavigate();
    const [allResults, setAllResults] = useState<RoundResult[]>([]);
    const [filteredResults, setFilteredResults] = useState<RoundResult[]>([]);

    // Pull results of all players from BE from DB on mount of component
    useEffect(() => {
        window.scrollTo(0, 0);
        const pullAllPlayerResults = async () => {
            try {
                const response = await getRequest('player/allResults');
                // Shouldn't need to filter any values missing shots, score, etc (as they shouldn't be in the DB)
                setAllResults(response.results);
                setFilteredResults(response.results);
            } catch (error) {
                console.error("Error fetching all player results: ", error);
            }
        }
        pullAllPlayerResults();
    }, []);


    // Arrays for Checkboxes
    const architectureNames = [
        {
            label: 'h: Entire Hole',
            value: 'h'
        },
        {
            label: 'lp: Long and Putt',
            value: 'lp'
        },
        {
            label: 'ds: Drive and Short',
            value: 'ds'
        },
        {
            label: 'dap: Drive, Fairway, and Putt',
            value: 'dap'
        }
    ];

    const tournamentStageNames = [
        {
            label: '1: Minimize Shots',
            value: '1'
        },
        {
            label: '2: Minimize Cost',
            value: '2'
        },
        {
            label: '3: Minimize Both',
            value: '3'
        },
        {
            label: '4: Custom Weighting',
            value: '4'
        }
    ]

    const [selectedArchitecture, setSelectedArchitecture] =
        useState<string[]>(['h', 'lp', 'ds', 'dap']);
    const [selectedRound, setSelectedRound] =
        useState<string[]>(['1', '2', '3', '4']);


    // When user changes what architecture and rounds they want to see, re-filter the results
    useEffect(() => {
        setFilteredResults(allResults.filter((result) => {
            return selectedArchitecture.includes(result.architecture) &&
                selectedRound.includes((result.round - RoundNames.TournamentStage1 + 1).toString());
        }));
    }, [selectedArchitecture, selectedRound, allResults]);




    // table columns and data
    const tableColumns = [
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            defaultSortOrder: 'descend' as any,
            sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                const scoreA = Number(a.score? a.score.score : '');
                const scoreB = Number(b.score ? b.score.score : '');
                if (isNaN(scoreA) && !isNaN(scoreB)) {
                    return -1;
                } else if (!isNaN(scoreA) && isNaN(scoreB)) {
                    return 1;
                } else if (isNaN(scoreA) && isNaN(scoreB)) {
                    return 0;
                } else {
                    return scoreA - scoreB;
                }
            },
            render: (result: {score: number, customPerformanceWeight: number | undefined}) => {
                if (result.customPerformanceWeight) {
                    // if shots are over the maximum acceptable shots for round 7, add message
                    return (
                        <div className="ScoreWithCustomWeight">
                            <p>{result.score}</p>
                            <p>{result.customPerformanceWeight}% Shots</p>
                            <p>{100 - result.customPerformanceWeight}% Cost</p>
                        </div>
                    )
                } else {
                    return result.score;
                }
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Golf Ball',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => <GolfBall color={color} ></GolfBall>
        },
        {
            title: 'Shots',
            dataIndex: 'shots',
            key: 'shots',
            sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                const shotsA = Number(a.shots);
                const shotsB = Number(b.shots);
                if (isNaN(shotsA) && !isNaN(shotsB)) {
                    return 1;
                } else if (!isNaN(shotsA) && isNaN(shotsB)) {
                    return -1;
                } else if (isNaN(shotsA) && isNaN(shotsB)) {
                    return 0;
                } else {
                    return shotsA - shotsB;
                }
            }
        },
        {
            title: 'Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: DisplayRoundResult, b: DisplayRoundResult) => {
                const costA = Number(a.cost);
                const costB = Number(b.cost);
                if (isNaN(costA) && !isNaN(costB)) {
                    return 1;
                } else if (!isNaN(costA) && isNaN(costB)) {
                    return -1;
                } else if (isNaN(costA) && isNaN(costB)) {
                    return 0;
                } else {
                    return costA - costB;
                }
            }
        },
        {
            title: 'Round',
            dataIndex: 'round',
            key: 'round',
        },
        {
            title: 'Architecture',
            dataIndex: 'architecture',
            key: 'architecture',
        },
        {
            title: 'Solvers',
            key: 'solvers',
            dataIndex: 'solvers',
            render: (solvers: [Solver]) => (
                solvers.length > 0 ?
                    <div className="SolversHolder">
                        {
                            solvers.map((solver) => (
                                <p
                                    style={{ margin: '0px 0px 4px 0px' }}
                                >{solverNames[solver - 1]}</p>
                            ))
                        }
                    </div>
                    :
                    <div>
                        waiting ...
                    </div>
            ),
        }
    ];

    const tableData: DisplayRoundResult[] = filteredResults.map((player: RoundResult, index: number) => {
        console.log("See if I got cpw: ", player.customPerformanceWeight);
        return {
            key: player.id,
            score: {score: player.score / 100, customPerformanceWeight: player.round === RoundNames.TournamentStage4 
                ? player.customPerformanceWeight : undefined
            },
            name: player.name,
            color: player.color,
            shots: player.shots,
            cost: player.cost / 100,
            round: player.round - RoundNames.TournamentStage1 + 1,
            architecture: player.architecture,
            solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver),
        }
    });


    return (
        <div className='AllResults'>
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
            <div className='Instructions'>
                <h1>All Results</h1>
                <h2>Display Data For: </h2>
                <div className='ArchitectureAndRound'>
                    <div className='TitleAndSelect'>
                        <h3>Architecture: </h3>
                        <Checkbox.Group
                            className={'ResultCheckbox'}
                            options={architectureNames}
                            value={selectedArchitecture}
                            onChange={(checkedValues) => { setSelectedArchitecture(checkedValues) }}
                        />
                    </div>
                    <div className='TitleAndSelect'>
                        <h3>Tournament Stage: </h3>
                        <Checkbox.Group
                            className={'ResultCheckbox'}
                            options={tournamentStageNames}
                            value={selectedRound}
                            onChange={(checkedValues) => { setSelectedRound(checkedValues) }}
                        />
                    </div>

                </div>
                <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>

            {
                filteredResults.length === 0 ?
                    <div className='Instructions'>
                        <h1>Loading Results ...</h1>
                        <Spin size='large' />
                    </div>
                    :
                    <>
                        <div className='ResultTable'>
                            <Table
                                pagination={{ 
                                    position: ['bottomCenter'],
                                    showSizeChanger: true,
                                    defaultPageSize: 10,
                                }}
                                columns={tableColumns}
                                dataSource={tableData}
                                rowClassName={() => "HighlightRow"}
                                rowKey={(record) => record.key + "-" + record.round}
                            />
                        </div>

                        {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
                        <AggregateResultGraphs
                            results={filteredResults}
                        />
                    </>
            }
            <br></br>
        </div>
    )
}

export default AllResults;