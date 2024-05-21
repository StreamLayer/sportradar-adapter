import { BaseBallTeam } from "../../../interfaces/baseball-team"

export interface Game {
  home_team: string
  away_team: string
  away: BaseBallTeam
  id: string
  status: 'scheduled' | 'inprogress' | 'complete' | 'closed' | 'wdelay' | 'fdelay' | 'odelay' | 'canceled' | 'unnecessary' | 'if-necessary' | 'postponed' | 'suspended' | 'maintenance'
  reference: string
  scheduled: string
  home: BaseBallTeam
  coverage: 'full' | 'boxscore'
  double_header: boolean
  day_night: 'D' | 'N'
  entry_mode: 'STOMP' | 'LDE'
  game_number: number
  split_squad: boolean
  mlb_id: string
}
