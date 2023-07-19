import pino, { Logger, LoggerOptions } from "pino"
import { Subscriber } from "./stream/subscriber"
import { PushData } from "./models/sportradar/push-data";
import { TriggerService } from "./services/trigger.service";

require('dotenv').config()

const log = pino({
    transport: {
        target: 'pino-pretty'
    },
    name: "nba",
    level: "debug"
} as LoggerOptions) as Logger

const subscriber = new Subscriber<any>(log, {
    reconnectTimeout: 1000,
    apiUrl: process.env.PROVIDER_API_URL,
    apiKey: process.env.PROVIDER_API_KEY
})

const triggerService = new TriggerService(log, {
    times: 10,
    interval: 200,
    url: process.env.TRIGGER_API_URL,
    digestApiKey: process.env.TRIGGER_API_KEY,
    digestAlgorithm: 'sha256',
    digestHeader: 'X-Custom-Digest'
})

subscriber.on("event", (data: PushData) => {
    log.debug(data, "raw event emitted")
    triggerService.submit(data)
        .catch((err) => log.fatal(err))
})

subscriber.start()


