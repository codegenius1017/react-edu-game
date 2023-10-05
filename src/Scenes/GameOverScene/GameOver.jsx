import { useContext, useEffect } from "react";
import style from "./GameOver.module.scss"
import { GameContext } from "../../contexts/GameContext";

export const GameOver = () => {
  const { gameState, gameDispatch } = useContext(GameContext);

  useEffect(() => {
    const menuFunc = (e) => {
      if (e.key === "Enter") gameDispatch({ type: "RESTART" });
    };

    window.addEventListener("keydown", menuFunc);

    return () => window.removeEventListener("keydown", menuFunc);
  }, [gameDispatch]);

  return (
    <div className={`${style['container']}`}>
      <div className={`${style['main']}`}>
        <h1 className={`${style['game-over-text']}`}>Game Over</h1>
        <p className={`${style['score-text']}`}>Your Score: {gameState.points}</p>
        <p className={`${style['info-text']}`}>Press "Enter" to go to menu</p>
      </div>
    </div>
  )
};
