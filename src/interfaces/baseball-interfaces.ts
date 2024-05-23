
export enum GameState {
  GameStart = 'game.start',
  GameEnd = 'game.end',
  InningStart = 'inning.start',
  InningEnd = 'inning.end'
}

export enum PitchOutcomeState {
  GT90 = 'gt.90',
  LT80 = 'lt.80',
  Ball = 'ball',
  StrikeLooking = 'strike_looking',
  StrikeSwinging = 'strike_swinging',
  BallInPlay = 'ball_in_play',
  Foul = 'foul',
  Strikeout = 'K',
  InlpayOut = 'INPLAY-OUT',
  InplayReach = 'INPLAY-REACH',
  InplayHit = 'INPLAY-HIT',
}

export enum PitchSpeedState {
  GT99 = 'GT99',
  B96_99 = 'B96-99',
  B90_95 = 'B90-95',
  B80_89 = 'B80-89',
  LT80 = 'LT80'
}

// FA,CU,CH,CT,SI,SL,OTHER
export enum PitchTypeState {
  FA = 'FA', //fastball
  CT = 'CT', //cutter
  // FF = 'FF',
  SI = 'SI', //sinker
  SL = 'SL', //slider
  CH = 'CH', //changeup
  CU = 'CU', //curveball
  // Extend for:
  // check https://library.fangraphs.com/pitch-type-abbreviations-classifications/
  // KC = knuckle-curve
  // KN = knuckleball
  // EP  = eephus
  // UN / XX = unidentified
  // PO / FO = pitch out
}

export enum AtBatOutcomeState {
  HIT = 'HIT', // hit
  X1 = 'X1', // single
  X2 = 'X2', // double
  X3 = 'X3', // triple
  HR = 'HR', // home run
  XBH = 'XBH', // extra base hit
  BB = 'BB', // walk
  HBP = 'HBP', // hit by pitch
  REACH = 'REACH', // reach base
  // ERR = 'ERR',
  CI = 'CI', // catcher interference
  RBI = 'RBI', // run batted in
  OUT = 'OUT', // out
  K = 'K', // strikeout
  KL = 'KL', // strikeout looking
  KS = 'KS', // strikeout swinging
  IPO = 'IPO', // in play out
  FO = 'FO', // fly out
  GO = 'GO', // ground out
  GIDP = 'GIDP', // ground into double play
  BI = 'BI' // bunt
}

/*
  "baseball.inningNumber"				situation['subevent']['inning']
  "baseball.inningHalf"				situation['subevent']['side']
  "baseball.player.batter"			batter['mlbam_id']
  "baseball.player.pitcher"			pitcher['mlbam_id']
  "baseball.team.batter"				batter_team
  "baseball.team.pitcher"				pitcher_team
  "baseball.score.home"				situation['subevent']['score_home']
  "baseball.score.away"				situation['subevent']['score_away']
  "baseball.game.state.strikes" 		situation['subevent']['strikes']
  "baseball.game.state.balls"			situation['subevent']['balls']
  "baseball.game.state.outs"			situation['subevent']['outs']
  "baseball.game.state.pitches"		situation['subevent']['pitches']
  "baseball.score.differential"		situation['subevent']['score_home'] - situation['subevent']['score_away'],
 */
export enum BaseballEvents {
  // category
  PlayerBatter = 'baseball.player.batter',
  PlayerPitcher = 'baseball.player.pitcher',
  TeamBatter = 'baseball.team.batter',
  TeamPitcher = 'baseball.team.pitcher',
  // outcomes
  AtBatOutcome = 'baseball.atbat.outcomes',
  PitchOutcome = 'baseball.pitch.outcomes',
  PitchType = 'baseball.pitch.type',
  PitchSpeed = 'baseball.pitch.speed',
  // game states
  InningNumber = 'baseball.inningNumber',
  InningHalf = 'baseball.inningHalf',
  ScoreHome = 'baseball.score.home',
  ScoreAway = 'baseball.score.away',
  GameStateStrikes = 'baseball.game.state.strikes',
  GameStateBalls = 'baseball.game.state.balls',
  GameStateOut = 'baseball.game.state.outs',
  GameStatePitches = 'baseball.game.state.pitches',
  // unknown
  ScoreDifferential = 'baseball.score.differential',
}

export enum InningHalf {
  Top = 'top',
  Bottom = 'bottom'
}

export enum Sources {
  PitchOutcome = 'baseball.pitch.outcome',
  PitchSpeed = 'baseball.pitch.speed',
  AtBatOutcome = 'baseball.atbat.outcome',
  GameStates = 'baseball.game.states',
  InningHalf = 'baseball.inning.half',
  PitchType = 'baseball.pitch.type',
}
