/* eslint-disable default-case */
import * as types from './types.js';

export const gameReducer = (state, action) => {
  switch(action.type){
    case types.CHANGE_SPACESHIP: {
      const {spaceshipId} = action.payload;

      return {...state, spaceshipId};
    }

    case types.GAME_OVER: {
      return {...state, gameOver: true};
    }
    
    case types.RESTART: {
      return {
        ...state, 
        points: 0, 
        health: 100,
        level: 0,
        gameOver: false
      }
    }
    
    case types.LEVEL_UP: {
      let level = state;
      level++;

      return {...state, level};
    }
  }
}
