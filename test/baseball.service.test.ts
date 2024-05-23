import * as fs from 'fs'
import Parser = require('jsonparse')
import async from 'async'
import assert = require('assert')
import { BaseballService } from '../src/services/baseball.service'
import { MlbData } from '../src/interfaces/push-data'
import { PitchOutcomeState, PitchSpeedState } from '../src/interfaces/baseball-interfaces'
import { BaseballEvents } from '../src/models/triggers/baseball/baseball-events'
import { AdapterEvent } from '../src/models/triggers/adapter-event'

describe('BaseballService', function () {

    this.timeout(3_600_000)

    let service: BaseballService
    let pushEvents: string
    let parsedEvents: AdapterEvent[] = []

    before(() => {
        service = new BaseballService()
        pushEvents = fs.readFileSync('data/MLB_Push_Events_Example.json', 'utf8')
    })

    it('should create stream of standard events', async () => {
        const queue = async.queue((data, cb) => {
            const events = service.createEvents(data as MlbData)
            parsedEvents.push(...events)
            console.log(JSON.stringify({ data, event: events }, null, 4))
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

        parser.write(pushEvents)

        await queue.drain()
    })

    it('should map pitch outcomes', () => {
        const event = parsedEvents.find(event =>
            event.options[BaseballEvents.PitchOutcomes]
            && event.options[BaseballEvents.PitchSpeed] === PitchSpeedState.B90_95
        )

        assert.deepStrictEqual(event.options[BaseballEvents.PitchOutcomes], PitchOutcomeState.GT90)
    })

})
