import pino, { Logger, LoggerOptions } from "pino"

import { PushData } from "./interfaces/push-data";
import { Game as BasketBallGame } from "./models/sportradar/basketball/game";
import { Event as BasketBallEvent } from "./models/sportradar/basketball/event";
import { Game as BaseBallGame } from "./models/sportradar/baseball/game";
import { Event as BaseBallEvent } from "./models/sportradar/baseball/event";

import { Subscriber } from "./stream/subscriber"
import { BasketballService } from "./services/basketball.service";
import { BaseballService } from "./services/baseball.service";
import { TransferQueue } from "./services/transfer.queue";
import * as fs from "fs";
import * as path from "path";

require('dotenv').config()

const log = pino({
    transport: {
        target: 'pino-pretty'
    },
    name: "sportradar",
    level: "debug"
} as LoggerOptions) as Logger

const transferQueue = new TransferQueue(log, {
    times: 10,
    interval: 200,
    url: process.env.TRIGGER_API_URL,
    accessToken: process.env.TRIGGER_ACCESS_TOKEN,
    secret: process.env.TRIGGER_SECRET
})

const streams = {
    basketball: new Subscriber(log, {
        reconnectTimeout: 1000,
        apiUrl: process.env.PROVIDER_BASKETBALL_API_URL,
        apiKey: process.env.PROVIDER_BASKETBALL_API_KEY
    }),
    baseball: new Subscriber(log, {
        reconnectTimeout: 1000,
        apiUrl: process.env.PROVIDER_BASEBALL_API_URL,
        apiKey: process.env.PROVIDER_BASEBALL_API_KEY
    })
}

const services = {
    basketball: new BasketballService(),
    baseball: new BaseballService()
}

// dump stream while learning
const date = new Date()
const timestamp = date.toISOString().replace(/:/g, "-");
const filename = `stream_baseball_${timestamp}.txt`;
const eventsFilename = `events_baseball_${timestamp}.txt`;
const filePath = path.join(__dirname, `../dumps/${filename}`);
const eventsFilePath = path.join(__dirname, `../dumps/${eventsFilename}`);

streams.basketball
    .on("data", (data: PushData<BasketBallGame, BasketBallEvent>) => {
        log.debug(data, "basketball raw data received")
        // fs.appendFileSync(filePath, JSON.stringify(data) + '\n');
        if (!data.heartbeat) {
            const events = services.basketball.createEvents(data)
            log.debug({ events }, 'standard events generated')
            transferQueue.push(events)
        }
    })
    .on("error", (err) => {
        log.error(err, 'error occurred while reading basketball stream')
    })
    .start()

streams.baseball
    .on("data", (data: PushData<BaseBallGame, BaseBallEvent>) => {
        log.debug(data, "baseball raw data received")
        //fs.appendFileSync(filePath, JSON.stringify(data) + '\n');
        if (!data.heartbeat) {
            const events = services.baseball.createEvents(data)
            //fs.appendFileSync(eventsFilePath, JSON.stringify(events) + '\n');
            log.debug({ events }, 'standard events generated')
            transferQueue.push(events)
        }
    })
    .on("error", (err) => {
        log.error(err, 'error occurred while reading basketball stream')
    })
    .start()