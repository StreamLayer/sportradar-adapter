import { AdapterEvent } from "../models/triggers/adapter-event";
import { GameState, PitchOutcomeState, InningHalf, PitchSpeedState, PitchTypeState, AtBatOutcomeState } from "../interfaces/baseball-interfaces";
import { MlbData, MlbPitchOutcomes, MlbPlayer, MlbEvent, MlbGameStatus, MlbEventType } from "../models/sportradar/baseball/mlb-interfaces";
import { BaseballEvents } from "../models/triggers/baseball/baseball-events";
import _ = require("lodash");

export class BaseballService {
    private datasource: string = "sportradar";
    private sport: string = "baseball";
    private scope: string = "game";

    constructor() { }

    createEvents(data: MlbData): AdapterEvent[] {
        if (data.heartbeat) {
            return [];
        }

        const options: Record<string, string | number>[] = [];

        options.push(...this.getGameLevelOptions(data));
        options.push(...this.getPitchOptions(data.event));
        options.push(...this.getTeamOrPlayerBatterOptions(data));
        options.push(...this.getTeamOrPlayerPitcherOptions(data));
        options.push(...this.getTeamOrPlayerScoreOptions(data));
        options.push(...this.getTeamWinOrLossOptions(data));

        const event = this.getDefaultEvent(data);
        for (const extras of options) {
            if (extras) {
                _.merge(event.options, extras);
            }
        }

        return [event];
    }

    private getDefaultEvent(data: MlbData): AdapterEvent {
        const { game, event } = data;
        const dt = new Date(event.created_at);

        const options = {
            [BaseballEvents.InningNumber]: event.inning.toString(),
            [BaseballEvents.InningHalf]: this.mapInningHalf(event.inning_half),
            [BaseballEvents.PlayerBatter]: event.hitter_id,
            [BaseballEvents.PlayerPitcher]: event.pitcher.id,
            [BaseballEvents.TeamBatter]: event.inning_half === 'T' ? game.away.id : game.home.id,
            [BaseballEvents.TeamPitcher]: event.inning_half === 'T' ? game.home.id : game.away.id,
            [BaseballEvents.ScoreHome]: game.home.runs.toString(),
            [BaseballEvents.ScoreAway]: game.away.runs.toString(),
            [BaseballEvents.GameStrikes]: event.count?.strikes?.toString() ?? '',
            [BaseballEvents.GameBalls]: event.count?.balls?.toString() ?? '',
            [BaseballEvents.GameOuts]: event.count?.outs?.toString() ?? '',
            [BaseballEvents.GamePitches]: event.count?.pitch_count?.toString() ?? '',
            [BaseballEvents.ScoreDifferential]: Math.abs(game.home.runs - game.away.runs).toString(),
            [BaseballEvents.AtBatOutcomes]: this.mapAtBatOutcome(event),
        };

        const defaultEvent: AdapterEvent = {
            id: event.id,
            datasource: this.datasource,
            sport: this.sport,
            scope: this.scope,
            scopeId: game.id,
            timestamp: dt.getTime(),
            options
        };

        return defaultEvent;
    }

    private getGameLevelOptions(data: MlbData): Record<string, string>[] {
        const { game, event } = data;
        const extraOptions: Record<string, string> = {};

        if (game.status === MlbGameStatus.InProgress
            && event.inning === 1
            && event.inning_half === 'T') {
            extraOptions[BaseballEvents.GameLevel] = GameState.GameStart;
        } else if (game.status === MlbGameStatus.Complete) {
            extraOptions[BaseballEvents.GameLevel] = GameState.GameEnd;
        }

        return Object.keys(extraOptions).length > 0 ? [extraOptions] : [];
    }

