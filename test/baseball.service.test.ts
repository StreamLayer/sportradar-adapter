
import * as fs from "fs"
import Parser = require("jsonparse")
import async from "async"
import { BaseballService } from "../src/services/baseball.service";
import { PushData } from "../src/models/sportradar/baseball/push-data";

describe(`BasketballService`, function() {

    this.timeout(3_600_000)

    it(`should create stream of standard events`, async () => {

        const service = new BaseballService()
        const queue = async.queue((data, cb) => {
            console.log(JSON.stringify(data, null, 4))
            const event = service.createEvents(data as PushData)
            console.log(JSON.stringify(event, null, 4))
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

        const pushEvents = fs.readFileSync("data/MLB_v7_Push_Events_Example.json")
        parser.write(pushEvents.toString())

        await queue.drain()
    })
})


