// https://developer.sportradar.com/baseball/reference/mlb-faq#game-statuses
export enum MlbGameStatus {
    // The game is scheduled to occur.
    Scheduled = 'scheduled',
    // The first pitch for the game has been received.
    InProgress = 'inprogress',
    // The last pitch for the game has been received and statistics are being reviewed.
    Complete = 'complete',
    // The game has passed review and MLB has officially closed the game.
    Closed = 'closed',
    // The game has been delayed because of weather.
    WeatherDelay = 'wdelay',
    // The game has been delayed because of facility issues.
    FacilityDelay = 'fdelay',
    // The game has been delayed.
    OtherDelay = 'odelay',
    // The game has been canceled. No makeup game will be played as a result.
    Canceled = 'canceled',
    // The series game was scheduled to occur, but will not take place due to one team clinching the series early.
    Unnecessary = 'unnecessary',
    // The game will be scheduled if it is required.
    IfNecessary = 'if-necessary',
    // The game has been postponed and will be rescheduled in the future, restarting at the top of the 1st.
    Postponed = 'postponed',
    // The game has been suspended and will be rescheduled in the future, continuing where they left off.
    Suspended = 'suspended',
    // The game is being reviewed internally and having data adjusted.
    Maintenance = 'maintenance'
}

export interface MlbBaseBallTeam {
    name: string,
    market: string,
    abbr: string,
    id: string,
    runs: number,
    hits: number,
    errors: number
}

export interface MlbPlayer {
    id: string
    first_name: string
    last_name: string
    preferred_name: string
    jersey_number: string
    status: string
    hand?: 'R' | 'L' | 'B' // Right, Left, Both
}

export interface MlbGame {
    id: string
    home_team: string
    away_team: string
    away: MlbBaseBallTeam
    home: MlbBaseBallTeam
    status: MlbGameStatus
    reference?: string
    scheduled: string
    coverage: 'full' | 'boxscore'
    double_header: boolean
    day_night: 'D' | 'N'
    entry_mode: 'STOMP' | 'LDE'
    game_number: number
    split_squad?: boolean
    mlb_id: string
}

export enum MlbEventType {
    Pitch = 'pitch', // The last event logged was a pitch
    AtBat = 'atbat',
    EventStart = 'event_start', // The game has begun
    EventOver = 'event_over', // The game is over
    HalfStart = 'half_start', // The last event logged is the start of an inning half
    HalfOver = 'half_over', // The last event logged is half inning is over
    HalfEnd = 'half_end',
    GameEnd = 'game_end',
    Timeout = 'timeout',
    Steal = 'steal', // The last event logged was a steal
    Lineup = 'lineup' // The last event logged was a lineup change
}

export enum MlbEventStatus {
    Official = 'official'
}

export interface Fielder {
    id: string
    type: string
    sequence: number
    first_name: string
    last_name: string
    preferred_name: string
    full_name: string
    jersey_number: string
    status: string
}

export interface Runner {
    id: string
    starting_base: number
    ending_base: number
    outcome_id: string
    out: boolean
    first_name: string
    last_name: string
    preferred_name: string
    full_name: string
    jersey_number: string
    status: string
    description?: string
    fielders?: Fielder[]
}

export interface MlbMetadata {
    league: string
    match: string
    status: string
    inning: number
    inning_half: 'T' | 'B'
    event_type: string
    event_category: string
    locale: string
    operation: string
    version: string
}

export interface MlbEvent {
    id: string
    type: MlbEventType
    inning: number
    inning_half: 'T' | 'B' // Top, Bottom
    sequence_number: number
    sequence: number
    status: MlbEventStatus
    created_at: string
    updated_at?: string
    hitter_id: string
    atbat_id?: string
    outcome_id: keyof typeof MlbPitchOutcomes
    wall_clock?: {
        start_time: string
        end_time: string
    }
    flags?: {
        is_ab_over: boolean
        is_bunt: boolean
        is_bunt_shown: boolean
        is_hit: boolean
        is_wild_pitch: boolean
        is_passed_ball: boolean
        is_double_play: boolean
        is_triple_play: boolean
    }
    count?: {
        balls: number
        strikes: number
        outs: number
        pitch_count: number
    }
    pitcher: {
        // SL, FA, CH, CU, CT
        pitch_type: string
        pitch_speed: number
        pitch_zone: number
        pitch_x: number
        pitch_y: number
        id: string
        pitcher_hand: 'R' | 'L'
        hitter_hand: 'R' | 'L'
        pitch_count: number
        first_name: string
        last_name: string
        preferred_name: string
        full_name: string
        jersey_number: string
        status: string
    }
    hitter: MlbPlayer
    runners?: Runner[]
}

