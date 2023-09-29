import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Canvas from '../../Components/Canvas';
import { GameContext } from '../../contexts/GameContext';
import { copyAsteroid, createAsteroid } from '../../gameAssets/Objects/Asteroid';
import { createSpaceShip } from '../../gameAssets/Objects/SpaceShip';
import { CONST, calcCollapse } from '../../gameAssets/Objects/Global';
import style from './MainScene.module.scss';
import { cloneDeep } from 'lodash';

export const MainScene = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const gameScreen = useRef(null);
  const shots = useRef([]);
  const damaged = useRef(false);
  const gameScreenWidth = window.innerWidth;
  const gameScreenHeight = window.innerHeight;
  const canvasCtx = useMemo(
    () => gameScreen?.current?.getContext('2d'),
    [gameScreen],
  );

  const [asteroids, setAsteroids] = useState([]);
  const [points, setPoints] = useState(0);
  const spaceShip = useRef(
    createSpaceShip({
      props: {
        size: 150,
      },
      canvasWidth: gameScreenWidth,
      canvasHeight: gameScreenHeight,
      id: gameState.spaceShipId
    }), [gameState.spaceShipId]
  );

  const gameCanvas = useMemo(
    () => (
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        height={gameScreenHeight}
        width={gameScreenWidth}
        canvasStyle={{
          backgroundColor: '#000000a6',
          backgroundImage: `url('${process.env.PUBLIC_URL}/images/backgrounds/space1.gif')`,
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
          ...cloneDeep(infoAsteroid),
          finalCordinates: {
            x: parentXPosition - asteroid.width / 2,
            y: asteroid.finalCordinates.y,
          },
        }),
      );
      _asteroids.push(
        copyAsteroid({
          ...cloneDeep(infoAsteroid),
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
          shot.move(undefined, undefined, () => {
            const returnedShot = calcShotOnAsteroidRange(shot, asteroids);

            if (returnedShot) {
              shots.current[indexShot].active = false;
              shots.current.splice(indexShot, 1);
            }
          });
      }

      for (const [indexAster, asteroid] of asteroids.entries()) {
        if (!asteroid.active) {
          asteroids.splice(indexAster, 1);
          continue;
        }
        if (asteroid.move)
          asteroid.move(undefined, undefined, undefined, () => {
            const asteroid = asteroids[indexAster];
            asteroids.splice(indexAster, 1);
            setAsteroids(asteroids);
            gameDispatch({ type: 'LOSE_LIFE', payload: asteroid.health });
          });
      }
    },
    [calcShotOnAsteroidRange, gameDispatch],
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

      spaceShip.current.draw(canvasCtx);
    },
    [fillCanvas, gameState.paused, spaceShip.current],
  );

  const handleKeyDown = useCallback(
    (e, canvasCtx) => {
      if (gameState.paused) return;
      if (e.Code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        spaceShip.current.shoot(canvasCtx);
        shots.current = spaceShip.current.shots;
      } else
        if (e.Code === "p" || e.key === "p") {
          gameDispatch({ type: "PAUSE" });
        }
    },
    [gameDispatch, gameState.paused, spaceShip.current],
  );

  const handleKeyPress = useCallback(
    (e, canvasCtx) => {
      if (gameState.paused) return;
      if (e.key === 'w' || e.key === 'ArrowUp') {
        const upInterval = setInterval(() => {
          spaceShip.current.move({ top: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(upInterval);
          }
        });
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        const downInterval = setInterval(() => {
          spaceShip.current.move({ bottom: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(downInterval);
          }
        });
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        const rightInterval = setInterval(() => {
          spaceShip.current.move({ right: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(rightInterval);
          }
        });
      }
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        const letfInterval = setInterval(() => {
          spaceShip.current.move({ left: 7, canvasCtx });
        }, 25);

        window.addEventListener('keyup', (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(letfInterval);
          }
        });
      }
    },
    [gameState.paused, spaceShip.current],
  );

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      if (gameState.paused) return;
      moveEverything(asteroids);
      drawEverything(canvasCtx, asteroids);
    }, CONST.defaultInterval);

    return () => {
      clearInterval(interval);
    };
  }, [asteroids, canvasCtx, drawEverything, gameState.paused, moveEverything]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext('2d');
    const handleDown = (e) => handleKeyDown(e, canvasCtx);
    const handlePress = (e) => handleKeyPress(e, canvasCtx);

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keypress', handlePress);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keypress', handlePress);
    };
  }, [gameScreen, handleKeyPress, handleKeyDown]);

  useEffect(() => {
    const _asteroids = [...asteroids];
    const canvasCtx = gameScreen?.current?.getContext('2d');

    const interval = setInterval(() => {
      if (gameState.paused) return;
      const asteroid = createAsteroid({
        canvasCtx,
        gameScreenWidth,
        gameScreenHeight,
      });

      _asteroids.push(asteroid);
      if (_asteroids.length > 10) _asteroids.shift();

      setAsteroids(_asteroids);
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [gameScreen, gameScreenWidth, gameScreenHeight, asteroids, calcShotOnAsteroidRange, gameState.paused]);

  useEffect(() => {
    damaged.current = true;

    const removeDamageBorder = setTimeout(() => {
      damaged.current = false;
    }, 1000);

    return () => clearTimeout(removeDamageBorder);
  }, [gameState.health]);

  return (
    <div id="main-screen" style={{ overflow: 'hidden' }}>
      <div className={`${style['points-counter']}`}>SCORE: {points}</div>
      <div className={`${style['life-counter']}`}>HEALTH: {gameState.health}</div>
      <div
        className="game-canvas-container"
        style={{ minHeight: 'fit-content', minWidth: 'fit-content' }}
      >
        {gameCanvas}
        <div
          className={`${style['glass']}`}
          style={{
            transition: 'box-shadow .5s ease',
            boxShadow: damaged.current
              ? 'inset 0 0 5vw 5vh #ff8888'
              : 'inset 0 0 5vw 5vh #000',
            fontSize: gameState.paused ? "5rem" : 0,
            background: gameState.paused ? "#000000a6" : "none"
          }}
        >
          {gameState.paused ? "PAUSED" : ""}
        </div>
      </div>
    </div>
  );
};
