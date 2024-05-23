import { MlbMetadata, MlbPayload } from "../models/sportradar/baseball/mlb-interfaces";
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


export interface MlbData {
    heartbeat: any,
    payload: MlbPayload,
    locale: string,
    metadata: MlbMetadata
}