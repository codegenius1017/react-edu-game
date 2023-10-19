import { spaceships } from "./spaceshipsData/spaceships";
import { SpaceShipSprite } from "./Sprites";

export const createSpaceShip = ({
  props = {},
  canvasWidth = 1000,
  canvasHeight = 1000,
  id = 0,
}) => {
  const spaceShipType = spaceships[id];
  const spaceShip = new SpaceShipSprite({
    ...spaceShipType,
    position: {
      x: canvasWidth / 2 - (props.size || 20) / 2,
      y: canvasHeight / 2 + (props.size || 20),
    },
    width: spaceShipType.width || 10,
    height: spaceShipType.height || 10,
    maxPositions: { x: canvasWidth, y: canvasHeight },
    ...props,
  });

  return spaceShip;
};
