import style from './InitialMenuScene.module.scss';
import { SpaceShipSelector } from "../../Components/SpaceShipSelector/SpaceShipSelector";
import { useState } from 'react';
import { MainScene } from '../MainScene/MainScene';

export const InitialMenuScene = () => {
  const [iniciate, setIniciate] = useState(true);

  const handleClick = () => {
    setIniciate(false);
  }

  return (
    <div className={`${style['container']}`}>
      {
        iniciate ?
          <>
            <h1 className={`${style['title']}`}>SPACE WARRIOR</h1>
            <SpaceShipSelector />
            <div style={{ width: "100%", textAlign: "center", paddingBottom: 16 }}>
              <button className={`${style['start-button']}`} onClick={handleClick} >GO GO GO!</button>
            </div>
            <footer>
              <div>
                &copy; copyrigths -- feito por Priscila T. 2023
              </div>
            </footer>
          </>
          : <MainScene />
      }
    </div>
  )
}