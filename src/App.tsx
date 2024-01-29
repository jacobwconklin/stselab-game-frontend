import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Router from './Router';
import NavHeader from './Navigation/NavHeader';
import { useState, createContext } from 'react';

function App() {

  // Context will hold this information to be accessible from anywhere in the App
  const [isHost, setIsHost] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
      <UserContext.Provider
          value={{isHost, setIsHost}}
        >
          <Router />
          <NavHeader />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}



export const UserContext = createContext<any>({isHost: false, setIsHost: (isHost: boolean) => {}});

export default App;
