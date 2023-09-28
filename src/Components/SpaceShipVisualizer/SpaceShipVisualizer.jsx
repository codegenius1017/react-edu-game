import { spaceships } from "../../gameAssets/spaceshipsData/spaceships";
import style from "./SpaceShipVisualizer.module.scss";


export const SpaceShipVisualizer = ({ spaceShipId }) => {
  const spaceShipDetails = spaceships[spaceShipId];
  return (
    <div className={`${style.container}`}>
      <div className={`${style.main}`}>
        <img className={`${style['space-ship-image']}`} src={spaceShipDetails.imageSrc} alt="nave espacial" />
        <h2 className={`${style['space-ship-title']}`} >{spaceShipDetails.name}</h2>
        <p className={`${style['space-ship-description']}`} >{spaceShipDetails.description}</p>
      </div>
    </div>
  );
}