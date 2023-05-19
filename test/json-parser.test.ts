
import assert = require("assert")
import * as fs from "fs"
import Parser = require("jsonparse")

describe(`JsonParser`, () => {
    it(`should parse stream of push events`, async () => {    
        const parser = new Parser()
        let count = 0
        const pushEvents = fs.readFileSync("data/NBA_v7_Push_Events_Example.json")
        parser.onValue = function(value) {
            if ( this.key == null ) {
                count++
                console.log(value)
            }
        }
        parser.write(pushEvents.toString())
        assert.ok(count > 0)
    })
})


