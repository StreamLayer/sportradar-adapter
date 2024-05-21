import { Team } from "./team"

export interface BasketBallTeam extends Team {
  reference: string
  sr_id: string
  points: number
  bonus: boolean
  remaining_timeouts: number
  errors?: number
}
