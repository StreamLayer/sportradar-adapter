import { Player } from "../../../interfaces/player"
import { ShotType } from "./shot-type";
import { StatType } from "./stat-type";
import { EventType } from "./event-type";
import { Qualifier } from "./qualifier";
import { BasketBallTeam } from "../../../interfaces/basketball-team";

// export interface Attribution {
//   name: string
//   market: string
//   reference: string
//   id: string
//   sr_id: string
// }

export interface Period {
  id: string
  number: number
  sequence: number
  type: string
}

export type EventPlayer = Pick<Player, "full_name" | "jersey_number" | "reference" | "id" | "sr_id">
export type EventTeam = Pick<BasketBallTeam, "name" | "market" | "reference" | "id" | "sr_id">

export interface Court {
  home: BasketBallTeam
  away: BasketBallTeam
}

export interface Location {
  coord_x: number
  coord_y: number
  action_area: "underbasket" | string
}

export interface Possession {
  /**
   * @description player's name
   */
  name: string

  /**
   * @description player team's name
   */
  market: string

  /**
   * @description player's id
   */
  id: string
}

// [{"id":"370376fa-2b2a-4b4b-b7e7-1615c52e415c","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055692189,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":2,"baseball.game.state.balls":1,"baseball.game.state.outs":1,"baseball.game.state.pitches":3,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":90.2,"baseball.pitch.type":"SL"}}]
// [{"id":"5893c31e-dd27-483b-9a4c-c51dfc6f30eb","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055692524,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":1,"baseball.game.state.outs":2,"baseball.game.state.pitches":4,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.2,"baseball.pitch.type":"FA"}}]
// [{"id":"5893c31e-dd27-483b-9a4c-c51dfc6f30eb","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055694190,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":1,"baseball.game.state.outs":2,"baseball.game.state.pitches":4,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.2,"baseball.pitch.type":"FA"}}]
// [{"id":"370376fa-2b2a-4b4b-b7e7-1615c52e415c","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055694816,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":2,"baseball.game.state.balls":1,"baseball.game.state.outs":1,"baseball.game.state.pitches":3,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":90.2,"baseball.pitch.type":"SL"}}]
// [{"id":"96b3e10c-a1e1-4485-b2b4-b3f32e36ddb0","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"9af732bd-827b-4829-bbab-6047b23af79a","timestamp":1716055696348,"options":{"baseball.inningNumber":0,"baseball.inningHalf":"bottom","baseball.team.batter":"80715d0d-0d2a-450f-a970-1b9a3b18c7e7","baseball.team.pitcher":"aa34e0ed-f342-4ec6-b774-c79b47b60e2d","baseball.score.home":0,"baseball.score.away":0,"baseball.score.differential":0,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[]}}]
// [{"id":"5893c31e-dd27-483b-9a4c-c51dfc6f30eb","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055696478,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":1,"baseball.game.state.outs":2,"baseball.game.state.pitches":4,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.2,"baseball.pitch.type":"FA"}}]
// [{"id":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055696955,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[]}}]
// [{"id":"5893c31e-dd27-483b-9a4c-c51dfc6f30eb","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055718787,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"aa74cd83-78f9-4729-8889-b7d3779db0db","baseball.player.pitcher":"ac61f5ab-a255-4519-95b4-012985867e4f","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":1,"baseball.game.state.outs":2,"baseball.game.state.pitches":4,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.2,"baseball.pitch.type":"FA"}}]
// [{"id":"4f1a8e17-a575-49eb-a8c6-e0e0c8dd3c80","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055719499,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":1,"baseball.game.state.balls":0,"baseball.game.state.outs":2,"baseball.game.state.pitches":1,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":97.6,"baseball.pitch.type":"FA"}}]
// [{"id":"4f1a8e17-a575-49eb-a8c6-e0e0c8dd3c80","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055733685,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":1,"baseball.game.state.balls":0,"baseball.game.state.outs":2,"baseball.game.state.pitches":1,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":97.6,"baseball.pitch.type":"FA"}}]
// [{"id":"536a43b4-f544-4956-8c11-0dfe2424c80f","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055733935,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":2,"baseball.game.state.balls":0,"baseball.game.state.outs":2,"baseball.game.state.pitches":2,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":97.5,"baseball.pitch.type":"FA"}}]
// [{"id":"536a43b4-f544-4956-8c11-0dfe2424c80f","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055750628,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":2,"baseball.game.state.balls":0,"baseball.game.state.outs":2,"baseball.game.state.pitches":2,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":[],"baseball.pitch.speed":97.5,"baseball.pitch.type":"FA"}}]
// [{"id":"d3648872-16b1-4371-9546-1db7ca4024de","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055750936,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":0,"baseball.game.state.outs":3,"baseball.game.state.pitches":3,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.4,"baseball.pitch.type":"FA"}}]
// [{"id":"d3648872-16b1-4371-9546-1db7ca4024de","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055752390,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":0,"baseball.game.state.outs":3,"baseball.game.state.pitches":3,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.4,"baseball.pitch.type":"FA"}}]
// [{"id":"d3648872-16b1-4371-9546-1db7ca4024de","datasource":"sportradar","sport":"baseball","scope":"game","scopeId":"deb44573-7a4f-4f4b-821d-e6e24355769b","timestamp":1716055874142,"options":{"baseball.inningNumber":4,"baseball.inningHalf":"top","baseball.player.batter":"d4b8a948-bbd4-4c80-990d-9b69332d7ec7","baseball.player.pitcher":"21b52f39-3075-4a5f-a933-7652b02e3897","baseball.team.batter":"47f490cd-2f58-4ef7-9dfd-2ad6ba6c1ae8","baseball.team.pitcher":"a09ec676-f887-43dc-bbb3-cf4bbaee9a18","baseball.score.home":5,"baseball.score.away":1,"baseball.game.state.strikes":3,"baseball.game.state.balls":0,"baseball.game.state.outs":3,"baseball.game.state.pitches":3,"baseball.score.differential":4,"baseball.atbat.outcomes":null,"baseball.pitch.outcomes":["KS"],"baseball.pitch.speed":98.4,"baseball.pitch.type":"FA

export interface Statistics {
  type: StatType
  made: boolean
  shot_type: ShotType
  shot_type_desc: "driving" | string
  shot_distance: number
  // TODO find out what does these points refer to?
  //  Is it points for event or a total sum over the game?
  points: number
  team: Pick<BasketBallTeam, "name" | "market" | "reference" | "id">
  player: Pick<Player, "full_name" | "jersey_number" | "reference" | "id">
}


export interface Event {
  id: string
  event_type: EventType
  number: number
  sequence: number
  clock: string
  clock_decimal: string
  // ISO8601
  updated: string
  // ISO8601
  wall_clock: string
  created: string
  description: string
  home_points: number
  away_points: number
  attribution: any,
  period: Period,
  on_court: Court
  qualifiers: Qualifier[]
  location: Location
  possession: Possession
  statistics: Statistics[]
}
