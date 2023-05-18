import pino, { Logger, LoggerOptions } from "pino"
import { Subscriber } from "./subscriber"

const log =  pino({
    transport: {
        target: 'pino-pretty'
    },
    name: "event.sub",
    level: "debug"
} as LoggerOptions) as Logger

const url = "https://api.sportradar.com/nba/simulation/stream/en/events/subscribe"
const key = process.env.API_KEY
const subscriber = new Subscriber<any>(url, key, log)

subscriber.on("event", (event) => {
    log.debug(event, "event emitted")
    // TODO match event and send to SL services
})

subscriber.start()
