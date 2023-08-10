import { SpaceShipSprite } from './Sprites';

export const createSpaceShip = ({ props = {}, canvasWidth, canvasHeight }) => {
  const spaceShip = new SpaceShipSprite({
    damage: 1,
    position: { x: 100, y: 100 },
    width: props.size || 20,
    height: props.size || 20,
    imageSrc: "./images/spaceshipsSkins/nave2.gif",
    ...props,
  });

  return spaceShip;
};
