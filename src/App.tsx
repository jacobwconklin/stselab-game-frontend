import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Router from './Router';
import NavHeader from './Navigation/NavHeader';
import { useState, createContext } from 'react';
import { UserContextType } from './Utils/Types';

function App() {

  // Context will hold this information to be accessible from anywhere in the App
  const [isHost, setIsHost] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<string | null>(null);
  const [customPerformanceWeight, setCustomPerformanceWeight] = useState<number | null>(null);

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
          value={{
            isHost, setIsHost,
            sessionId, setSessionId,
            playerId, setPlayerId,
            playerColor, setPlayerColor,
            customPerformanceWeight, setCustomPerformanceWeight
          }}
        >
          <Router />
          <NavHeader />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}



export const UserContext = createContext<UserContextType>({
  isHost: false,
  setIsHost: (isHost: boolean) => { },
  sessionId: null,
  setSessionId: (id: number) => { },
  playerId: null,
  setPlayerId: (id: string) => { },
  playerColor: null,
  setPlayerColor: (id: string) => { },
  customPerformanceWeight: null,
  setCustomPerformanceWeight: (id: number) => { },
});

export default App;
