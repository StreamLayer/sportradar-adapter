import { BasketBallTeam } from "../../../interfaces/basketball-team"

export interface Game {
  id: string
  status: string
  coverage: string
  reference: string
  scheduled: string
  home: BasketBallTeam,
  away: BasketBallTeam
}
