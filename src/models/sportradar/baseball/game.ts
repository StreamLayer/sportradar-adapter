import { Team } from "./team"

export interface Game {
  home_team: string
  away_team: string
  away: Team
  id: string
  status: 'scheduled' | 'inprogress' | 'complete' | 'closed' | 'wdelay' | 'fdelay' | 'odelay' | 'canceled' | 'unnecessary' | 'if-necessary' | 'postponed' | 'suspended' | 'maintenance'
  reference: string
  scheduled: string
  home: Team
  coverage: 'full' | 'boxscore'
  double_header: boolean
  day_night: 'D' | 'N'
  entry_mode: 'STOMP' | 'LDE'
  game_number: number
  split_squad: boolean
  mlb_id: string
}
