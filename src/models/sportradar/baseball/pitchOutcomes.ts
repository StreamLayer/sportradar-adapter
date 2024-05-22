// export enum PitchOutcomeState {
//   Ball = 'ball',
//   StrikeLooking = 'strike_looking',
//   StrikeSwinging = 'strike_swinging',
//   BallInPlay = 'ball_in_play',
//   Foul = 'foul',
//   Strikeout = 'K',
//   InlpayOut = 'INPLAY-OUT',
//   InplayReach = 'INPLAY-REACH',
//   InplayHit = 'INPLAY-HIT',
// }

// nvenue PITCH_OUTCOME (from python map)
// PITCH_OUTCOME_MAP = {
//   'BALL': 'ball',
//   'K':'K',
//   'KF': 'foul',
//   'KS': 'strike_swinging',
//   'KL': 'strike_looking',    
//   'INPLAY': 'ball_in_play',    
//   'INPLAY-OUT':'INPLAY-OUT',
//   'INPLAY-REACH':'INPLAY-REACH',
//   'INPLAY-HIT':'INPLAY-HIT',
//   'GT99': 'gt.90',
//   'LT80': 'lt.80',
// }

export enum PitchOutcome {
  GT90 = 'gt.90', //from speed
  LT80 = 'lt.80', //from speed
  BALL = 'ball',
  STRIKE_LOOKING = 'strike_looking',
  STRIKE_SWINGING = 'strike_swinging',
  BALL_IN_PLAY = 'ball_in_play',
  FOUL = 'foul',
  STRIKEOUT = 'K',
  IN_PLAY_OUT = 'INPLAY-OUT',
  IN_PLAY_REACH = 'INPLAY-REACH',
  IN_PLAY_HIT = 'INPLAY-HIT',
}
