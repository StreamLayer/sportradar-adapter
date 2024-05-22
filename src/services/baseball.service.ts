import { EventType } from "../models/sportradar/baseball/event-type"
import { sportRadarAtBatOutcomes } from "../models/sportradar/baseball/atbatOutcomes"
import { PitchOutcome } from "../models/sportradar/baseball/pitchOutcomes"
import { AdapterEvent } from "../models/triggers/adapter-event"
import { PushData } from "../interfaces/push-data"
import { Game } from "../models/sportradar/baseball/game"
import { Event } from "../models/sportradar/baseball/event"
import _ = require("lodash");
import { GameLevel } from "../models/triggers/baseball/game-level"
import { GameStatus } from "../interfaces/game-status"
import { BaseballEvents } from "../models/triggers/baseball/baseball-events"
import { BaseBallTeam } from "../interfaces/baseball-team"

export class BaseballService {

    private datasource: string = "sportradar"
    private sport: string = "baseball"
    private scope: string = "game"

    constructor() { }

    createEvents(data: PushData<Game, Event>): AdapterEvent[] {
        if (data.heartbeat) {
            return []
        }

        const options: Record<string, string>[] = []

        options.push(...this.getGameLevelOptions(data))
        options.push(...this.getPitchOptions(data))
        options.push(...this.getTeamOrPlayerBatterOptions(data))
        options.push(...this.getTeamOrPlayerPitcherOptions(data))
        options.push(...this.getTeamOrPlayerScoreOptions(data))
        options.push(...this.getTeamTimeoutOptions(data))
        options.push(...this.getTeamWinOrLossOptions(data))

        const event = this.getDefaultEvent(data)
        for (const extras of options) {
            if (extras) {
                _.merge(event.options, extras)
            }
        }

        return [event]
    }

    private getDefaultEvent(data: PushData<Game, Event>): AdapterEvent {
        const { game, event } = data.payload
        const dt = new Date(event.created_at)

        const options = {
            [BaseballEvents.InningNumber]: event.inning.toString(),
            [BaseballEvents.InningHalf]: event.inning_half === 'T' ? 'top' : 'bottom',
            [BaseballEvents.PlayerBatter]: event.hitter_id,
            [BaseballEvents.PlayerPitcher]: event.pitcher?.id,
            [BaseballEvents.TeamBatter]: event.inning_half === 'T' ? game.away.id : game.home.id,
            [BaseballEvents.TeamPitcher]: event.inning_half === 'T' ? game.home.id : game.away.id,
            [BaseballEvents.ScoreHome]: game.home.runs.toString(),
            [BaseballEvents.ScoreAway]: game.away.runs.toString(),
            [BaseballEvents.GameStrikes]: event.count?.strikes.toString(),
            [BaseballEvents.GameBalls]: event.count?.balls.toString(),
            [BaseballEvents.GameOuts]: event.count?.outs.toString(),
            [BaseballEvents.GamePitches]: event.count?.pitch_count.toString(),
            [BaseballEvents.ScoreDifferential]: Math.abs(game.home.runs - game.away.runs).toString(),
            [BaseballEvents.AtBatOutcomes]: sportRadarAtBatOutcomes[event.type]?.join(',') || null,
        }

        const defaultEvent: AdapterEvent = {
            id: event.id,
            datasource: this.datasource,
            sport: this.sport,
            scope: this.scope,
            scopeId: game.id,
            timestamp: dt.getTime(),
            options
        }

        return defaultEvent
    }

    private getGameLevelOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { game, event } = data.payload
        const extraOptions: Record<string, string> = {}

        if (game.status === GameStatus.InProgress
            && event.inning === 1
            && event.inning_half === 'T') {
            extraOptions[BaseballEvents.GameLevel] = GameLevel.Start
        } else if (game.status === GameStatus.Complete) {
            extraOptions[BaseballEvents.GameLevel] = GameLevel.End
        }

