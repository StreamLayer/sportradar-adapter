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

export const atbatOutcomes = {
  aBK: [], // Balk
  aCI: [], // Catcher Interference
  aD: [], // Double
  aDAD3: [], // Double - Adv 3rd
  aDAD4: [], // Double - Adv Home
  aFCAD2: [], // Fielders Choice - Adv 2nd
  aFCAD3: [], // Fielders Choice - Adv 3rd
  aFCAD4: [], // Fielders Choice - Adv Home
  aHBP: [PitchOutcomeState.InplayHit], // Hit By Pitch
  aHR: [], // Homerun
  aIBB: [], // Intentional Walk
  aKLAD1: [PitchOutcomeState.StrikeLooking], // Strike Looking - Adv 1st
  aKLAD2: [PitchOutcomeState.StrikeLooking], // Strike Looking - Adv 2nd
  aKLAD3: [PitchOutcomeState.StrikeLooking], // Strike Looking - Adv 3rd
  aKLAD4: [PitchOutcomeState.StrikeLooking], // Strike Looking - Adv Home
  aKSAD1: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Adv 1st
  aKSAD2: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Adv 2nd
  aKSAD3: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Adv 3rd
  aKSAD4: [], // Strike Swinging - Adv Home
  aROE: [PitchOutcomeState.InplayReach], // Reached On Error
  aROEAD2: [PitchOutcomeState.InplayReach], // Reached On Error - Adv 2nd
  aROEAD3: [PitchOutcomeState.InplayReach], // Reached On Error - Adv 3rd
  aROEAD4: [PitchOutcomeState.InplayReach], // Reached On Error - Adv Home
  aS: [], // Single
  aSAD2: [], // Single - Adv 2nd
  aSAD3: [], // Single - Adv 3rd
  aSAD4: [], // Single - Adv Home
  aSBAD1: [], // Sacrifice Bunt - Adv 1st
  aSBAD2: [], // Sacrifice Bunt - Adv 2nd
  aSBAD3: [], // Sacrifice Bunt - Adv 3rd
  aSBAD4: [], // Sacrifice Bunt - Adv Home
  aSFAD1: [], // Sacrifice Fly - Adv 1st
  aSFAD2: [], // Sacrifice Fly - Adv 2nd
  aSFAD3: [], // Sacrifice Fly - Adv 3rd
  aSFAD4: [], // Sacrifice Fly - Adv Home
  aT: [], // Triple
  aTAD4: [], // Triple - Adv Home
  bAB: [PitchOutcomeState.BallInPlay], // Enforced Ball
  bB: [PitchOutcomeState.Ball], // Ball
  bDB: [PitchOutcomeState.BallInPlay], // Dirt Ball
  bIB: [PitchOutcomeState.BallInPlay], // Intentional Ball
  bPO: [], // Pitchout
  kAK: [], // Enforced Strike
  kF: [PitchOutcomeState.Foul], // Foul Ball
  kFT: [PitchOutcomeState.Foul], // Foul Tip
  kKL: [PitchOutcomeState.StrikeLooking], // Strike Looking
  kKS: [PitchOutcomeState.StrikeSwinging], // Strike Swinging
  oBI: [], // Hitter Interference
  oDT2: [], // Double - Tagged out at 2nd
  oDT3: [], // Double - Out at 3rd
  oDT4: [], // Double - Out at Home
  oFC: [], // Fielders Choice
  oFCT2: [], // Fielders Choice - Out at 2nd
  oFCT3: [], // Fielders Choice - Out at 3rd
  oFCT4: [], // Fielders Choice - Out at Home
  oFO: [], // Fly Out
  oGO: [], // Ground Out
  oKLT1: [PitchOutcomeState.StrikeLooking], // Strike Looking - Out at 1st
  oKLT2: [PitchOutcomeState.StrikeLooking], // Strike Looking - Out at 2nd
  oKLT3: [PitchOutcomeState.StrikeLooking], // Strike Looking - Out at 3rd
  oKLT4: [PitchOutcomeState.StrikeLooking], // Strike Looking - Out at Home
  oKST1: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Out at 1st
  oKST2: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Out at 2nd
  oKST3: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Out at 3rd
  oKST4: [PitchOutcomeState.StrikeSwinging], // Strike Swinging - Out at Home
  oLO: [], // Line Out
  oOBB: [], // Out of Batters Box
  oOP: [], // Out on Appeal
  oPO: [], // Pop Out
  oROET2: [PitchOutcomeState.InplayReach], // Reached On Error - Out at 2nd
  oROET3: [PitchOutcomeState.InplayReach], // Reached On Error - Out at 3rd
  oROET4: [PitchOutcomeState.InplayReach], // Reached On Error - Out at Home
  oSB: [], // Sacrifice Bunt
  oSBT2: [], // Sacrifice Bunt - Out at 2nd
  oSBT3: [], // Sacrifice Bunt - Out at 3rd
  oSBT4: [], // Sacrifice Bunt - Out at Home
  oSF: [], // Sacrifice Fly
  oSFT2: [], // Sacrifice Fly - Out at 2nd
  oSFT3: [], // Sacrifice Fly - Out at 3rd
  oSFT4: [], // Sacrifice Fly - Out at Home
  oST1: [], // Single - Tagged out at 1st
  oST2: [], // Single - Out at 2nd
  oST3: [], // Single - Out at 3rd
  oST4: [], // Single - Out at Home
  oTT3: [], // Triple - Tagged out at 3rd
  oTT4: [], // Triple - Out at Home
  rPABC: [], // Ruling Pending, At Bat Continues
  rPABO: [], // Ruling Pending, At Bat Over
}