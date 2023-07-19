import axios, { AxiosResponse } from 'axios';
import { EventEmitter, Readable } from 'stream';
import { Logger } from "pino"
import { Defer } from '../util/defer';

const Parser = require("jsonparse");

export class Subscriber<T> extends EventEmitter {

    private jsonParser
    private looped: boolean = true
    private readable?: Readable

    constructor(
        private log: Logger,
        private options: {
            apiUrl: string,
            apiKey: string,
            reconnectTimeout: number,
        }
    ) {
        super()
        const emitter = this
        this.jsonParser = new Parser()
        this.jsonParser.onValue = function (value) {
            // noinspection JSPotentiallyInvalidUsageOfClassThis
            if (this.key == null) {
                emitter.emit("event", value)
            }
        }
    }

    private async getStreamUrl() {

        const res: AxiosResponse = await axios.get(this.options.apiUrl, {
            params: { 'api_key': this.options.apiKey },
            maxRedirects: 0,
            validateStatus: function (status: number) {
                return status >= 200 && status < 303;
            },
        })

        return res.headers.location;
    }

    private backoff(delay: number) {
        return new Promise((r) => setTimeout(r, delay))
    }

    private async connect() {

        const deferred = new Defer()
        const streamUrl = await this.getStreamUrl()

        this.log.debug({ streamUrl }, "connecting...")

        const response: AxiosResponse = await axios.get(streamUrl, { responseType: 'stream' })
        this.readable = Readable.from(response.data as NodeJS.ReadableStream)
        this.readable.on('data', (chunk: Buffer) => {
            if (chunk) {
                this.jsonParser.write(chunk)
            }
        })
        this.readable.on("close", () => {
            this.log.debug("connection closed")
            deferred.resolve()
        })
        this.readable.on("error", (error: Error) => {
            this.log.error(error)
        })

        return deferred.promise
    }

    async start() {
        this.looped = true
        while (this.looped) {
            await this.connect()
            if (this.looped)
                await this.backoff(this.options.reconnectTimeout)
        }
    }

    stop() {
        this.looped = false
        this.readable?.destroy()
    }

    pause() {
        this.readable?.pause()
    }

    resume() {
        this.readable?.resume()
    }

}




