import { SpaceShipSprite } from './Sprites';

export const createSpaceShip = ({ props = {}, canvasWidth = 1000, canvasHeight = 1000 }) => {
  const spaceShip = new SpaceShipSprite({
    damage: 1,
    position: { x: canvasWidth / 2 - (props.size || 20) / 2, y: canvasHeight / 2 + (props.size || 20) },
    width: props.size || 10,
    height: props.size || 10,
    imageSrc: "./images/spaceshipsSkins/nave2.gif",
    ...props,
  });

  return spaceShip;
};
