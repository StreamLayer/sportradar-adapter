import axios, { AxiosResponse } from 'axios';
import { EventEmitter, Readable } from 'stream';
import pino, { Logger, LoggerOptions } from "pino"
const Parser = require("jsonparse");

export enum Events {
    Document = "document"
}

export class Subscriber<T> extends EventEmitter {

    private jsonParser
    private looped: boolean = true
    private readable?: Readable

    constructor(
        private url: string,
        private key: string,
        private log: Logger
    ) {
        super()
        const emitter = this
        this.jsonParser = new Parser()
        this.jsonParser.onValue = function(value) {
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            if (this.key == null) {
                emitter.emit(Events.Document, value)
            }
        }
    }

    private async getStreamUrl() {

        const res: AxiosResponse = await axios.get(this.url, {
            params: { 'api_key': this.key  },
            maxRedirects: 0
        })

        return res.headers.location;
    }

    private async connect(){

        const deferred: { reject?: Function, resolve?: Function } = {}
        const result = new Promise((resolve, reject) => {
            deferred.reject = reject
            deferred.resolve = resolve
        })

        const streamUrl = await this.getStreamUrl()
        this.log.debug({ streamUrl }, "connecting...")

        const response: AxiosResponse = await axios.get(streamUrl, { responseType: 'stream' });
        this.readable = Readable.from(response.data as NodeJS.ReadableStream);

        this.readable.on('data', (chunk: Buffer) => {
          if (chunk) {
            this.jsonParser.write(chunk)
          }
        });

        this.readable.on("close", () => {
            this.log.debug("connection closed")
            deferred.reject()
        })

        return result
    }

    private async backoff() {
        await new Promise((r) => setTimeout(r, 1000))
    }

    async start() {
        while(this.looped) {
            await this.connect()
            if (this.looped) {
                await this.backoff()
            }
        }
    }

    stop() {
        this.looped = false
        this.readable.destroy()
    }

    pause() {
        this.readable?.pause()
    }

    resume() {
        this.readable?.resume()
    }

}




