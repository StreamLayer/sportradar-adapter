
import * as fs from "fs"
import Parser = require("jsonparse")
import async from "async"
import { BasketballService } from "../src/services/basketball.service";
import { PushData } from "../src/interfaces/push-data";
import { Game } from "../src/models/sportradar/basketball/game";
import { Event } from "../src/models/sportradar/basketball/event";

describe(`BasketballService`, function() {

    this.timeout(3_600_000)

    it(`should create stream of standard events`, async () => {

        const service = new BasketballService()
        const queue = async.queue((data, cb) => {
            const event = service.createEvents(data as PushData<Game, Event>)
            setTimeout(() => {
                cb()
            }, 1000)
        }, 1)

        const parser = new Parser()
        parser.onValue = function(event) {
            if ( this.key == null ) {
                queue.push(event)
            }
        }

        const pushEvents = fs.readFileSync("data/NBA_v7_Push_Events_Example.json")
        parser.write(pushEvents.toString())

        await queue.drain()
    })
})