    private getPitchOptions(event: MlbEvent): Record<string, string>[] {
        const result = [];
        let pitchOutcomes = [];

        if (event.type === MlbEventType.Pitch) {
            const options: Record<string, string> = {
                [BaseballEvents.PitchSpeed]: this.mapPitchSpeed(event),
                [BaseballEvents.PitchType]: this.mapPitchType(event),
                [BaseballEvents.PitchZone]: event?.pitcher?.pitch_zone.toString() || '',
                [BaseballEvents.PitchX]: event?.pitcher?.pitch_x.toString() || '',
                [BaseballEvents.PitchY]: event?.pitcher?.pitch_y.toString() || ''
            };

            if (event?.pitcher?.pitch_speed) {
                if (event.pitcher.pitch_speed > 90) {
                    pitchOutcomes.push(PitchOutcomeState.GT90);
                }

                if (event.pitcher.pitch_speed < 80) {
                    pitchOutcomes.push(PitchOutcomeState.LT80);
                }
            }

            if (MlbPitchOutcomes[event.outcome_id as keyof typeof MlbPitchOutcomes]) {
                pitchOutcomes = [...pitchOutcomes, MlbPitchOutcomes[event.outcome_id as keyof typeof MlbPitchOutcomes]];
            }

            options[BaseballEvents.PitchOutcomes] = pitchOutcomes.join(',');
            result.push(options);
        }

        return result;
    }

    private getTeamOrPlayerBatterOptions(data: MlbData): Record<string, string>[] {
        const { game, event } = data;
        const result = [];

        if (event.type === MlbEventType.AtBat) {
            const options: Record<string, string> = {};
            options[BaseballEvents.PlayerBatter] = event.hitter.id;
            options[BaseballEvents.TeamBatter] = event.inning_half === 'T' ? game.away.id : game.home.id;
            result.push(options);
        }

        return result;
    }

    private getTeamOrPlayerPitcherOptions(data: MlbData): Record<string, string>[] {
        const { game, event } = data;
        const result = [];

        if (event.type === MlbEventType.Pitch) {
            const options: Record<string, string> = {};
            options[BaseballEvents.PlayerPitcher] = event.pitcher.id;
            options[BaseballEvents.TeamPitcher] = event.inning_half === 'T' ? game.home.id : game.away.id;
            result.push(options);
        }

        return result;
    }

    private getTeamOrPlayerScoreOptions(data: MlbData): Record<string, string>[] {
        const { game, event } = data;
        const result = [];

        if (event.type === MlbEventType.AtBat || event.type === MlbEventType.Pitch) {
            const options: Record<string, string> = {};
            options[BaseballEvents.ScoreHome] = game.home.runs.toString();
            options[BaseballEvents.ScoreAway] = game.away.runs.toString();
            result.push(options);
        }

        return result;
    }

    private getTeamWinOrLossOptions(data: MlbData): Record<string, string>[] {
        const { game } = data;
        const result = [];

        if (game.status === MlbGameStatus.Complete) {
            const teams = [
                { id: game.home.id, runs: game.home.runs },
                { id: game.away.id, runs: game.away.runs }
            ];
            const [lost, won] = _.sortBy(teams, 'runs');

            if (lost) {
                const options: Record<string, string> = {
                    [BaseballEvents.TeamLoss]: lost.id,
                    [BaseballEvents.Team]: lost.id
                };
                result.push(options);
            }

            if (won) {
                const options: Record<string, string> = {
                    [BaseballEvents.TeamWin]: won.id,
                    [BaseballEvents.Team]: won.id
                };
                result.push(options);
            }
        }

        return result;
    }

    private mapInningHalf(inning_half: 'T' | 'B'): string {
        return inning_half === 'T' ? InningHalf.Top : InningHalf.Bottom;
    }

    private mapPitchOutcome(description?: string): string {
        if (!description) return PitchOutcomeState.Ball;
        return PitchOutcomeState[description as keyof typeof PitchOutcomeState] || description;
    }

    private mapPitchSpeed(event: MlbEvent): string {
        const speed = event?.pitcher?.pitch_speed;
        if (speed > 99) return PitchSpeedState.GT99;
        if (speed >= 96) return PitchSpeedState.B96_99;
        if (speed >= 90) return PitchSpeedState.B90_95;
        if (speed >= 80) return PitchSpeedState.B80_89;

        return PitchSpeedState.LT80;
    }

    private mapPitchType(event: MlbEvent): string {
        return PitchTypeState[event?.pitcher?.pitch_type as keyof typeof PitchTypeState] || event.pitcher.pitch_type || '';
    }

    private mapAtBatOutcome(event: MlbEvent): string {
        if (!event.outcome_id) return AtBatOutcomeState.OUT;
        return AtBatOutcomeState[event.outcome_id as keyof typeof AtBatOutcomeState] || event.outcome_id;
    }
}