        return Object.keys(extraOptions).length > 0 ? [extraOptions] : []
    }

    private getPitchOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { event } = data.payload;
        const result = [];
        let pitchOutcomes = [];

        if (event.type === EventType.Pitch) {
            const options: Record<string, string> = {
                [BaseballEvents.PitchSpeed]: event?.pitcher?.pitch_speed?.toString() || '',
                [BaseballEvents.PitchType]: event?.pitcher?.pitch_type || '',
                [BaseballEvents.PitchZone]: event?.pitcher?.pitch_zone?.toString() || '',
                [BaseballEvents.PitchX]: event?.pitcher?.pitch_x?.toString() || '',
                [BaseballEvents.PitchY]: event?.pitcher?.pitch_y?.toString() || ''
            };

            if (event?.pitcher?.pitch_speed) {
                if (event?.pitcher?.pitch_speed > 90) {
                    pitchOutcomes.push(PitchOutcome.GT90);
                }

                if (event?.pitcher?.pitch_speed < 80) {
                    pitchOutcomes.push(PitchOutcome.LT80);
                }
            }

            if (sportRadarAtBatOutcomes[event.outcome_id]) {
                pitchOutcomes = [...pitchOutcomes, ...sportRadarAtBatOutcomes[event.outcome_id]];
            }

            options[BaseballEvents.PitchOutcomes] = pitchOutcomes.join(',');
            result.push(options);
        }

        return result;
    }

    private getTeamOrPlayerBatterOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { game, event } = data.payload
        const result = []

        if (event.type === EventType.AtBat) {
            const options: Record<string, string> = {}
            options[BaseballEvents.PlayerBatter] = event.hitter.id
            options[BaseballEvents.TeamBatter] = event.inning_half === 'T' ? game.away.id : game.home.id
            result.push(options)
        }

        return result
    }

    private getTeamOrPlayerPitcherOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { game, event } = data.payload
        const result = []

        if (event.type === EventType.Pitch) {
            const options: Record<string, string> = {}
            options[BaseballEvents.PlayerPitcher] = event.pitcher.id
            options[BaseballEvents.TeamPitcher] = event.inning_half === 'T' ? game.home.id : game.away.id
            result.push(options)
        }

        return result
    }

    private getTeamOrPlayerScoreOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { game, event } = data.payload
        const result = []

        // scoring can be derived from atbat or pitch outcomes ?
        if (event.type === EventType.AtBat || event.type === EventType.Pitch) {
            const options: Record<string, string> = {}
            options[BaseballEvents.ScoreHome] = game.home.runs.toString()
            options[BaseballEvents.ScoreAway] = game.away.runs.toString()
            result.push(options)
        }

        return result
    }

    private getTeamTimeoutOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { event } = data.payload
        const result = []

        if (event.type === EventType.Timeout) {
            // Assuming event has 'attribution' property
            const team = event.attribution as BaseBallTeam
            if (team) {
                const options: Record<string, string> = {
                    [BaseballEvents.TeamTimeout]: team.id,
                    [BaseballEvents.Team]: team.id
                }
                result.push(options)
            }
        }

        return result
    }

    private getTeamWinOrLossOptions(data: PushData<Game, Event>): Record<string, string>[] {
        const { game } = data.payload
        const result = []

        if (game.status === GameStatus.Complete) {
            const teams = [
                { id: game.home.id, runs: game.home.runs },
                { id: game.away.id, runs: game.away.runs }
            ]
            const [lost, won] = _.sortBy(teams, 'runs')

            if (lost) {
                const options: Record<string, string> = {
                    [BaseballEvents.TeamLoss]: lost.id,
                    [BaseballEvents.Team]: lost.id
                }
                result.push(options)
            }

            if (won) {
                const options: Record<string, string> = {
                    [BaseballEvents.TeamWin]: won.id,
                    [BaseballEvents.Team]: won.id
                }
                result.push(options)
            }
        }

        return result
    }
}
