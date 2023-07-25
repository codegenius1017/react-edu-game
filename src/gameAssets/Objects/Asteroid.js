import { Sprite } from './Sprite';
import asteroid1 from '../images/asteroids/asteroi-1.png';
import asteroid2 from '../images/asteroids/asteroid-2.png';
import meteor from '../images/asteroids/meteor-1.png';

const asteroidsTypes = [
  {
    image: asteroid1,
    vel: 1,
    damage: 1,
  },
  {
    image: asteroid2,
    vel: 0.7,
    damage: 2,
  },
  {
    image: meteor,
    vel: 3,
    damage: 0.5,
  },
];

export const Asteroid = new Sprite({ y: 0, x: 0 });

export const createAteroid = (gameScreenWidth) => {
  const randomType = Math.round(asteroidsTypes.length * Math.random());
  const aster = { ...Asteroid, ...asteroidsTypes[randomType] };

  aster.position.x = Math.round(Math.random() * gameScreenWidth);

  return aster;
};
