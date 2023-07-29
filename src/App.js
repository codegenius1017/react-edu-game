import logo from './logo.svg';
import './App.css';
import { MainScene } from './Scenes/MainScene';
import { GameProvider } from './contexts/index';

function App() {
  return (
    <div className="App">
      <GameProvider>
        <MainScene />
      </GameProvider>
    </div>
  );
}

export default App;
