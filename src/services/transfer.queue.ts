import async, { QueueObject } from "async";
import { AdapterEvent } from "../models/triggers/adapter-event";
import { Logger } from "pino";
import crypto from "crypto";
import axios, { AxiosError } from "axios";

export interface Options {
    times: number
    interval: number
    url: string
    digestAlgorithm: string
    digestApiKey: string
    digestHeader: string
}

export class TransferQueue {

    private queue: QueueObject<AdapterEvent>

    constructor(
        private log: Logger,
        private options: Options
    ) {
        this.queue = async.queue((event: AdapterEvent, next) => {
            this.log.debug(event, "submitting adapter event")
            async.retry({
                ...options,
                errorFilter: function(err: AxiosError) {
                    if (err.isAxiosError) {
                        // do not retry in case authentication failure
                        if ( err.status == 401 ) {
                            return false
                        }
                    }
                    return true
                }
            }, (done) => {
                this.send(event)
                    .then(() => done())
                    .catch(err => done(err))
            }, (err, result) => {
                if (err) {
                    this.log.fatal({ err }, `retry failed`)
                }
                next(err)
            });
        }, 1)
    }

    push(events: AdapterEvent[]) {
        for(const event of events) {
            this.queue.push(event, () => {})
        }
    }

    private async send(event: AdapterEvent)  {
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


}
