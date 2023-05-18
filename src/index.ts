import pino, { Logger, LoggerOptions } from "pino"
import { Subscriber, Events } from "./subscriber"

const log =  pino({
    transport: {
        target: 'pino-pretty'
    },
    name: "event.sub",
    level: "debug"
} as LoggerOptions) as Logger

const url = process.env.API_URL
const key = process.env.API_KEY
const subscriber = new Subscriber<any>(url, key, log)

subscriber.on(Events.PushEvent, (event) => {
    log.debug(event, "event emitted")
})

subscriber.start()
