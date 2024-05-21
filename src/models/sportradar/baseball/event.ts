import { EventType } from "./event-type";
import { BaseBallTeam } from "../../../interfaces/baseball-team";
import { Player } from "../../../interfaces/player";

export interface Period {
  id: string
  number: number
  sequence: number
  type: string
}

export type EventPlayer = Pick<Player, "full_name" | "jersey_number" | "reference" | "id" | "sr_id">
export type EventTeam = BaseBallTeam

export interface Court {
  home: BaseBallTeam
  away: BaseBallTeam
}

export interface Location {
  coord_x: number
  coord_y: number
  action_area: string
}

export interface Possession {
  name: string
  market: string
  id: string
}

export interface Statistics {
  type: string
  made: boolean
  shot_type_desc: "driving" | string
  shot_distance: number
  points: number
  team: BaseBallTeam
  player: Pick<Player, "full_name" | "jersey_number" | "reference" | "id">
}

export interface WallClock {
  start_time: string
  end_time: string
}

export interface Flags {
  is_ab_over: boolean
  is_bunt: boolean
  is_bunt_shown: boolean
  is_hit: boolean
  is_wild_pitch: boolean
  is_passed_ball: boolean
  is_double_play: boolean
  is_triple_play: boolean
}

export interface Count {
  balls: number
  strikes: number
  outs: number
  pitch_count: number
}

export interface Pitcher {
  id: string
  pitcher_hand: string
  pitch_count: number
  hitter_hand: string
  last_name: string
  first_name: string
  preferred_name: string
  jersey_number: string
  pitch_speed: number
  pitch_type: string
}

export interface Hitter {
  id: string
  last_name: string
  first_name: string
  preferred_name: string
  jersey_number: string
}

export interface Runner {
  id: string
  starting_base: number
  ending_base: number
  outcome_id: string
  out: boolean
  last_name: string
  first_name: string
  preferred_name: string
  jersey_number: string
}

export interface Event {
  id: string
  type: EventType
  inning: number // Period
  inning_half: string
  sequence_number: number
  sequence: number
  hitter_id: string
  atbat_id: string
  outcome_id: string
  status: string
  created_at: string
  updated_at: string
  wall_clock: WallClock
  flags: Flags
  count: Count
  pitcher: Pitcher
  hitter: Hitter
  runners: Runner[]
  sport: string
  datasource: string
  scope: string
  scopeId: string
  timestamp: number
  attribution?: BaseBallTeam
  options: {
    [key: string]: any
    "baseball.inningNumber": number
    "baseball.inningHalf": string
    "baseball.player.batter": string
    "baseball.player.pitcher": string
    "baseball.team.batter": string
    "baseball.team.pitcher": string
    "baseball.score.home": number
    "baseball.score.away": number
    "baseball.game.state.strikes": number
    "baseball.game.state.balls": number
    "baseball.game.state.outs": number
    "baseball.game.state.pitches": number
    "baseball.score.differential": number
    "baseball.atbat.outcomes": any
    "baseball.pitch.outcomes": any[]
    "baseball.pitch.speed": number
    "baseball.pitch.type": string
  };
}