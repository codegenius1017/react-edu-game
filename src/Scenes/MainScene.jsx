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
  const [level, setLevel] = useState(1);
  const gameScreenWidth = window.innerWidth;
  const gameScreenHeight = window.innerHeight;
  const [spaceShip, setSpaceShip] = useState(
    createSpaceShip({
      props: {
        size: 150,
      },
      canvasWidth: gameScreenWidth,
      canvasHeight: gameScreenHeight,
    }),
  );

  const gameCanvas = useMemo(
    () => (
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        height={gameScreenHeight}
        width={gameScreenWidth}
        canvasStyle={{
          boxShadow: "inset 0 0 10vw 10vh #000",
          backgroundColor: "#000000a6",
          backgroundImage: "url('./images/backgrounds/space1.gif')",
          border: '1px solid black',
          maxWidth: '99vw',
          maxHeight: '99vh',
        }}
      />
    ),
    [],
  );

  const fillCanvas = (c) => {
    const img = new Image(gameScreenWidth, gameScreenHeight);
    img.src = `./images/backgrounds/space${level}.gif`;
    img.onload = () => {
      c.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    };
  };

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

    const animateAsteroids = () => {
      requestAnimationFrame(animateAsteroids);

      fillCanvas(canvasCtx);

      asteroids.forEach((asteroid, i) => {
        asteroid.fall({
          cbFalling: (position) => {},
          cbEndFall: () => {
            asteroids.splice(i, 1);
          },
          canvasCtx,
          gameScreenWidth,
          gameScreenHeight,
        });
      });

      spaceShip.shots.forEach((shot, i) => {
        if(!shot.active) return spaceShip.shots.splice(i, 1);
        shot.draw(canvasCtx);
      });
      spaceShip.draw(canvasCtx);
    };

    requestAnimationFrame(animateAsteroids);
  }, [asteroids, gameScreenWidth, gameScreenHeight, spaceShip]);

  const handleKeyPress = useCallback((e, canvasCtx) => {
    if (e.key === 'w' || e.key === 'ArrowUp') {
      spaceShip.move({ top: 5, canvasCtx });
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
      spaceShip.move({ bottom: 5, canvasCtx });
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
      spaceShip.move({ right: 5, canvasCtx });
    }
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      spaceShip.move({ left: 5, canvasCtx });
    }
    if (e.Code === 'Space' || e.key === " " || e.keyCode === 32) {
      spaceShip.shoot(canvasCtx);
      console.log(spaceShip);
    }
  }, [spaceShip]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');
    window.addEventListener('keydown', (e) => handleKeyPress(e, canvasCtx));
  }, [gameScreen, handleKeyPress]);

  return <div id="main-screen" style={{overflow: 'hidden'}}>{gameCanvas}</div>;
};
