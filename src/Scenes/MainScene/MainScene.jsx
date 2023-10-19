import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as helper from "../../Components/lib/helper/helper";
import * as types from "../../contexts/types.js";
import Canvas from "../../Components/Canvas";
import {
  copyAsteroid,
  createAsteroid,
} from "../../gameAssets/Objects/ManipuleAsteroid";
import { GameContext } from "../../contexts/GameContext";
import { createSpaceShip } from "../../gameAssets/Objects/SpaceShip";
import {
  CONST,
  LEVELS_DATA,
} from "../../gameAssets/Objects/Global";
import style from "./MainScene.module.scss";
import { cloneDeep } from "lodash";

export const MainScene = () => {
  const { gameState, gameDispatch } = useContext(GameContext);

  const levelData = LEVELS_DATA[gameState.level];
  const gameScreenHeight = window.innerHeight;
  const gameScreenWidth = window.innerWidth;

  const [points, setPoints] = useState(gameState.points);
  const [munitionReload, setMunitionReload] = useState(100);

  const shots = useRef([]);
  const asteroids = useRef([]);
  const gameScreen = useRef(null);
  const damaged = useRef(false);

  const spaceShip = useRef(
    createSpaceShip({
      canvasWidth: gameScreenWidth,
      canvasHeight: gameScreenHeight,
      id: gameState.spaceShipId,
    }),
    [gameState.spaceShipId],
  );
  const [munitionCount, setMunitionCount] = useState(spaceShip.current.initialMunition);

  // ------- use memos ------- //
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

  // ------- use callbacks ------- //
  const mitoseTheAsteroid = useCallback(
    (asteroid) => {
      const infoAsteroid = {
        ...asteroid,
        active: true,
        width: asteroid.width / 1.5,
        height: asteroid.height / 1.5,
        vel: asteroid.vel / 2,
      };
      const parentXPosition = asteroid.position.x;

      asteroids.current.push(
        copyAsteroid({
          ...cloneDeep(infoAsteroid),
          finalCordinates: {
            x: parentXPosition - asteroid.width / 2,
            y: asteroid.finalCordinates.y,
          },
        }),
      );

      asteroids.current.push(
        copyAsteroid({
          ...cloneDeep(infoAsteroid),
          finalCordinates: {
            x: parentXPosition + asteroid.width / 2,
            y: asteroid.finalCordinates.y,
          },
        }),
      );
    }, []);

  const calcShotOnAsteroidRange = useCallback((shot, asteroids) => {
    for (let indexAsteroid = 0; indexAsteroid <= asteroids.length; indexAsteroid++) {
      const asteroid = asteroids[indexAsteroid];

      if (helper.calcCollapse(asteroid, shot) && shot.active) {
        asteroid.active = false;
        asteroid.health -= shot.damage;
        setPoints((prev) => prev + 1);

        if (asteroid.health >= 1) {
          mitoseTheAsteroid(asteroid);
        }

        return shot;
      };

    };
  }, [mitoseTheAsteroid]);

  const fillCanvas = useCallback((c) => {
    c.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
  }, [gameScreenWidth, gameScreenHeight]);

  const moveEverything = useCallback(() => {
    const _asteroids = helper.filterActives(asteroids.current);
    const _shots = helper.filterActives(shots.current);

    for (let indexShot = 0; indexShot <= _shots.length; indexShot++) {
      const shot = _shots[indexShot];

      if (shot?.move) {
        shot.move(undefined, undefined, () => {
          const returnedShot = calcShotOnAsteroidRange(shot, _asteroids);

          if (returnedShot) {
            shot.active = false;
          }
        });
      }
    }

    for (let indexAster = 0; indexAster <= _asteroids.length; indexAster++) {
      const asteroid = _asteroids[indexAster];

      if (asteroid?.move) {
        asteroid.move(undefined, undefined, undefined, () => {
          asteroid.active = false;

          if ((gameState.health - asteroid.health) > 0) {
            gameDispatch({ type: types.LOSE_LIFE, payload: asteroid.health });
          } else {
            gameDispatch({ type: types.GAME_OVER, payload: points });
          }
        });
      }
    }
  }, [
    calcShotOnAsteroidRange,
    gameDispatch,
    gameState.health,
    points,
  ]);

  const drawEverything = useCallback(
    (canvasCtx) => {
      if (gameState.paused) return;
      if (!canvasCtx) return;

      const _asteroids = helper.filterActives(asteroids.current);
      const _shots = helper.filterActives(shots.current);

      fillCanvas(canvasCtx);

      for (const asteroid of _asteroids) {
        if (asteroid?.active) asteroid.draw(canvasCtx);
      }

      for (const shot of _shots) {
        if (shot?.active) shot.draw(canvasCtx);
      }

      spaceShip.current.draw(canvasCtx);
    },
    [fillCanvas, gameState.paused],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.Code === "p" || e.key === "p") {
        spaceShip.current.active = gameState.paused;
        gameDispatch({ type: "PAUSE" });
      }

      if (gameState.paused) return;

      if (e.Code === "Space" || e.key === " " || e.keyCode === 32) {
        if (munitionCount > 0) {
          const shot = spaceShip.current.shoot();
          const updatedShots = helper.filterActives(shots.current);

          updatedShots.push(...shot);
          shots.current = updatedShots;

          setMunitionCount((prev) => (prev -= 1));
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

  // ------- use effects ------- //
  useEffect(() => {
    if (gameState.initial === true) {
      setPoints(0);

      helper.inactiveAll(shots.current);
      helper.inactiveAll(asteroids.current);

      asteroids.current = [];
      shots.current = [];
    }

  }, [gameState.initial]);

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
  }, [drawEverything, gameState.paused, moveEverything]);

  useEffect(() => {
    const canvasCtx = gameScreen?.current?.getContext("2d");
    const handleDown = (e) => handleKeyDown(e);
    const handlePress = (e) => handleKeyPress(e, canvasCtx);

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keypress", handlePress);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keypress", handlePress);
    };
  }, [gameScreen, handleKeyPress, handleKeyDown]);

  useEffect(() => {
    const _asteroids = helper.filterActives(asteroids.current);
    const canvasCtx = gameScreen?.current?.getContext("2d");
    const idsAsteroids = levelData?.typesAsteroids || [1];

    const interval = setInterval(() => {
      if (gameState.paused) return;
      const asteroid = createAsteroid({
        canvasCtx,
        gameScreenWidth,
        gameScreenHeight,
        idsAsteroids,
      });

      _asteroids.push(asteroid);

      asteroids.current = _asteroids;
    }, levelData.respawnAsteroid);

    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameScreen,
    gameScreenWidth,
    gameScreenHeight,
    calcShotOnAsteroidRange,
    gameState.paused,
    levelData.respawnAsteroid,
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
        if (munitionCount < spaceShip.current.initialMunition)
          setMunitionCount((prev) => (prev += 1));
        setMunitionReload(100);
        return clearInterval(interval);
      }

      setMunitionReload(percent.toFixed(0));
    }, 100);

    return () => clearInterval(interval);
  }, [munitionCount]);

  useEffect(() => {
    let level = 0;

    if (points > 50) {
      level++;
    }

    if(points > 120){
      level++;
    }

    if(points > 190){
      level++;
    }

    if(points > 280){
      level++;
    }

    if(points > 400){
      level++;
    }

    if(level !== gameState.level){
      gameDispatch({ type: types.LEVEL_UP });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  return (
    <div id="game-main-scene-screen" style={{ overflow: "hidden" }}>
      <div className={`${style["points-counter"]}`}>SCORE: {points}</div>
      <div className={`${style["life-counter"]}`}>
        HEALTH: {gameState.health}
      </div>
      <div className={`${style["munition-info"]}`}>
        <div className={`${style["munition-reload"]}`}>{munitionReload}%</div>
        <div className={`${style["munitions-counter"]}`}>
          {new Array(munitionCount).fill("shot").map((munition, i) => (
            <div key={i} className={`${style["munition"]}`}></div>
          ))}
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
