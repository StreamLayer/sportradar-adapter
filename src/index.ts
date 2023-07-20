import pino, { Logger, LoggerOptions } from "pino"

import { PushData } from "./models/sportradar/basketball/push-data";

import { Subscriber } from "./stream/subscriber"
import { BasketballService } from "./services/basketball.service";
import { TransferQueue } from "./services/transfer.queue";
import * as fs from "fs";
import * as path from "path";

require('dotenv').config()

const log = pino({
    transport: {
        target: 'pino-pretty'
    },
    name: "nba",
    level: "debug"
} as LoggerOptions) as Logger

const transferQueue = new TransferQueue(log, {
    times: 10,
    interval: 200,
    url: process.env.TRIGGER_API_URL,
    digestApiKey: process.env.TRIGGER_API_KEY,
    digestAlgorithm: 'sha256',
    digestHeader: 'X-Custom-Digest'
})

const basketballService = new BasketballService()
const basketballSubscriber = new Subscriber(log, {
    reconnectTimeout: 1000,
    apiUrl: process.env.PROVIDER_API_URL,
    apiKey: process.env.PROVIDER_API_KEY
})

const date = new Date()
// Generate a timestamp string from the date.
const timestamp = date.toISOString().replace(/:/g, "-");
// Create the filename using the timestamp.
const filename = `stream_${timestamp}.txt`;
const filePath = path.join(__dirname, `../dumps/${filename}`);

basketballSubscriber.on("data", (data: PushData) => {
    log.debug(data, "raw data received")
    fs.appendFileSync(filePath, JSON.stringify(data) + '\n');
    if (!data.heartbeat ) {
        const events = basketballService.createEvents(data)
        transferQueue.push(events)
    }
})

basketballSubscriber.on("error", (err) => {
    log.error(err)
})

basketballSubscriber.start()


