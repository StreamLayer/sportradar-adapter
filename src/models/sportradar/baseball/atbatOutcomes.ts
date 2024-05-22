// Nvenue: atbat.outcomes
export enum NvenueAtBatOutcomeState {
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

export const sportRadarAtBatOutcomes = {
  aBK: ['Balk'], // Balk
  aCI: [NvenueAtBatOutcomeState.CI], // Catcher Interference
  aD: [NvenueAtBatOutcomeState.X2], // Double
  aDAD3: [NvenueAtBatOutcomeState.X2], // Double - Adv 3rd
  aDAD4: [NvenueAtBatOutcomeState.X2], // Double - Adv Home
  aFCAD2: ['Fielders Choice - Adv 2nd'], // Fielders Choice - Adv 2nd
  aFCAD3: ['Fielders Choice - Adv 3rd'], // Fielders Choice - Adv 3rd
  aFCAD4: ['Fielders Choice - Adv Home'], // Fielders Choice - Adv Home
  aHBP: [NvenueAtBatOutcomeState.HIT, NvenueAtBatOutcomeState.HBP], // Hit By Pitch
  aHR: [NvenueAtBatOutcomeState.HR], // Homerun
  aIBB: [NvenueAtBatOutcomeState.BB], // Intentional Walk
  aKLAD1: [NvenueAtBatOutcomeState.KL], // Strike Looking - Adv 1st
  aKLAD2: [NvenueAtBatOutcomeState.KL], // Strike Looking - Adv 2nd
  aKLAD3: [NvenueAtBatOutcomeState.KL], // Strike Looking - Adv 3rd
  aKLAD4: [NvenueAtBatOutcomeState.KL], // Strike Looking - Adv Home
  aKSAD1: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Adv 1st
  aKSAD2: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Adv 2nd
  aKSAD3: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Adv 3rd
  aKSAD4: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Adv Home
  aROE: [NvenueAtBatOutcomeState.REACH], // Reached On Error
  aROEAD2: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Adv 2nd
  aROEAD3: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Adv 3rd
  aROEAD4: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Adv Home
  aS: [NvenueAtBatOutcomeState.X1], // Single
  aSAD2: [NvenueAtBatOutcomeState.X1], // Single - Adv 2nd
  aSAD3: [NvenueAtBatOutcomeState.X1], // Single - Adv 3rd
  aSAD4: [NvenueAtBatOutcomeState.X1], // Single - Adv Home
  aSBAD1: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Adv 1st
  aSBAD2: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Adv 2nd
  aSBAD3: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Adv 3rd
  aSBAD4: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Adv Home
  aSFAD1: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Adv 1st
  aSFAD2: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Adv 2nd
  aSFAD3: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Adv 3rd
  aSFAD4: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Adv Home
  aT: [NvenueAtBatOutcomeState.X3], // Triple
  aTAD4: [NvenueAtBatOutcomeState.X3], // Triple - Adv Home
  bAB: ['Enforced Ball'], // Enforced Ball
  bB: ['Ball'], // Ball
  bDB: ['Dirt Ball'], // Dirt Ball
  bIB: ['Intentional Ball'], // Intentional Ball
  bPO: ['Pitchout'], // Pitchout
  kAK: ['Enforced Strike'], // Enforced Strike
  kF: ['Foul Ball'], // Foul Ball
  kFT: ['Foul Tip'], // Foul Tip
  kKL: [NvenueAtBatOutcomeState.KL], // Strike Looking
  kKS: [NvenueAtBatOutcomeState.KS], // Strike Swinging
  oBI: ['Hitter Interference'], // Hitter Interference
  oDT2: [NvenueAtBatOutcomeState.X2], // Double - Tagged out at 2nd
  oDT3: [NvenueAtBatOutcomeState.X2], // Double - Out at 3rd
  oDT4: [NvenueAtBatOutcomeState.X2], // Double - Out at Home
  oFC: ['Fielders Choice'], // Fielders Choice
  oFCT2: ['Fielders Choice - Out at 2nd'], // Fielders Choice - Out at 2nd
  oFCT3: ['Fielders Choice - Out at 3rd'], // Fielders Choice - Out at 3rd
  oFCT4: ['Fielders Choice - Out at Home'], // Fielders Choice - Out at Home
  oFO: [NvenueAtBatOutcomeState.FO], // Fly Out
  oGO: [NvenueAtBatOutcomeState.GO], // Ground Out
  oKLT1: [NvenueAtBatOutcomeState.KL], // Strike Looking - Out at 1st
  oKLT2: [NvenueAtBatOutcomeState.KL], // Strike Looking - Out at 2nd
  oKLT3: [NvenueAtBatOutcomeState.KL], // Strike Looking - Out at 3rd
  oKLT4: [NvenueAtBatOutcomeState.KL], // Strike Looking - Out at Home
  oKST1: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Out at 1st
  oKST2: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Out at 2nd
  oKST3: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Out at 3rd
  oKST4: [NvenueAtBatOutcomeState.KS], // Strike Swinging - Out at Home
  oLO: [NvenueAtBatOutcomeState.OUT], // Line Out
  oOBB: [NvenueAtBatOutcomeState.OUT], // Out of Batters Box
  oOP: [NvenueAtBatOutcomeState.OUT], // Out on Appeal
  oPO: [NvenueAtBatOutcomeState.OUT], // Pop Out
  oROET2: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Out at 2nd
  oROET3: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Out at 3rd
  oROET4: [NvenueAtBatOutcomeState.REACH], // Reached On Error - Out at Home
  oSB: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt
  oSBT2: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Out at 2nd
  oSBT3: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Out at 3rd
  oSBT4: [NvenueAtBatOutcomeState.BI], // Sacrifice Bunt - Out at Home
  oSF: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly
  oSFT2: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Out at 2nd
  oSFT3: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Out at 3rd
  oSFT4: [NvenueAtBatOutcomeState.FO], // Sacrifice Fly - Out at Home
  oST1: [NvenueAtBatOutcomeState.X1], // Single - Tagged out at 1st
  oST2: [NvenueAtBatOutcomeState.X1], // Single - Out at 2nd
  oST3: [NvenueAtBatOutcomeState.X1], // Single - Out at 3rd
  oST4: [NvenueAtBatOutcomeState.X1], // Single - Out at Home
  oTT3: [NvenueAtBatOutcomeState.X3], // Triple - Tagged out at 3rd
  oTT4: [NvenueAtBatOutcomeState.X3], // Triple - Out at Home
  rPABC: ['Ruling Pending, At Bat Continues'], // Ruling Pending, At Bat Continues
  rPABO: ['Ruling Pending, At Bat Over'], // Ruling Pending, At Bat Over
}