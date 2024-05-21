import { Metadata } from "./metadata";


export interface Payload<Game, Event> {
    game: Game,
    event: Event
}

export interface PushData<Game, Event> {
    heartbeat: any,
    payload: Payload<Game, Event>,
    locale: string,
    metadata: Metadata
}


