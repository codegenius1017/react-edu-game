import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Canvas from '../Components/Canvas';
import { GameContext } from '../contexts/GameContext';
import { createAteroid } from '../gameAssets/Objects/Asteroid';
import { createSpaceShip } from '../gameAssets/Objects/SpaceShip';

export const MainScene = ({}) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef(null);
  const [asteroids, setAsteroids] = useState([]);
  const gameScreenWidth = gameScreen?.current?.clientWidth;
  const gameScreenHeight = gameScreen?.current?.clientHeight;
  const spaceShip = createSpaceShip({
    canvasWidth: gameScreenWidth,
    canvasHeight: gameScreenHeight,
  });

  const gameCanvas = useMemo(
    () => (
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        canvasStyle={{
          border: '1px solid black',
          width: '90vw',
          height: '90vh',
        }}
      />
    ),
    [],
  );

  useEffect(() => {
    const _asteroids = [...asteroids];

    const interval = setInterval(() => {
      const asteroid = createAteroid(gameScreenWidth);

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      setAsteroids(_asteroids);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameScreen, gameScreenWidth, gameScreenHeight]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');

    console.log(spaceShip, gameScreenWidth, gameScreenHeight)

    const animateAsteroids = () => {

      requestAnimationFrame(animateAsteroids);

      canvasCtx.fillStyle = 'black';
      canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);

      asteroids.forEach((asteroid, i) => {
        asteroid.fall({
          cbFalling: (position) => {

          },
          cbEndFall: () => {
            asteroids.splice(i, 1);
            // setAsteroids(asteroids);
          },
          canvasCtx,
          gameScreenWidth,
          gameScreenHeight,
        });
      });

      spaceShip.draw(canvasCtx);

    };

    requestAnimationFrame(animateAsteroids);
  }, [asteroids, gameScreenWidth, gameScreenHeight]);

  return <div id="main-screen">{gameCanvas}</div>;
};
