import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { Arrow } from "../Arrow/Arrow";
import { SpaceShipVisualizer } from "../SpaceShipVisualizer/SpaceShipVisualizer";
import style from './SpaceShipSelector.module.scss';

export const SpaceShipSelector = () => {
  const { gameState, gameDispatch } = useContext(GameContext);

  const handleClick = (direction) => {
    let id = gameState.spaceShipId;

    direction === "right" ? id++ : id--;

    gameDispatch({ type: "CHANGE_SPACESHIP", payload: id });
  }

  return (
    <div className={`${style.main}`}>
      <Arrow onClick={handleClick} direction={"left"} style={{height: 60 }}/>
      <SpaceShipVisualizer spaceShipId={gameState.spaceShipId} />
      <Arrow onClick={handleClick} direction={"right"} style={{height: 60 }}/>
    </div>
  )
};
