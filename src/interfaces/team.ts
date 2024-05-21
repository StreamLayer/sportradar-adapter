import { Player } from "./player"

export interface Team {
  id: string
  name: string
  market: string
  players?: Partial<Player>[]
}
