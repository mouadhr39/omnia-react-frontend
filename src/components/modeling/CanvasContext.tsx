import { createContext, useContext } from "react"
import { useCanvasLogic } from "./useCanvasLogic"

export type CanvasContextType = ReturnType<typeof useCanvasLogic> & {
  positions: { [key: string]: { x: number; y: number } }
}

export const CanvasContext = createContext<CanvasContextType | null>(null)

export const useCanvas = () => {
  const context = useContext(CanvasContext)

  if (!context) throw new Error("Error creating Canvas context.")

  return context
}
