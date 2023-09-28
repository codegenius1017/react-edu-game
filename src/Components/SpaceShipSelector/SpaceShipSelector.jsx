import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { Arrow } from "../Arrow/Arrow";
import { SpaceShipVisualizer } from "../SpaceShipVisualizer/SpaceShipVisualizer";

export const SpaceShipSelector = () => {
  const { gameState, gameDispatch } = useContext(GameContext);

  const handleClick = (direction) => {
    let id = gameState.spaceShipId;

    direction === "right" ? id++ : id--;

    gameDispatch({ type: "CHANGE_SPACESHIP", payload: id });
  }

  return (
    <div>
      <Arrow onClick={handleClick} direction={"left"}/>
      <SpaceShipVisualizer spaceShipId={gameState.spaceShipId} />
      <Arrow onClick={handleClick} direction={"right"}/>
    </div>
  )
};