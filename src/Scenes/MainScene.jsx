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
import { CONST } from '../gameAssets/Objects/Global';

export const MainScene = ({ }) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef(null);
  const [asteroids, setAsteroids] = useState([]);
  const [level, setLevel] = useState(1);
  const gameScreenWidth = window.innerWidth;
  const gameScreenHeight = window.innerHeight;
  const shots = useRef([]);
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
    ), [gameScreenHeight, gameScreenWidth],
  );

  const fillCanvas = useCallback((c) => {
    const img = new Image(gameScreenWidth, gameScreenHeight);
    img.src = `./images/backgrounds/space${level}.gif`;
    img.onload = () => {
      c.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    };
  }, [gameScreenWidth, gameScreenHeight, level]);

  useEffect(() => {
    const _asteroids = [...asteroids];
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      const indexAsteroid = _asteroids.length;
      const asteroid = createAteroid({
        cbFalling: (position) => {

        },
        cbEndFall: () => {
          asteroids.splice(indexAsteroid, 1);
        },
        canvasCtx,
        gameScreenWidth,
        gameScreenHeight,
      });

      asteroid.fall();

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      setAsteroids(_asteroids);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [gameScreen, gameScreenWidth, gameScreenHeight, asteroids]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const drawEverything = () => {
      requestAnimationFrame(drawEverything);
      fillCanvas(canvasCtx);

      asteroids.forEach((asteroid, i) => {
        asteroid.draw(canvasCtx);
      });

      spaceShip.shots.forEach((shot, i) => {
        if (!shot.active) return spaceShip.shots.splice(i, 1);
        shot.draw(canvasCtx);
      });
      spaceShip.draw(canvasCtx);
    };

    requestAnimationFrame(drawEverything);
  }, [asteroids, gameScreenWidth, gameScreenHeight, spaceShip, fillCanvas]);

  const handleKeyDown = useCallback((e, canvasCtx) => {
    if (e.Code === 'Space' || e.key === " " || e.keyCode === 32) {
      spaceShip.shoot(canvasCtx);
      shots.current = spaceShip.shots;
    }
  }, [spaceShip]);

  const handleKeyPress = useCallback((e, canvasCtx) => {

    if (e.key === 'w' || e.key === 'ArrowUp') {
      const upInterval = setInterval(() => {
        spaceShip.move({ top: 7, canvasCtx });
      }, 25);

      window.addEventListener("keyup", (upKeyEvent) => {
        if (upKeyEvent.key === e.key) {
          clearInterval(upInterval);
        }
      })
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
      const downInterval = setInterval(() => {
        spaceShip.move({ bottom: 7, canvasCtx });
      }, 25);

      window.addEventListener("keyup", (upKeyEvent) => {
        if (upKeyEvent.key === e.key) {
          clearInterval(downInterval);
        }
      })
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
      const rightInterval = setInterval(() => {
        spaceShip.move({ right: 7, canvasCtx });
      }, 25);

      window.addEventListener("keyup", (upKeyEvent) => {
        if (upKeyEvent.key === e.key) {
          clearInterval(rightInterval);
        }
      })
    }
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      const letfInterval = setInterval(() => {
        spaceShip.move({ left: 7, canvasCtx });
      }, 25);

      window.addEventListener("keyup", (upKeyEvent) => {
        if (upKeyEvent.key === e.key) {
          clearInterval(letfInterval);
        }
      })
    }

  }, [spaceShip])

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');
    window.addEventListener('keydown', (e) => handleKeyDown(e, canvasCtx));
    window.addEventListener('keypress', (e) => handleKeyPress(e, canvasCtx));
  }, [gameScreen, handleKeyPress]);

  return <div id="main-screen" style={{ overflow: 'hidden' }}>{gameCanvas}</div>;
};
