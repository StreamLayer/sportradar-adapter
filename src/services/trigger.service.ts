import { PushData } from "../models/sportradar/push-data";
import { BasketballEvents } from "../models/triggers/basketball-events";
import { GameStatus } from "../models/sportradar/game-status";
import { EventType } from "../models/sportradar/event-type";
import { GameLevel } from "../models/triggers/game-level";
import { AdapterEvent } from "../models/triggers/adapter-event";
import async, { QueueObject }  from "async";
import { Logger } from "pino";
import crypto from "crypto";
import axios from "axios";

export interface Options {
    times: number
    interval: number
    url: string
    digestAlgorithm: string
    digestApiKey: string
    digestHeader: string
}

export class TriggerService {

    private queue: QueueObject<AdapterEvent>

    constructor(
        private log: Logger,
        private options: Options
    ) {
        this.queue = async.queue((event: AdapterEvent, next) => {
            this.log.debug(event, "submitting adapter event")
            async.retry({ ...options }, (done) => {
                this.send(event)
                    .then(() => done())
                    .catch(err => done(err))
            }, function(err, result) {
                next(err)
            });
        }, 1)
    }

    async submit(pushData: PushData) {
        const adapterEvent = this.createEvent(pushData)
        this.queue.push(adapterEvent, (err) => {})
    }

    private async send(event: AdapterEvent)  {

        // We convert the data and the API key into strings to generate the digest.
        const dataString = JSON.stringify(event)
        const digest = crypto.createHmac(this.options.digestAlgorithm, this.options.digestApiKey)
            .update(dataString)
            .digest('hex');

        const response = await axios({
            method: 'post',
            url: this.options.url,
            data: dataString,
            headers: {
                [this.options.digestHeader]: digest
            }
        })

        if ( response.status !== 200 )
            throw new Error("Http error while pushing event into sl-triggers")
    }

    private createEvent(data: PushData) : AdapterEvent {
        const { payload } = data
        const { game, event } = payload

        const dt = new Date(event.wall_clock)
        const options = {
            [BasketballEvents.GamePointsHome]: event.home_points.toString(),
            [BasketballEvents.GamePointsAway]: event.away_points.toString(),
            [BasketballEvents.Quarter]: event.period.number.toString()
        }

        if (game.status == GameStatus.InProgress
            && event.period.number == 1
            && event.event_type == EventType.OpenTip) {
            options[BasketballEvents.GameLevel] = GameLevel.Start
        }

        options[BasketballEvents.GameLevel] = GameLevel.Start

        const output: AdapterEvent = {
            id: event.id,
            datasource: "sportradar",
            scope: "game",
            scopeId: game.id,
            timestamp: dt.getTime(),
            options
        }

        return output
    }



}
