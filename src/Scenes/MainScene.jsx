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
          backgroundImage: "url('./images/backgrounds/space1.gif')",
          border: '1px solid black',
        }}
      />
    ),
    [gameScreenHeight, gameScreenWidth],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function calcShotOnAsteroidRange(shot, asteroids) {
    let indexAsteroid = 0;
    for (const asteroid of asteroids) {
      if (calcCollapse(asteroid, shot)) {
        asteroid.active = false;
        asteroids.splice(indexAsteroid, 1);
        if (asteroid.health - shot.damage > 1) {
          asteroids.push({
            ...asteroid,
            active: true,
            width: asteroid.width / 2,
            height: asteroid.height / 2,
            health: asteroid.health - shot.damage,
            finalPosition: {
              x: asteroid.position.x - asteroid.width / 2,
              y: gameScreenHeight,
            },
          });
          asteroids.push({
            ...asteroid,
            active: true,
            width: asteroid.width / 2,
            height: asteroid.height / 2,
            health: asteroid.health - shot.damage,
            finalPosition: {
              x: asteroid.position.x + asteroid.width / 2,
              y: gameScreenHeight,
            },
          });
        }
        setPoints((prev) => prev + 1);
      }
      indexAsteroid++;
    }
  }

  const fillCanvas = useCallback(
    (c) => {
      c.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    },
    [gameScreenWidth, gameScreenHeight],
  );

  const moveEverything = useCallback((shots, asteroids) => {
    let indexShot = 0;
    let indexAster = 0;

    for (const shot of shots) {
      if (!shot.active) {
        shots.splice(indexShot, 1);
        continue;
      }
      if (shot.move)
        shot.move(undefined, undefined, () =>
          calcShotOnAsteroidRange(shot, asteroids),
        );
      indexShot++;
    }

    for (const asteroid of asteroids) {
      if (!asteroid.active) {
        asteroids.splice(indexAster, 1);
        continue;
      }
      if (asteroid.move) asteroid.move();
      indexAster++;
    }
  }, []);

  const drawEverything = useCallback(
    (canvasCtx, asteroids) => {
      if (gameState.paused) return;
      if (!canvasCtx) return;

      fillCanvas(canvasCtx);

      for (const asteroid of asteroids) {
        if (asteroid.active) asteroid.draw(canvasCtx);
      }

      for (const shot of spaceShip.shots) {
        if (shot.active) shot.draw(canvasCtx);
      }

      spaceShip.draw(canvasCtx);
    },
    [fillCanvas, gameState.paused, spaceShip],
  );

  const handleKeyDown = useCallback(
    (e, canvasCtx) => {
      if (e.Code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        spaceShip.shoot(canvasCtx);
        shots.current = spaceShip.shots.map((shot) => shot.position);
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
      moveEverything(spaceShip.shots, asteroids);
      drawEverything(canvasCtx, asteroids);
    }, CONST.defaultInterval);

    return () => {
      clearInterval(interval);
    };
  }, [asteroids, canvasCtx, drawEverything, moveEverything, spaceShip.shots]);

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
      const asteroid = createAteroid({
        cbFalling: () => calcShotOnAsteroidRange(shots, indexAsteroid),
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
