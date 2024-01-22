import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Router from './Router';
import NavHeader from './Navigation/NavHeader';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Router />
        <NavHeader />
      </BrowserRouter>
    </div>
  );
}

export default App;
