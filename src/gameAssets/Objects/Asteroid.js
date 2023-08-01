import { AsteroidSprite } from './Sprites';
import asteroid1 from '../images/asteroids/asteroi-1.png';
import asteroid2 from '../images/asteroids/asteroid-2.png';
import meteor from '../images/asteroids/meteor-1.png';

const asteroidsTypes = [
  {
    image: asteroid1,
    // imageSrc: "./images/asteroids/asteroi-1.png",
    imageSrc: "https://art.pixilart.com/5616214e1061d21.png",
    vel: 1,
    damage: 1,
    size: 50,
    health: 2,
  },
  {
    image: asteroid2,
    imageSrc: "./images/asteroids/asteroid-2.png",
    // imageSrc: "https://art.pixilart.com/5616214e1061d21.png",
    vel: 0.7,
    damage: 2,
    size: 65,
    health: 4,
  },
  {
    image: meteor,
    imageSrc: "./images/asteroids/meteor-1.png",
    // imageSrc: "https://art.pixilart.com/5616214e1061d21.png",
    vel: 3,
    damage: 0.5,
    size: 35,
    health: 1,
  },
];

export const createAteroid = (gameScreenWidth) => {
  const randomType = Math.round(asteroidsTypes.length * Math.random());
  const aster = { ...asteroidsTypes[randomType] };

  const image = new Image(aster.size, aster.size);
  image.src = aster.imageSrc;

  const Asteroid = new AsteroidSprite({
    position: { y: 0, x: Math.round(Math.random() * gameScreenWidth) },
    width: aster.size,
    height: aster.size,
    img: image,
    ...aster,
  });

  console.log(Asteroid);
  return Asteroid;
};
