import { AsteroidSprite } from './Sprites';

const asteroidsTypes = [
  {
    imageSrc: './space-warrior/images/asteroids/asteroi-1.png',
    vel: 1,
    damage: 1,
    size: 60,
    health: 2,
  },
  {
    imageSrc: './space-warrior/images/asteroids/asteroid-2.png',
    vel: 0.5,
    damage: 2,
    size: 100,
    health: 4,
  },
  {
    imageSrc: './space-warrior/images/asteroids/meteor-1.png',
    vel: 1.7,
    damage: 0.5,
    size: 50,
    health: 1,
  },
];

export const createAsteroid = ({
  gameScreenWidth,
  gameScreenHeight,
  cbFalling = () => {},
  cbEndFall = () => {},
}) => {
  const randomType = Math.floor(asteroidsTypes.length * Math.random());
  const aster = { ...asteroidsTypes[randomType] } || { ...asteroidsTypes[0] };

  const Asteroid = new AsteroidSprite({
    position: {
      y: 0,
      x: Math.floor(Math.random() * (gameScreenWidth - aster.size)),
    },
    finalCordinates: { y: gameScreenHeight },
    width: aster.size,
    height: aster.size,
    ...aster,
    gameScreenWidth,
    gameScreenHeight,
    cbFalling,
    cbEndFall,
  });

  return Asteroid;
};

export const copyAsteroid = (asteroid) => {
  const Asteroid = new AsteroidSprite({
    ...asteroid,
  });

  return Asteroid;
};
