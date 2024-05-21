import { EventType } from "../models/sportradar/baseball/event-type";
import { atbatOutcomes } from "../models/sportradar/baseball/atbatOutcomes";
import { PushData } from "../models/sportradar/baseball/push-data";
import { AdapterEvent } from "../models/triggers/adapter-event";
import { PitchOutcomeState } from "../models/sportradar/baseball/pitchOutcomes";

export class BaseballService {

    private datasource: string = "sportradar"
    private sport: string = "baseball"
    private scope: string = "game"

    constructor() {
    }

    createEvents(data: PushData): AdapterEvent[] {
        if (data.heartbeat) {
            return []
        }

        const { event, game } = data.payload
        const result = {
            "id": event.id,
            "datasource": this.datasource,
            "sport": this.sport,
            "scope": this.scope,
            "scopeId": game.id,
            "timestamp": Date.now(),
            "options": {
                "baseball.inningNumber": event.inning,
                "baseball.inningHalf": event.inning_half === 'T' ? 'top' : 'bottom',
                "baseball.player.batter": event.atbat_id,
                "baseball.player.pitcher": event.hitter_id,
                "baseball.team.batter": event.inning_half === 'T' ? game.away.id : game.home.id,
                "baseball.team.pitcher": event.inning_half === 'T' ? game.home.id : game.away.id,
                "baseball.score.home": game.home.runs,
                "baseball.score.away": game.away.runs,
                "baseball.game.state.strikes": event.count?.strikes,
                "baseball.game.state.balls": event.count?.balls,
                "baseball.game.state.outs": event.count?.outs,
                "baseball.game.state.pitches": event.count?.pitch_count,
                "baseball.score.differential": Math.abs(game.home.runs - game.away.runs),
                'baseball.atbat.outcomes': atbatOutcomes[event.type].join(',') || null,
                'baseball.pitch.outcomes': null,
            }
        }

        let pitchOutcomes = []
        if (event.type === EventType.Pitch) {
            result.options['baseball.pitch.speed'] = event?.pitcher?.pitch_speed
            result.options['baseball.pitch.type'] = event?.pitcher?.pitch_type
            if(event?.pitcher?.pitch_speed) {
                if(event?.pitcher?.pitch_speed > 90) {
                    pitchOutcomes.push(PitchOutcomeState.GT90)
                }

                if(event?.pitcher?.pitch_speed < 80) {
                    pitchOutcomes.push(PitchOutcomeState.LT80)
                }
            }

            pitchOutcomes = [...pitchOutcomes, ...atbatOutcomes[event.type]]
        }

        result.options['baseball.pitch.oucomes'] = pitchOutcomes.join(',')
        // const options: Record<string, string>[] = []

        // options.push(...this.getGameLevelOptions(data))
        // options.push(...this.getTeamOrPlayerDunkOptions(data))
        // options.push(...this.getTeamOrPlayer3FGScoreOptions(data))
        // options.push(...this.getTeamOrPlayer3FGOptions(data))
        // options.push(...this.getTeamOrPlayerScoresPointsOptions(data))
        // options.push(...this.getTeamOrPlayerShootingFoulOptions(data))
        // options.push(...this.getPlayer1FTMadeOptions(data))
        // options.push(...this.getTeamOrPlayer2FTMadeOptions(data))
        // options.push(...this.getTeamTimeoutOptions(data))
        // options.push(...this.getTeamWinOrLossOptions(data))
        // options.push(...this.getTeamFirstBasketOptions(data))

        // const event = this.getDefaultEvent(data)
        // for(const extras of options) {
        //     _.merge(event.options, extras)
        // }

        return [result]
    }

}
