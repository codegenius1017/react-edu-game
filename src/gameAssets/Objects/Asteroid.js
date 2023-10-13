import { cloneDeep } from 'lodash';
import { AsteroidSprite } from './Sprites';

const asteroidsTypes = [
  {
    id: 1,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroi-1.png`,
    vel: 1,
    damage: 1,
    size: 60,
    health: 2,
  },
  {
    id: 2,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-2.png`,
    vel: 0.5,
    damage: 2,
    size: 100,
    health: 4,
  },
  {
    id: 3,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/meteor-1.png`,
    vel: 1.7,
    damage: 0.5,
    size: 50,
    health: 1,
  },
  {
    id: 4,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-4.png`,
    vel: 1.5,
    damage: 1.5,
    size: 35,
    health: 2,
    type: "ZIGZAG"
  },
  {
    id: 5,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-5.png`,
    vel: 1.2,
    damage: 1,
    size: 30,
    health: 1,
    type: "GANG",
    quant: 3
  },
  {
    id: 6,
    imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-6.png`,
    vel: 1,
    damage: 1,
    size: 35,
    health: 1,
    type: "GANG",
    quant: 5
  },
];

export const createAsteroid = ({
  gameScreenWidth,
  gameScreenHeight,
  idsAsteroids
}) => {
  const randomType = Math.floor(idsAsteroids.length * Math.random());
  const idAsteroid = idsAsteroids.find(asteroid => asteroid.id === idsAsteroids[randomType]);
  const aster = { ...asteroidsTypes[idAsteroid] } || { ...asteroidsTypes[0] };

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
  });

  return Asteroid;
};

export const copyAsteroid = (asteroid) => {
  const Asteroid = new AsteroidSprite(cloneDeep(asteroid));

  return Asteroid;
};
