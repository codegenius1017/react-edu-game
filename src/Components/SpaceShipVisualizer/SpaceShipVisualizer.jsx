import style from "./SpaceShipVisualizer.module.scss";
import { spaceships } from "../../gameAssets/Objects/spaceshipsData/spaceships";

export const SpaceShipVisualizer = ({ spaceShipId }) => {
  const spaceShipDetails = spaceships[spaceShipId];
  return (
    <div className={`${style.container}`}>
      <div className={`${style.main}`}>
        <div className={`${style['space-ship-image-container']}`}>
          <img className={`${style['space-ship-image']}`} src={spaceShipDetails.imageSrc} alt="nave espacial" />
        </div>
        <h2 className={`${style['space-ship-title']}`} >{spaceShipDetails.name}</h2>
        <p className={`${style['space-ship-description']}`} >{spaceShipDetails.description}</p>
      </div>
    </div>
  );
}