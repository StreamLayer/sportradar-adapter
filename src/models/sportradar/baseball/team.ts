import { Player } from "./player"

export interface Team {
  name?: string
  market?: string
  abbr?: string
  id?: string
  runs?: number
  hits?: number
  errors?: number
  players?: Partial<Player>[]
}
