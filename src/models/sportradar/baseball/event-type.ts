export enum EventType {
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
