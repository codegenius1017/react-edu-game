import { AsteroidSprite } from './Sprites';

const asteroidsTypes = [
  {
    imageSrc: "./images/asteroids/asteroi-1.png",
    vel: 1,
    damage: 1,
    size: 60,
    health: 2,
  },
  {
    imageSrc: "./images/asteroids/asteroid-2.png",
    vel: 0.5,
    damage: 2,
    size: 100,
    health: 4,
  },
  {
    imageSrc: "./images/asteroids/meteor-1.png",
    vel: 1.7,
    damage: 0.5,
    size: 50,
    health: 1,
  },
];

export const createAteroid = ({ gameScreenWidth, gameScreenHeight, cbFalling = () => {}, cbEndFall = () => {}, canvasCtx }) => {
  const randomType = Math.floor(asteroidsTypes.length * Math.random());
  const aster = { ...asteroidsTypes[randomType] } || { ...asteroidsTypes[0] };

  const Asteroid = new AsteroidSprite({
    position: { y: 0, x: Math.floor(Math.random() * (gameScreenWidth - aster.size)) },
    width: aster.size,
    height: aster.size,
    ...aster,
    gameScreenWidth,
    gameScreenHeight,
    cbFalling,
    cbEndFall,
    canvasCtx
  });

  return Asteroid;
};
