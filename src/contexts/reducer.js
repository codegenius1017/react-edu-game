/* eslint-disable default-case */
import { spaceships } from '../gameAssets/Objects/spaceshipsData/spaceships.js';
import * as types from './types.js';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case types.CHANGE_SPACESHIP: {
      let spaceShipId = action.payload;

      if (spaceShipId > state.spaceShipId && !spaceships[spaceShipId]) {
        spaceShipId = 0
      } else if (!spaceships[spaceShipId]) spaceShipId = spaceships.length - 1

      return { ...state, spaceShipId };
    }

    case types.GAME_OVER: {
      return { ...state, gameOver: true, points: action.payload };
    }

    case types.RESTART: {
      return {
        ...state,
        points: 0,
        health: 100,
        level: 0,
        gameOver: false,
        initial: true,
        paused: true,
      }
    }

    case types.LOSE_LIFE: {
      const updatedHealth = state.health - (action.payload || 1);

      return {
        ...state,
        health: updatedHealth,
      }
    }

    case types.LEVEL_UP: {
      let { level } = state;
      level++;

      return { ...state, level };
    }

    case types.PAUSE: {
      return { ...state, paused: !state.paused };
    }

    case types.INITIAL: {
      return { ...state, initial: true, paused: true }
    }

    case types.ON: {
      return { ...state, initial: false, paused: false }
    }

    default: {
      console.log({ ...action });
    }
  }
}