// https://developer.sportradar.com/baseball/reference/mlb-faq#what-are-the-valid-pitch-outcomes-and-their-definitions
export enum MlbPitchOutcomes {
    aBK = 'Balk', // Balk
    aCI = 'Catcher Interference', // Catcher Interference
    aD = 'Double', // Double
    aDAD3 = 'Double - Adv 3rd', // Double - Adv 3rd
    aDAD4 = 'Double - Adv Home', // Double - Adv Home
    aFCAD2 = 'Fielders Choice - Adv 2nd', // Fielders Choice - Adv 2nd
    aFCAD3 = 'Fielders Choice - Adv 3rd', // Fielders Choice - Adv 3rd
    aFCAD4 = 'Fielders Choice - Adv Home', // Fielders Choice - Adv Home
    aHBP = 'Hit By Pitch', // Hit By Pitch
    aHR = 'Homerun', // Homerun
    aIBB = 'Intentional Walk', // Intentional Walk
    aKLAD1 = 'Strike Looking - Adv 1st', // Strike Looking - Adv 1st
    aKLAD2 = 'Strike Looking - Adv 2nd', // Strike Looking - Adv 2nd
    aKLAD3 = 'Strike Looking - Adv 3rd', // Strike Looking - Adv 3rd
    aKLAD4 = 'Strike Looking - Adv Home', // Strike Looking - Adv Home
    aKSAD1 = 'Strike Swinging - Adv 1st', // Strike Swinging - Adv 1st
    aKSAD2 = 'Strike Swinging - Adv 2nd', // Strike Swinging - Adv 2nd
    aKSAD3 = 'Strike Swinging - Adv 3rd', // Strike Swinging - Adv 3rd
    aKSAD4 = 'Strike Swinging - Adv Home', // Strike Swinging - Adv Home
    aROE = 'Reached On Error', // Reached On Error
    aROEAD2 = 'Reached On Error - Adv 2nd', // Reached On Error - Adv 2nd
    aROEAD3 = 'Reached On Error - Adv 3rd', // Reached On Error - Adv 3rd
    aROEAD4 = 'Reached On Error - Adv Home', // Reached On Error - Adv Home
    aS = 'Single', // Single
    aSAD2 = 'Single - Adv 2nd', // Single - Adv 2nd
    aSAD3 = 'Single - Adv 3rd', // Single - Adv 3rd
    aSAD4 = 'Single - Adv Home', // Single - Adv Home
    aSBAD1 = 'Sacrifice Bunt - Adv 1st', // Sacrifice Bunt - Adv 1st
    aSBAD2 = 'Sacrifice Bunt - Adv 2nd', // Sacrifice Bunt - Adv 2nd
    aSBAD3 = 'Sacrifice Bunt - Adv 3rd', // Sacrifice Bunt - Adv 3rd
    aSBAD4 = 'Sacrifice Bunt - Adv Home', // Sacrifice Bunt - Adv Home
    aSFAD1 = 'Sacrifice Fly - Adv 1st', // Sacrifice Fly - Adv 1st
    aSFAD2 = 'Sacrifice Fly - Adv 2nd', // Sacrifice Fly - Adv 2nd
    aSFAD3 = 'Sacrifice Fly - Adv 3rd', // Sacrifice Fly - Adv 3rd
    aSFAD4 = 'Sacrifice Fly - Adv Home', // Sacrifice Fly - Adv Home
    aT = 'Triple', // Triple
    aTAD4 = 'Triple - Adv Home', // Triple - Adv Home
    bAB = 'Enforced Ball', // Enforced Ball
    bB = 'Ball', // Ball
    bDB = 'Dirt Ball', // Dirt Ball
    bIB = 'Intentional Ball', // Intentional Ball
    bPO = 'Pitchout', // Pitchout
    kAK = 'Enforced Strike', // Enforced Strike
    kF = 'Foul Ball', // Foul Ball
    kFT = 'Foul Tip', // Foul Tip
    kKL = 'Strike Looking', // Strike Looking
    kKS = 'Strike Swinging', // Strike Swinging
    oBI = 'Hitter Interference', // Hitter Interference
    oDT2 = 'Double - Tagged out at 2nd', // Double - Tagged out at 2nd
    oDT3 = 'Double - Out at 3rd', // Double - Out at 3rd
    oDT4 = 'Double - Out at Home', // Double - Out at Home
    oFC = 'Fielders Choice', // Fielders Choice
    oFCT2 = 'Fielders Choice - Out at 2nd', // Fielders Choice - Out at 2nd
    oFCT3 = 'Fielders Choice - Out at 3rd', // Fielders Choice - Out at 3rd
    oFCT4 = 'Fielders Choice - Out at Home', // Fielders Choice - Out at Home
    oFO = 'Fly Out', // Fly Out
    oGO = 'Ground Out', // Ground Out
    oKLT1 = 'Strike Looking - Out at 1st', // Strike Looking - Out at 1st
    oKLT2 = 'Strike Looking - Out at 2nd', // Strike Looking - Out at 2nd
    oKLT3 = 'Strike Looking - Out at 3rd', // Strike Looking - Out at 3rd
    oKLT4 = 'Strike Looking - Out at Home', // Strike Looking - Out at Home
    oKST1 = 'Strike Swinging - Out at 1st', // Strike Swinging - Out at 1st
    oKST2 = 'Strike Swinging - Out at 2nd', // Strike Swinging - Out at 2nd
    oKST3 = 'Strike Swinging - Out at 3rd', // Strike Swinging - Out at 3rd
    oKST4 = 'Strike Swinging - Out at Home', // Strike Swinging - Out at Home
    oLO = 'Line Out', // Line Out
    oOBB = 'Out of Batters Box', // Out of Batters Box
    oOP = 'Out on Appeal', // Out on Appeal
    oPO = 'Pop Out', // Pop Out
    oROET2 = 'Reached On Error - Out at 2nd', // Reached On Error - Out at 2nd
    oROET3 = 'Reached On Error - Out at 3rd', // Reached On Error - Out at 3rd
    oROET4 = 'Reached On Error - Out at Home', // Reached On Error - Out at Home
    oSB = 'Sacrifice Bunt', // Sacrifice Bunt
    oSBT2 = 'Sacrifice Bunt - Out at 2nd', // Sacrifice Bunt - Out at 2nd
    oSBT3 = 'Sacrifice Bunt - Out at 3rd', // Sacrifice Bunt - Out at 3rd
    oSBT4 = 'Sacrifice Bunt - Out at Home', // Sacrifice Bunt - Out at Home
    oSF = 'Sacrifice Fly', // Sacrifice Fly
    oSFT2 = 'Sacrifice Fly - Out at 2nd', // Sacrifice Fly - Out at 2nd
    oSFT3 = 'Sacrifice Fly - Out at 3rd', // Sacrifice Fly - Out at 3rd
    oSFT4 = 'Sacrifice Fly - Out at Home', // Sacrifice Fly - Out at Home
    oST1 = 'Single - Tagged out at 1st', // Single - Tagged out at 1st
    oST2 = 'Single - Out at 2nd', // Single - Out at 2nd
    oST3 = 'Single - Out at 3rd', // Single - Out at 3rd
    oST4 = 'Single - Out at Home', // Single - Out at Home
    oTT3 = 'Triple - Tagged out at 3rd', // Triple - Tagged out at 3rd
    oTT4 = 'Triple - Out at Home', // Triple - Out at Home
    rPABC = 'Ruling Pending, At Bat Continues', // Ruling Pending, At Bat Continues
    rPABO = 'Ruling Pending, At Bat Over' // Ruling Pending, At Bat Over
}

// https://developer.sportradar.com/baseball/reference/mlb-faq#what-are-the-valid-outcome-types-and-their-definitions
export enum MlbOutcomeTypes {
    Pitch = 'pitch', // The last event logged was a pitch
    Strikeout = 'strikeout', // The last event logged was a strikeout
    Hit = 'hit', // The last event logged was a hit
    Walk = 'walk', // The last event logged was a walk
    Error = 'error', // The last event logged was an error
    StolenBase = 'stolen_base', // The last event logged was a stolen base
    DoublePlay = 'double_play', // The last event logged was a double play
    TriplePlay = 'triple_play' // The last event logged was a triple play
}

export interface MlbData {
    game: MlbGame,
    event: MlbEvent,
    locale: string,
    metadata: MlbMetadata,
    heartbeat?: any
}
