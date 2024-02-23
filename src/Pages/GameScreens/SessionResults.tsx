import { Button, Table } from 'antd';
import './SessionResults.scss';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../App';
import GolfBall from '../../ReusableComponents/GolfBall';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

// SessionResults
// TODO only show for tournament stage results (not professional only or h_arch)
const SessionResults = (props: any) => {

    const navigate = useNavigate();
    const { playerId } = useContext(UserContext) as any;

    const sumShots = (scores: any[]) => {
        let total = 0;
        scores.forEach((score: any) => {
            total += score.shots;
        });
        return total;
    }

    const sumCost = (scores: any[]) => {
        let total = 0;
        scores.forEach((score: any) => {
            total += score.cost;
        });
        return total / 100;
    }

    const sumScore = (scores: any[]) => {
        let total = 0;
        scores.forEach((score: any) => {
            total += score.score;
        });
        return total / 100;
    }

    // chart options and data
    // for all rounds separately
    // chart options and data
    const shotsCostOptions = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Shots and Costs of all Tournament Rounds`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Shots'
                }
            },
            x: {
                beginAtZero: true,
                reverse: true,
                title: {
                    display: true,
                    text: 'Cost'
                }
            },
        },
        elements: {
            point: {
                radius: 10,
                // pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 20
        },
    };

    const shotsCostData = {
        datasets: props?.players?.map((result: any) => {
            return {
                label: result.name,
                data: result.scores.map((round: any) => {
                    return {
                        x: round.cost / 100,
                        y: round.shots
                    }
                }),
                backgroundColor: result.color,
            }
        })
    };

    // chart options and data
    // for all rounds separately
    // chart options and data
    const scoreRoundOptions = {
        animation: {
            duration: 0, // general animation time
        },
        plugins: {
            title: {
                display: true,
                text: `Score per Player by Round`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            },
            x: {
                beginAtZero: true,
                max: 5,
                title: {
                    display: true,
                    text: 'Tournament Round'
                }
            },
        },
        elements: {
            point: {
                radius: 10,
                // pointStyle: golfBallImage,
            }
        },
        layout: {
            padding: 20
        },
    };

    const scoreRoundData = {
        datasets: props?.players?.map((result: any) => {
            return {
                label: result.name,
                data: result.scores.map((round: any) => {
                    return {
                        x: round.round - 5,
                        y: round.score / 100
                    }
                }),
                backgroundColor: result.color,
            }
        })
    };

    // set up chart js
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

    // table columns and data
    const tableColumns = [
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
            title: 'Total Shots',
            dataIndex: 'shots',
            key: 'shots',
            sorter: (a: any, b: any) => {
                if (a.shots === '...' && !(b.shots === '...')) {
                    return 1;
                } else if (!(a.shots === '...') && b.shots === '...') {
                    return -1;
                } else if (a.shots === '...' && b.shots === '...') {
                    return 0;
                } else {
                    return a.shots - b.shots
                }
            }
        },
        {
            title: 'Total Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: any, b: any) => {
                if (a.cost === '...' && !(b.cost === '...')) {
                    return 1;
                } else if (!(a.cost === '...') && b.cost === '...') {
                    return -1;
                } else if (a.cost === '...' && b.cost === '...') {
                    return 0;
                } else {
                    return a.cost - b.cost
                }
            }
        },
        {
            title: 'Total Score',
            dataIndex: 'score',
            key: 'score',
            defaultSortOrder: 'descend' as any,
            sorter: (a: any, b: any) => {
                if (a.score === '...' && !(b.score === '...')) {
                    return -1;
                } else if (!(a.score === '...') && b.score === '...') {
                    return 1;
                } else if (a.score === '...' && b.score === '...') {
                    return 0;
                } else {
                    return a.score - b.score
                }
            }
        }
    ];

    const tableData = props?.players?.map((player: any, index: number) => (
            {
                key: player.id,
                name: player.name,
                color: player.color,
                shots: sumShots(player.scores),
                cost: sumCost(player.scores),
                score: sumScore(player.scores),
            }
        ))

    return (
        <div className='SessionResults'>
            <h1>Final Results </h1>

            <div className='ResultTable'>
                <Table
                    pagination={{ pageSize: 10, position: ['none', props.players.length > 10 ? 'bottomCenter' : "none"] }}
                    columns={tableColumns}
                    dataSource={tableData}
                    rowClassName={(record, index) => {
                        if (record.key.toLowerCase() === playerId.toLowerCase()) {
                            return 'MatchingPlayer';
                        } else {
                            return 'HighlightRow'
                        }
                    }}
                />
            </div>

            {/* Initial data visualizations through https://www.chartjs.org/docs/latest/charts/scatter.html */}
            <Scatter className='ScatterCanvas' options={shotsCostOptions} data={shotsCostData} />
            <Scatter className='ScatterCanvas' options={scoreRoundOptions} data={scoreRoundData} />

            <h1>Thanks for playing!</h1>
            <div className='EndTournamentButtons'>
                <Button onClick={() => navigate('/')}>Return Home</Button>
                <Button onClick={() => alert("Not implemented yet")}>View Lifetime Results</Button>
                <Button onClick={() => alert("Not implemented yet")}>Save Results</Button>
            </div>
            <br></br>
        </div>
    )
}

export default SessionResults;