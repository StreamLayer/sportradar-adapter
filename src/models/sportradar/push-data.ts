import { Game } from "./game";
import { Event } from "./event";
import { Metadata } from "./metadata";

export interface Payload {
    game: Game,
    event: Event
}

export interface PushData {
    payload: Payload,
    locale: string,
    metadata: Metadata
}


