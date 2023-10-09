import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Canvas from "../../Components/Canvas";
import { GameContext } from "../../contexts/GameContext";
import {
  copyAsteroid,
  createAsteroid,
} from "../../gameAssets/Objects/Asteroid";
import { createSpaceShip } from "../../gameAssets/Objects/SpaceShip";
import { CONST, calcCollapse } from "../../gameAssets/Objects/Global";
import style from "./MainScene.module.scss";
import * as helper from "../../Components/lib/helper/helper";
import { cloneDeep } from "lodash";

export const MainScene = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [points, setPoints] = useState(gameState.points);
  const [asteroids, setAsteroids] = useState([]);
  const gameScreen = useRef(null);
  const damaged = useRef(false);
  const shots = useRef([]);
  const gameScreenHeight = window.innerHeight;
  const gameScreenWidth = window.innerWidth;
  const [munitionReload, setMunitionReload] = useState(100);
  const canvasCtx = useMemo(
    () => gameScreen?.current?.getContext("2d"),
    [gameScreen],
  );

  useEffect(() => {
    if (gameState.initial === true) {
      setPoints(0);

      helper.inactiveAll(shots.current);
      helper.inactiveAll(asteroids);

      setAsteroids([]);
      shots.current = [];
    }
  }, [gameState.initial]);

  const spaceShip = useRef(
    createSpaceShip({
      canvasWidth: gameScreenWidth,
      canvasHeight: gameScreenHeight,
      id: gameState.spaceShipId,
    }),
    [gameState.spaceShipId],
  );

  const [munitionCount, setMunitionCount] = useState(spaceShip.current.initialMunition);

  useEffect(() => {
    spaceShip.current = createSpaceShip({
      props: {
        size: 150,
      },
      canvasWidth: gameScreenWidth,
      canvasHeight: gameScreenHeight,
      id: gameState.spaceShipId,
    });
  }, [gameScreenHeight, gameScreenWidth, gameState.spaceShipId]);

  const gameCanvas = useMemo(
    () => (
      <Canvas
        id="main-screen-canvas"
        canvasRef={gameScreen}
        height={gameScreenHeight}
        width={gameScreenWidth}
        canvasStyle={{
          backgroundColor: "#000000a6",
          backgroundImage: `url('${process.env.PUBLIC_URL}/images/backgrounds/space1.gif')`,
          border: "1px solid black",
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
      for (let indexAsteroid = 0; indexAsteroid <= asteroids.length; indexAsteroid++) {
        const asteroid = asteroids[indexAsteroid];

        if (calcCollapse(asteroid, shot) && shot.active) {
          asteroid.active = false;
          asteroid.health -= shot.damage;
          setPoints((prev) => prev + 1);

          if (asteroid.health >= 1) {
            mitoseTheAsteroid(asteroid);
          } else {
            setAsteroids(helper.filterActives(asteroids));
          }

          return shot;
        }

      };
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
    () => {
      for (let indexShot = 0; indexShot <= shots.current.length; indexShot++) {
        const shot = shots.current[indexShot];

        if (!shot.active) continue;

        if (shot.move) {
          shot.move(undefined, undefined, () => {
            const returnedShot = calcShotOnAsteroidRange(shot, asteroids);

            if (returnedShot) {
              shots.current[indexShot].active = false;
            }
          });
        }
      }

      for (let indexAster = 0; indexAster <= asteroids.length; indexAster++) {
        const asteroid = asteroids[indexAster];

        if (!asteroid.active) continue;

        if (asteroid.move){
          asteroid.move(undefined, undefined, undefined, () => {
            asteroids[indexAster].active = false;
            setAsteroids(helper.filterActives(asteroids));
            gameDispatch({ type: "LOSE_LIFE", payload: asteroid.health });
          });
        }
      }

      shots.current = helper.filterActives(shots.current);
    },
    [asteroids, calcShotOnAsteroidRange, gameDispatch],
  );

  const drawEverything = useCallback(
    (canvasCtx) => {
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
    [asteroids, fillCanvas, gameState.paused],
  );

  const handleKeyDown = useCallback(
    (e, canvasCtx) => {
      if (e.Code === "p" || e.key === "p") {
        spaceShip.current.active = gameState.paused;
        gameDispatch({ type: "PAUSE" });
      }

      if (gameState.paused) return;

      if (e.Code === "Space" || e.key === " " || e.keyCode === 32) {
        if (munitionCount > 0) {
          spaceShip.current.shoot(canvasCtx);
          shots.current = spaceShip.current.shots;
          setMunitionCount(prev => prev -= 1);
        }
      }
    },
    [gameDispatch, gameState.paused, munitionCount],
  );

  const handleKeyPress = useCallback(
    (e, canvasCtx) => {
      if (gameState.paused) return;
      if (e.key === "w" || e.key === "ArrowUp") {
        const upInterval = setInterval(() => {
          spaceShip.current.move({ top: spaceShip.current.vel, canvasCtx });
        }, 25);

        window.addEventListener("keyup", (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(upInterval);
          }
        });
      }
      if (e.key === "s" || e.key === "ArrowDown") {
        const downInterval = setInterval(() => {
          spaceShip.current.move({ bottom: spaceShip.current.vel, canvasCtx });
        }, 25);

        window.addEventListener("keyup", (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(downInterval);
          }
        });
      }
      if (e.key === "d" || e.key === "ArrowRight") {
        const rightInterval = setInterval(() => {
          spaceShip.current.move({ right: spaceShip.current.vel, canvasCtx });
        }, 25);

        window.addEventListener("keyup", (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(rightInterval);
          }
        });
      }
      if (e.key === "a" || e.key === "ArrowLeft") {
        const letfInterval = setInterval(() => {
          spaceShip.current.move({ left: spaceShip.current.vel, canvasCtx });
        }, 25);

        window.addEventListener("keyup", (upKeyEvent) => {
          if (upKeyEvent.key === e.key) {
            clearInterval(letfInterval);
          }
        });
      }
    },
    [gameState.paused],
  );

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext("2d");

    const interval = setInterval(() => {
      if (gameState.paused) return;
      moveEverything();
      drawEverything(canvasCtx);
    }, CONST.defaultInterval);

    return () => {
      clearInterval(interval);
    };
  }, [asteroids, canvasCtx, drawEverything, gameState.paused, moveEverything]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext("2d");
    const handleDown = (e) => handleKeyDown(e, canvasCtx);
    const handlePress = (e) => handleKeyPress(e, canvasCtx);

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keypress", handlePress);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keypress", handlePress);
    };
  }, [gameScreen, handleKeyPress, handleKeyDown]);

  useEffect(() => {
    const _asteroids = [...asteroids];
    const canvasCtx = gameScreen?.current?.getContext("2d");

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
  }, [
    gameScreen,
    gameScreenWidth,
    gameScreenHeight,
    asteroids,
    calcShotOnAsteroidRange,
    gameState.paused,
  ]);

  useEffect(() => {
    damaged.current = true;

    const removeDamageBorder = setTimeout(() => {
      damaged.current = false;
    }, 1000);

    return () => clearTimeout(removeDamageBorder);
  }, [gameState.health]);

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      counter += 100;
      const percent = (counter / spaceShip.current.cooldown) * 100;

      if (percent >= 100) {
        if (munitionCount < spaceShip.current.initialMunition) setMunitionCount(prev => prev += 1);
        setMunitionReload(100);
        return clearInterval(interval);
      }

      setMunitionReload(percent.toFixed(0));
    }, 100);

    return () => clearInterval(interval);
  }, [munitionCount]);

  return (
    <div id="game-main-scene-screen" style={{ overflow: "hidden" }}>
      <div className={`${style["points-counter"]}`}>SCORE: {points}</div>
      <div className={`${style["life-counter"]}`}>
        HEALTH: {gameState.health}
      </div>
      <div className={`${style["munition-info"]}`}>
        <div className={`${style["munition-reload"]}`}>{munitionReload}%</div>
        <div className={`${style["munitions-counter"]}`}>
          {
            new Array(munitionCount).fill("shot").map(() => (
              <div className={`${style["munition"]}`}></div>
            ))
          }
        </div>
      </div>
      <div
        className="game-canvas-container"
        style={{ minHeight: "fit-content", minWidth: "fit-content" }}
      >
        {gameCanvas}
        <div
          className={`${style["glass"]}`}
          style={{
            transition: "box-shadow .5s ease",
            boxShadow: damaged.current
              ? "inset 0 0 5vw 5vh #ff8888"
              : "inset 0 0 5vw 5vh #000",
            fontSize: gameState.paused ? "5rem" : 0,
            background: gameState.paused ? "#000000a6" : "none",
          }}
        >
          {gameState.paused && !gameState.initial ? (
            <div className={`${style["pause-info"]}`}>
              PAUSED
              <button
                className={`${style["menu-button"]}`}
                onClick={() => gameDispatch({ type: "RESTART" })}
              >
                Menu Inicial
              </button>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
};
