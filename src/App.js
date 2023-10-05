import './App.css';
import { InitialMenuScene } from './Scenes/InitialMenuScene/InitialMenuScene';
import { useContext } from "react";
import { GameContext } from "./contexts/GameContext";
import { GameOver } from "./Scenes/GameOverScene/GameOver";

function App() {
  const { gameState } = useContext(GameContext);

  return (
    <div className="App">
      {gameState.gameOver ?
        <GameOver />
        :
        <InitialMenuScene />
      }
    </div>
  );
}

export default App;
