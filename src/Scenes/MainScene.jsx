import { useContext, useEffect, useRef, useState } from 'react';
import Canvas from '../Components/Canvas';
import { GameContext } from '../contexts/GameContext';
import { createAteroid } from '../gameAssets/Objects/Asteroid';

export const MainScene = ({ }) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef();
  const gameScreenWidth = gameScreen?.current?.clientWidth;
  const gameScreenHeight = gameScreen?.current?.clientHeight;
  const [asteroids, setAsteroids] = useState([]);

  let msPrev = window.performance.now()

  useEffect(() => {
    if (!gameScreen.current) return;
    const canvasCtx = gameScreen?.current?.getContext('2d');

    // requestAnimationFrame(animate)

    // const msNow = window.performance.now()
    // const elapsed = msNow - msPrev;

    // if (elapsed < fpsInterval) return

    // msPrev = msNow - (elapsed % fpsInterval) // 3.34

    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);

    return () => canvasCtx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
  }, [gameScreen, gameScreenWidth, gameScreenHeight]);


  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');
    const _asteroids = [...asteroids]

    const interval = setInterval(() => {
      const asteroid = createAteroid(gameScreenWidth);

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      canvasCtx.clearRect(0, 0, gameScreen.current.width, gameScreen.current.height);
      canvasCtx.fillStyle = 'black';
      canvasCtx.fillRect(0, 0, gameScreen.current.width, gameScreen.current.height);

      _asteroids.forEach((asteroid) => {
        asteroid.fall(() => {

        }, canvasCtx);
      });

      setAsteroids(_asteroids);

    }, 1000);

    return () => {
      clearInterval(interval)
    };
  }, [asteroids, gameScreenWidth]);

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
