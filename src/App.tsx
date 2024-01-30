import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Router from './Router';
import NavHeader from './Navigation/NavHeader';
import { useState, createContext } from 'react';

function App() {

  // Context will hold this information to be accessible from anywhere in the App
  const [isHost, setIsHost] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);

  return (
    <div className="App">
      <BrowserRouter>
      <UserContext.Provider
          value={{isHost, setIsHost, sessionId, setSessionId, playerId, setPlayerId}}
        >
          <Router />
          <NavHeader />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}



export const UserContext = createContext<any>({
  isHost: false, 
  setIsHost: (isHost: boolean) => {},
  sessionId: null, 
  setSessionId: (id: number) => {},
  playerId: null, 
  setPlayerId: (id: number) => {},
});

export default App;
