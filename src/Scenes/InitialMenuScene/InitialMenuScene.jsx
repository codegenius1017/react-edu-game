import style from './InitialMenuScene.module.scss';
import { SpaceShipSelector } from "../../Components/SpaceShipSelector/SpaceShipSelector";

export const InitialMenuScene = () => {

  return (
    <div className={`${style['container']}`}>
      <h1 className={`${style['title']}`}>SPACE WARRIOR</h1>
      <SpaceShipSelector />
      <button className={`${style['start-button']}`} >GO GO GO!</button>
      <footer>
        <div>
          &copy; copyrigths -- feito por Priscila T. 2023
        </div>
      </footer>
    </div>
  )
}