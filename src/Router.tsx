import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import './Router.scss';
import Register from './Pages/Register/Register';
import GameController from './Pages/GameController/GameController';
import AllResults from './Pages/AggregateResults/AllResults';
import ArmGameScreen from './Pages/MechanicalArm/ArmGameScreen';
import ArmExperiment from './Pages/MechanicalArm/ArmExperiment/ArmExperiment';
import GameSimulator from './Pages/MechanicalArm/GameSimulator';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="register/:playerType?/:joinCodeUrl?" element={<Register />} />
                <Route path="results" element={<AllResults />} />
                <Route path="game" element={<GameController />} />
                <Route path="arm" element={<GameSimulator />} />
                <Route path="armExp" element={<ArmExperiment advanceRound={() => {}} />} />
                <Route path="armGame" element={<ArmGameScreen 
                            finishedRounds={[false]} 
                            setFinishedRound={(val: Array<Boolean>) => {}} 
                            round={0} />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;