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
import { copyAsteroid, createAsteroid } from '../gameAssets/Objects/Asteroid';
import { createSpaceShip } from '../gameAssets/Objects/SpaceShip';
import { CONST, calcCollapse } from '../gameAssets/Objects/Global';
import style from './MainScene.module.scss';

export const MainScene = ({}) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef(null);
  const shots = useRef([]);
  const gameScreenWidth = window.innerWidth;
  const gameScreenHeight = window.innerHeight;
  const canvasCtx = useMemo(
    () => gameScreen?.current?.getContext('2d'),
    [gameScreen],
  );

  const [asteroids, setAsteroids] = useState([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
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
          boxShadow: 'inset 0 0 10vw 10vh #000',
          backgroundColor: '#000000a6',
          backgroundImage:
            "url('./space-warrior/images/backgrounds/space1.gif')",
          border: '1px solid black',
        }}
      />
    ),
    [gameScreenHeight, gameScreenWidth],
  );

  const mitoseTheAsteroid = useCallback(
    (asteroid) => {
      const _asteroids = [...asteroids];
      const infoAsteroid = {
        ...asteroid,
        active: true,
        width: asteroid.width / 1.5,
        height: asteroid.height / 1.5,
        vel: asteroid.vel / 2,
      };
      const parentXPosition = asteroid.position.x;

      _asteroids.push(
        copyAsteroid({
          ...infoAsteroid,
          finalCordinates: {
            x: parentXPosition - asteroid.width / 2,
            y: asteroid.finalCordinates.y,
          },
        }),
      );
      _asteroids.push(
        copyAsteroid({
          ...infoAsteroid,
          finalCordinates: {
            x: parentXPosition + asteroid.width / 2,
            y: asteroid.finalCordinates.y,
          },
        }),
      );

      setAsteroids(_asteroids);
    },
    [asteroids],
  );

  const calcShotOnAsteroidRange = useCallback(
    (shot, asteroids) => {
      let indexAsteroid = 0;
      for (const asteroid of asteroids) {
        if (calcCollapse(asteroid, shot) && shot.active) {
          asteroid.active = false;
          asteroids.splice(indexAsteroid, 1);
          asteroid.health -= shot.damage;
          setPoints((prev) => prev + 1);
          if (asteroid.health >= 1) {
            mitoseTheAsteroid(asteroid);
          } else {
            setAsteroids(asteroids);
          }

          return shot;
        }
        indexAsteroid++;
      }
    },
    [mitoseTheAsteroid],
  );

  const fillCanvas = useCallback(
    (c) => {
      c.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    },
    [gameScreenWidth, gameScreenHeight],
  );

  const moveEverything = useCallback(
    (asteroids) => {
      for (const [indexShot, shot] of shots.current.entries()) {
        if (!shot.active) {
          shots.current.splice(indexShot, 1);
          continue;
        }
        if (shot.move)
          shot.move(
            undefined,
            undefined,
            () => {
              const returnedShot = calcShotOnAsteroidRange(shot, asteroids);

              if(returnedShot){
                shots.current[indexShot].active = false;
                shots.current.splice(indexShot, 1);
                // shots.current = shots;
              }
            },
          );
      }

      for (const [indexAster, asteroid] of asteroids.entries()) {
        if (!asteroid.active) {
          asteroids.splice(indexAster, 1);
          continue;
        }
        if (asteroid.move) asteroid.move();
      }
    },
    [calcShotOnAsteroidRange],
  );

  const drawEverything = useCallback(
    (canvasCtx, asteroids) => {
      if (gameState.paused) return;
      if (!canvasCtx) return;

      fillCanvas(canvasCtx);

      for (const asteroid of asteroids) {
        if (asteroid.active) asteroid.draw(canvasCtx);
      }

      for (const shot of shots.current) {
        if (shot.active) shot.draw(canvasCtx);
      }

      spaceShip.draw(canvasCtx);
    },
    [fillCanvas, gameState.paused, spaceShip],
  );

  const handleKeyDown = useCallback(
    (e, canvasCtx) => {
      let count = 1
      if ((e.Code === 'Space' || e.key === ' ' || e.keyCode === 32) && count == 1) {
        spaceShip.shoot(canvasCtx);
        shots.current = spaceShip.shots;
        count++;
      }
    },
    [spaceShip],
  );

  const handleKeyPress = useCallback(
    (e, canvasCtx) => {
      if (e.key === 'w' || e.key === 'ArrowUp') {
        const upInterval = setInterval(() => {
          spaceShip.move({ top: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(upInterval);
          }
        });
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        const downInterval = setInterval(() => {
          spaceShip.move({ bottom: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(downInterval);
          }
        });
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        const rightInterval = setInterval(() => {
          spaceShip.move({ right: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(rightInterval);
          }
        });
      }
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        const letfInterval = setInterval(() => {
          spaceShip.move({ left: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(letfInterval);
          }
        });
      }
    },
    [spaceShip],
  );

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      moveEverything(asteroids);
      drawEverything(canvasCtx, asteroids);
    }, CONST.defaultInterval);

    return () => {
      clearInterval(interval);
    };
  }, [asteroids, canvasCtx, drawEverything, moveEverything]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');
    window.addEventListener('keydown', (e) => handleKeyDown(e, canvasCtx));
    window.addEventListener('keypress', (e) => handleKeyPress(e, canvasCtx));
  }, [gameScreen, handleKeyPress, handleKeyDown]);

  useEffect(() => {
    const _asteroids = [...asteroids];
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      const indexAsteroid = _asteroids.length;
      const asteroid = createAsteroid({
        cbFalling: () => calcShotOnAsteroidRange(shots.current, indexAsteroid),
        cbEndFall: () => {
          const asteroid = asteroids[indexAsteroid];
          asteroid.active = false;
          asteroids.splice(indexAsteroid, 1);
          dispatchEvent('LOSE_LIFE', asteroid.damage);
        },
        canvasCtx,
        gameScreenWidth,
        gameScreenHeight,
      });

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      setAsteroids(_asteroids);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    gameScreen,
    gameScreenWidth,
    gameScreenHeight,
    asteroids,
    calcShotOnAsteroidRange,
  ]);

  useEffect(() => {}, [gameState.health]);

  return (
    <div id="main-screen" style={{ overflow: 'hidden' }}>
      <div className={`${style['points-counter']}`}>SCORE: {points}</div>
      <div
        className="game-canvas-container"
        style={{ minHeight: 'fit-content', minWidth: 'fit-content' }}
      >
        {gameCanvas}
      </div>
    </div>
  );
};
