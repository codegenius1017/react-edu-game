import { useContext, useEffect, useRef, useState } from 'react';
import Canvas from '../Components/Canvas';
import { GameContext } from '../contexts/GameContext';
import { createAteroid } from '../gameAssets/Objects/Asteroid';

export const MainScene = ({}) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef();
  const gameScreenWidth = gameScreen?.current?.clientWidth;
  const gameScreenHeight = gameScreen?.current?.clientHeight;
  const [shouldClearCanvas, setShouldClearCanvas] = useState(true);
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    console.log(gameScreen.current);
    if (!gameScreen.current) return;
    const canvasCtx = gameScreen?.current?.getContext('2d');

    if (shouldClearCanvas && canvasCtx) {
      console.log(
        canvasCtx,
        gameScreen?.current?.clientWidth,
        gameScreen?.current?.clientHeight,
      );
      canvasCtx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
      canvasCtx.fillStyle = 'black';
      canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);
      setShouldClearCanvas(false); // Evita limpar o canvas novamente após a primeira renderização
    }
    // if (canvasCtx) {
    //   console.log(canvasCtx, gameScreen?.current?.clientWidth,  gameScreen?.current?.clientHeight);

    //   canvasCtx.fillStyle = 'black';
    //   canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);
    // }

    // return () => canvasCtx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
  }, [gameScreen, gameScreenWidth, gameScreenHeight]);

  useEffect(() => {
    // Defina shouldClearCanvas como true sempre que o componente for montado ou gameState for alterado.
    // Isso garante que o canvas será limpo e redesenhado.
    setShouldClearCanvas(true);
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      const asteroid = createAteroid(gameScreenWidth);
      const arrAsteroids = [...asteroids, asteroid];

      asteroid.fall();

      setAsteroids(arrAsteroids);
    }, 1000);

    return () => clearInterval(interval);
  }, [asteroids]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');

    canvasCtx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);

    asteroids.forEach((asteroid) => {
      canvasCtx.fillStyle = asteroid.image;
      canvasCtx.fillRect(
        asteroid.position.x,
        asteroid.position.y,
        asteroid.width,
        asteroid.height,
      );
    });

  }, [asteroids]);

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
