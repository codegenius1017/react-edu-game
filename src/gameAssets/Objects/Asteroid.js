import { AsteroidSprite, Sprite } from './Sprites';
import asteroid1 from '../images/asteroids/asteroi-1.png';
import asteroid2 from '../images/asteroids/asteroid-2.png';
import meteor from '../images/asteroids/meteor-1.png';

const asteroidsTypes = [
  {
    image: asteroid1,
    vel: 1,
    damage: 1,
    size: 50,
    health: 2,
  },
  {
    image: asteroid2,
    vel: 0.7,
    damage: 2,
    size: 65,
    health: 4,
  },
  {
    image: meteor,
    vel: 3,
    damage: 0.5,
    size: 35,
    health: 1,
  },
];

export const createAteroid = (gameScreenWidth) => {
  const randomType = Math.round(asteroidsTypes.length * Math.random());
  const aster = { ...asteroidsTypes[randomType] };
  const Asteroid = new AsteroidSprite({
    position: { y: 0, x: Math.round(Math.random() * gameScreenWidth) },
    imageSrc: aster.image,
    width: aster.size,
    height: aster.size,
    ...aster,
  });

  return Asteroid;
};
