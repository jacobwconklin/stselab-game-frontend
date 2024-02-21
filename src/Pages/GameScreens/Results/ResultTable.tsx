import { Table } from "antd";
import GolfBall from "../../../ReusableComponents/GolfBall";
import { Solver, solverNames } from "../../../Utils/Simulation";
import { RoundResult } from "../../../Utils/Types";
import { getArchitectureCommonName } from "../../../Utils/Utils";


// Creates a table to display results for a round or session
const ResultTable = (props: { players: Array<RoundResult>, playerId: string }) => {

    // Want name, golf ball, shots, cost, solvers, architecture
    const columns = [
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
            defaultSortOrder: 'ascend' as any,
            sorter: (a: any, b: any) => {
                if (a.shots && !b.shots) {
                    return -1;
                } else if (!a.shots && b.shots) {
                    return 1;
                } else if (!a.shots && !b.shots) {
                    return 0;
                } else {
                    return a.shots - b.shots
                }
            }
        },
        {
            title: 'Cost',
            key: 'cost',
            dataIndex: 'cost',
            sorter: (a: any, b: any) => a.cost - b.cost
        },
        {
            title: 'Solvers',
            key: 'solvers',
            dataIndex: 'solvers',
            render: (solvers: [Solver]) => (
                <div className="SolversHolder">
                    {
                        solvers.map((solver) => (
                            <p
                                style={{ margin: '0px 0px 4px 0px' }}
                            >{solverNames[solver - 1]}</p>
                        ))
                    }
                </div>
            ),
        },
        {
            title: 'Architecture',
            dataIndex: 'architecture',
            key: 'architecture',
        }
    ];

    /*
    Example
    [
      {
          key: '1',
          name: 'John Brown',
          color: '#123456',
          shots: 32,
          cost: 100,
          solvers: [Solver.Professional, Solver.Specialist],
          architecture: 'Long and Putt'
      },
    ];
    */
    const data = props?.players?.map((player, index) => (
        {
            key: index,
            name: player.name,
            color: player.color,
            shots: player.shots,
            cost: player.cost,
            solvers: [player.solverOne, player.solverTwo, player.solverThree].filter((solver) => !!solver),
            architecture: getArchitectureCommonName(player.architecture)
        }
    ))

    return (
        <div className="ResultTable">
            <Table columns={columns} dataSource={data} />
        </div>
    )
}

export default ResultTable;