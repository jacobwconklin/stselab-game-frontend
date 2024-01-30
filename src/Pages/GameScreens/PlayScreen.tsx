import { Button } from 'antd';
import './PlayScreen.scss';

// PlayScreen
const PlayScreen = (props: any) => {

    return (
        <div className='PlayScreen'>
            <div className='Background'>
                <h1>Play Golf! Round #{props.round}</h1>
                <div className='Solvers'>
                    <div className='SolverCard'>
                        <h2>Professional</h2>
                        <p>All around top notch athlete. Has trained their whole life for this moment</p>
                        <p>Quantity: 1</p>
                        <Button>Select</Button>
                    </div>
                    <div className='SolverCard'>
                        <h2>Specialists</h2>
                        <p>Incredibly long range drives, otherwise on par with Amatuers. Essentially Happy Gilmore.</p>
                        <p>Quantity: 3</p>
                        <Button>Select</Button>
                    </div>
                    <div className='SolverCard'>
                        <h2>Amateurs</h2>
                        <p>Just looking to have some fun and do their best. Their mothers are so proud.</p>
                        <p>Quantity: 100</p>
                        <Button>Select</Button>
                    </div>
                </div>
                <Button onClick={() => {props.setFinishedRound(true)}}>Finish round</Button> {/* TODO remove this */}
            </div>
        </div>
    )
}

export default PlayScreen;