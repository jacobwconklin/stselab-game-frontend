import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Results from './Pages/Results/Results';
import './Router.scss';
import Register from './Pages/Register/Register';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="register" element={<Register />} />
                <Route path="results" element={<Results />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;