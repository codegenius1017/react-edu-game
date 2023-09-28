import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";

export const InitialMenuScene = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  return (
    <div></div>
  )
}