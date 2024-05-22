import * as fs from "fs";
import Parser = require("jsonparse");
import async from "async";
import assert = require("assert");
import { BaseballService } from "../src/services/baseball.service";
import { PushData } from "../src/interfaces/push-data";
import { Game } from "../src/models/sportradar/baseball/game";
import { Event } from "../src/models/sportradar/baseball/event";
import { NvenueAtBatOutcomeState } from "../src/models/sportradar/baseball/atbatOutcomes";

describe('BaseBallService', function () {

    this.timeout(3_600_000);

    let service: BaseballService;
    let pushEvents: string;

    before(() => {
        service = new BaseballService();
        pushEvents = fs.readFileSync("data/MLB_Push_Events_Example.json", "utf8");
    });

    it('should create stream of standard events', async () => {

        const queue = async.queue((data, cb) => {
            const event = service.createEvents(data as PushData<Game, Event>)
            console.log(JSON.stringify({ data, event }, null, 4))
            setTimeout(() => {
                cb()
            }, 10)
        }, 1)

        const parser = new Parser()
        parser.onValue = function (event) {
            if (this.key == null) {
                queue.push(event)
            }
        }

        parser.write(pushEvents);

        await queue.drain()
    });

    it('should get pitch options correctly', () => {
        let parsedEvents = [];
        const parser = new Parser();
        parser.onValue = function (event) {
            if (this.key == null) {
                parsedEvents.push(event);
            }
        };
        parser.write(pushEvents);

        const data = parsedEvents.find((event: any) => event.payload.event.type === "pitch");

        assert(data)

        const pitchOptions = service["getPitchOptions"](data as PushData<Game, Event>);

        const expectedOptions = {
            "baseball.pitch.speed": data.payload.event.pitcher.pitch_speed.toString(),
            "baseball.pitch.type": data.payload.event.pitcher.pitch_type,
            "baseball.pitch.zone": data.payload.event.pitcher.pitch_zone.toString(),
            "baseball.pitch.x": data.payload.event.pitcher.pitch_x.toString(),
            "baseball.pitch.y": data.payload.event.pitcher.pitch_y.toString(),
            "baseball.pitch.outcomes": NvenueAtBatOutcomeState.KS
        };

        assert.deepStrictEqual(pitchOptions[0], expectedOptions);
    });
});
