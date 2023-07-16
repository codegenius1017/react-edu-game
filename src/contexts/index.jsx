import { useReducer } from "react"
import { GameContext } from "./GameContext";
import { gameReducer } from "./reducer";
import { initialData } from "./initialData";

export const GameProvider = ({children}) => {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialData);

  return(
    <GameContext.Provider value={{gameState, gameDispatch}}>
      {children}
    </GameContext.Provider>
  )
}

