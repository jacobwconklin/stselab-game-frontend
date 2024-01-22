import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import DemographicForm from './Pages/DemographicForm';

// Router
const Router = () => {

    return (
        <div className='Router full-size'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="demo" element={<DemographicForm />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;