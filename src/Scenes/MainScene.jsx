import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Canvas from '../Components/Canvas';
import { GameContext } from '../contexts/GameContext';
import { createAteroid } from '../gameAssets/Objects/Asteroid';

export const MainScene = ({ }) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef(null);
  const [asteroids, setAsteroids] = useState([]);
  const gameScreenWidth = gameScreen?.current?.clientWidth;
  const gameScreenHeight = gameScreen?.current?.clientHeight;

  // useEffect(() => {
  //   const _asteroids = [...asteroids];
  // const canvasCtx = gameScreen?.current?.getContext('2d');

  //   const interval = setInterval(() => {
  //     const asteroid = createAteroid(gameScreenWidth);

  //     _asteroids.push(asteroid);
  //     if (_asteroids.length > 10) _asteroids.shift();

  //     setAsteroids(_asteroids);

  //   }, 1000);

  //   return () => {
  //     clearInterval(interval)
  //   };
  // }, [gameScreen, gameScreenWidth, gameScreenHeight]);

  // useEffect(() => {
  //   const canvasCtx = gameScreen?.current?.getContext('2d');

  //   asteroids.forEach((asteroid) => {

  //     asteroid.fall({
  //       cbFalling: () => { },
  //       cbEndFall: () => { },
  //       canvasCtx,
  //       gameScreenWidth,
  //       gameScreenHeight
  //     });

  //   });
  // }, [asteroids, gameScreenWidth, gameScreenHeight])

  useEffect(() => {
    const _asteroids = [...asteroids];
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      const asteroid = createAteroid(gameScreenWidth);

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      setAsteroids(_asteroids);
    }, 500);

    const animateAsteroids = () => {
      // canvasCtx.fillStyle = 'black';
      // canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);

      _asteroids.forEach((asteroid) => {
        asteroid.fall({
          cbFalling: () => { },
          cbEndFall: () => { },
          canvasCtx,
          gameScreenWidth,
          gameScreenHeight
        });
      });

      requestAnimationFrame(animateAsteroids);
    };

    requestAnimationFrame(animateAsteroids);

    return () => {
      clearInterval(interval);
    };
  }, [asteroids,gameScreen, gameScreenWidth, gameScreenHeight]);

  return (
    <div id="main-screen">
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        canvasStyle={{
          border: '1px solid black',
          width: '90vw',
          height: '90vh',
        }}
      />
    </div>
  );
};
