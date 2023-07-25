import { useEffect, useRef } from 'react';
import Canvas from '../Components/Canvas';

export const MainScene = ({}) => {
  const gameScreen = useRef();
  const canvasCtx = gameScreen?.current;
  const gameScreenWidth = gameScreen?.current.clientWidth;
  const gameScreenHeight = gameScreen?.current.clientHeight;

  useEffect(() => {
    console.log(canvasCtx);
    canvasCtx?.getContext('2d');

    canvasCtx.fillRect(0, 0, gameScreenWidth, gameScreenHeight);
  }, []);

  return (
    <div id="main-screen">
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        canvasStyle={{ border: '1px solid black' }}
      />
    </div>
  );
};
