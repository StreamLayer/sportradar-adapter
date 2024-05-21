import { Team } from "./team"

export interface BaseBallTeam extends Team {
  abbr?: string
  runs?: number
  hits?: number
  errors?: number
}
