import style from './InitialMenuScene.module.scss';
import { SpaceShipSelector } from "../../Components/SpaceShipSelector/SpaceShipSelector";
import { MainScene } from '../MainScene/MainScene';
import { GameContext } from '../../contexts/GameContext';
import { useContext, useEffect, useState } from 'react';

export const InitialMenuScene = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [renderMenu, setRenderMenu] = useState(gameState.initial);

  const handleClick = () => {
    gameDispatch({ type: "ON" });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderMenu(gameState.initial);
    }, gameState.initial ? 0 : 2000);

    return () => clearTimeout(timeout);
  }, [gameState.initial]);

  return (
    <div className={`${style['container']}`}>
      {
        renderMenu ?
          <div className={`${style['menu-screen']}`} style={{ top: gameState.initial ? 0 : "-100vh" }}>
            <h1 className={`${style['title']}`}>SPACE WARRIOR</h1>
            <SpaceShipSelector />
            <div style={{ width: "100%", textAlign: "center", paddingBottom: 16 }}>
              <button className={`${style['start-button']}`} onClick={handleClick} >GO GO GO!</button>
            </div>
            <footer style={{ position: "absolute", bottom: 0 }}>
              <div>
                &copy; copyrigths -- feito por Priscila T. 2023
              </div>
            </footer>
          </div>
          : undefined
      }
      <MainScene />
    </div>
  )
}
