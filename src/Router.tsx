import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Results from './Pages/Results/Results';
import './Router.scss';
import Register from './Pages/Register/Register';
import Session from './Pages/Session/Session';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="register/:playerType?" element={<Register />} />
                <Route path="results" element={<Results />} />
                <Route path="session" element={<Session />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;