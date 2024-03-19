import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import './Router.scss';
import Register from './Pages/Register/Register';
import GameController from './Pages/GameController/GameController';
import AllResults from './Pages/AggregateResults/AllResults';
import ArmGameScreen from './Pages/MechanicalArm/ArmGameScreen';
import ArmExperiment from './Pages/MechanicalArm/ArmExperiment/ArmExperiment';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <div className='StaticBackground'>
                <div className='StaticBackgroundImages'></div>
            </div>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="register/:playerType?/:joinCodeUrl?" element={<Register />} />
                <Route path="results" element={<AllResults />} />
                <Route path="game" element={<GameController />} />
                <Route path="armE" element={<ArmExperiment />} />
                <Route path="arm" element={<ArmGameScreen />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;