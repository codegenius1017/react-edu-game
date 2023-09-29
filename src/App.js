import './App.css';
import { GameProvider } from './contexts/index';
import { InitialMenuScene } from './Scenes/InitialMenuScene/InitialMenuScene';

function App() {
  return (
    <div className="App">
      <GameProvider>
        <InitialMenuScene />
      </GameProvider>
    </div>
  );
}

export default App;
