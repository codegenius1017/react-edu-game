import { cloneDeep } from 'lodash';
import { AsteroidSprite } from './Sprites';
import { asteroidsTypes } from './asteroidData/asteroidsTypes';

export const createAsteroid = ({
  gameScreenWidth,
  gameScreenHeight,
  idsAsteroids
}) => {
  const randomType = Math.floor(idsAsteroids.length * Math.random());
  const asteroidData = asteroidsTypes.find(asteroid => asteroid.id === idsAsteroids[randomType]) || asteroidsTypes[0];

  const Asteroid = new AsteroidSprite({
    position: {
      y: 0,
      x: Math.floor(Math.random() * (gameScreenWidth - asteroidData.size)),
    },
    finalCordinates: { y: gameScreenHeight },
    width: asteroidData.size,
    height: asteroidData.size,
    ...asteroidData,
    gameScreenWidth,
    gameScreenHeight,
  });

  return Asteroid;
};

export const copyAsteroid = (asteroid) => {
  const Asteroid = new AsteroidSprite(cloneDeep(asteroid));

  return Asteroid;
};
