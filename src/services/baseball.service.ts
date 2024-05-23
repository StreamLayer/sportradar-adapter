import { AdapterEvent } from "../models/triggers/adapter-event";
import { GameState, PitchOutcomeState, InningHalf, PitchSpeedState, PitchTypeState, AtBatOutcomeState } from "../interfaces/baseball-interfaces";
import { MlbData, MlbPitchOutcomes, MlbEvent, MlbGameStatus, MlbEventType } from "../models/sportradar/baseball/mlb-interfaces";
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


        if (event.type === MlbEventType.Pitch) {
            const options: Record<string, string> = {
                [BaseballEvents.PitchSpeed]: this.mapPitchSpeed(event),
                [BaseballEvents.PitchType]: this.mapPitchType(event),
                [BaseballEvents.PitchZone]: event?.pitcher?.pitch_zone.toString() || '',
                [BaseballEvents.PitchX]: event?.pitcher?.pitch_x.toString() || '',
                [BaseballEvents.PitchY]: event?.pitcher?.pitch_y.toString() || ''
            };

            options[BaseballEvents.PitchOutcomes] = this.mapPitchOutcomes(event)

            result.push(options);
        }

        return result
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

    private mapPitchOutcomes(event: MlbEvent): string {
        let pitchOutcomes: PitchOutcomeState[] = [];

        if (event?.pitcher?.pitch_speed) {
            if (event.pitcher.pitch_speed > 90) {
                pitchOutcomes.push(PitchOutcomeState.GT90);
            }

            if (event.pitcher.pitch_speed < 80) {
                pitchOutcomes.push(PitchOutcomeState.LT80);
            }
        }

        if (event?.outcome_id) {
            const outcomeMap: { [key in MlbPitchOutcomes]?: PitchOutcomeState } = {
                // 'Ball' > ball
                [MlbPitchOutcomes.bB]: PitchOutcomeState.Ball,
                // 'Strike Looking' > strike looking
                [MlbPitchOutcomes.kKL]: PitchOutcomeState.StrikeLooking,
                // 'Strike Swinging' > strike swinging
                [MlbPitchOutcomes.kKS]: PitchOutcomeState.StrikeSwinging,
                // 'Foul Ball' > foul
                [MlbPitchOutcomes.kF]: PitchOutcomeState.Foul,
                // 'Foul Tip' > foul
                [MlbPitchOutcomes.kFT]: PitchOutcomeState.Foul,
                // 'Enforced Strike' > strikeout
                [MlbPitchOutcomes.kAK]: PitchOutcomeState.Strikeout,
                // 'Strike Swinging - Adv 1st' > inplay reach
                [MlbPitchOutcomes.aKSAD1]: PitchOutcomeState.InplayReach,
                // 'Strike Swinging - Adv 2nd' > inplay reach
                [MlbPitchOutcomes.aKSAD2]: PitchOutcomeState.InplayReach,
                // 'Strike Swinging - Adv 3rd' > inplay reach
                [MlbPitchOutcomes.aKSAD3]: PitchOutcomeState.InplayReach,
                // 'Strike Swinging - Adv Home' > inplay reach
                [MlbPitchOutcomes.aKSAD4]: PitchOutcomeState.InplayReach,
                // 'Strike Looking - Adv 1st' > inplay reach
                [MlbPitchOutcomes.aKLAD1]: PitchOutcomeState.InplayReach,
                // 'Strike Looking - Adv 2nd' > inplay reach
                [MlbPitchOutcomes.aKLAD2]: PitchOutcomeState.InplayReach,
                // 'Strike Looking - Adv 3rd' > inplay reach
                [MlbPitchOutcomes.aKLAD3]: PitchOutcomeState.InplayReach,
                // 'Strike Looking - Adv Home' > inplay reach
                [MlbPitchOutcomes.aKLAD4]: PitchOutcomeState.InplayReach,
                // 'Ball in Play' > ball in play
                [MlbPitchOutcomes.aS]: PitchOutcomeState.BallInPlay,
                [MlbPitchOutcomes.aD]: PitchOutcomeState.BallInPlay,
                [MlbPitchOutcomes.aT]: PitchOutcomeState.BallInPlay,
                [MlbPitchOutcomes.aHR]: PitchOutcomeState.BallInPlay,
                [MlbPitchOutcomes.aROE]: PitchOutcomeState.BallInPlay,
                // 'Out' > inplay out
                [MlbPitchOutcomes.oLO]: PitchOutcomeState.InlpayOut,
                [MlbPitchOutcomes.oGO]: PitchOutcomeState.InlpayOut,
                [MlbPitchOutcomes.oFO]: PitchOutcomeState.InlpayOut,
                [MlbPitchOutcomes.oPO]: PitchOutcomeState.InlpayOut,
            };

            const mappedOutcome = outcomeMap[event.outcome_id];
            if (mappedOutcome) {
                pitchOutcomes.push(mappedOutcome);
            }
        }

        return pitchOutcomes.join(',');
    }

    private mapPitchSpeed(event: MlbEvent): string {
        const speed = event?.pitcher?.pitch_speed;
        if (speed > 99) {
            return PitchSpeedState.GT99
        }
        if (speed >= 96) {
            return PitchSpeedState.B96_99
        }
        if (speed >= 90) {
            return PitchSpeedState.B90_95
        }
        if (speed >= 80) {
            return PitchSpeedState.B80_89
        }

        return PitchSpeedState.LT80
    }

    private mapPitchType(event: MlbEvent): string {
        // pitch_type from raw events [SL, FA, CH, CU, CT]
        return PitchTypeState[event?.pitcher?.pitch_type] || event.pitcher.pitch_type || ''
    }

    private mapAtBatOutcome(event: MlbEvent): AtBatOutcomeState | '' | MlbPitchOutcomes {
        if (!event.outcome_id) {
            return '';
        }

        const outcomeMap: { [key in MlbPitchOutcomes]?: AtBatOutcomeState } = {
            // 'Double' > double
            [MlbPitchOutcomes.aD]: AtBatOutcomeState.X2,
            // 'Double - Adv 3rd' > double
            [MlbPitchOutcomes.aDAD3]: AtBatOutcomeState.X2,
            // 'Double - Adv Home' > double
            [MlbPitchOutcomes.aDAD4]: AtBatOutcomeState.X2,
            // 'Hit By Pitch' > hit by pitch
            [MlbPitchOutcomes.aHBP]: AtBatOutcomeState.HBP,
            // 'Homerun' > home run
            [MlbPitchOutcomes.aHR]: AtBatOutcomeState.HR,
            // 'Intentional Walk' > walk
            [MlbPitchOutcomes.aIBB]: AtBatOutcomeState.BB,
            // 'Strike Looking - Adv 1st' > strikeout looking
            [MlbPitchOutcomes.aKLAD1]: AtBatOutcomeState.KL,
            // 'Strike Looking - Adv 2nd' > strikeout looking
            [MlbPitchOutcomes.aKLAD2]: AtBatOutcomeState.KL,
            // 'Strike Looking - Adv 3rd' > strikeout looking
            [MlbPitchOutcomes.aKLAD3]: AtBatOutcomeState.KL,
            // 'Strike Looking - Adv Home' > strikeout looking
            [MlbPitchOutcomes.aKLAD4]: AtBatOutcomeState.KL,
            // 'Strike Swinging - Adv 1st' > strikeout swinging
            [MlbPitchOutcomes.aKSAD1]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Adv 2nd' > strikeout swinging
            [MlbPitchOutcomes.aKSAD2]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Adv 3rd' > strikeout swinging
            [MlbPitchOutcomes.aKSAD3]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Adv Home' > strikeout swinging
            [MlbPitchOutcomes.aKSAD4]: AtBatOutcomeState.KS,
            // 'Reached On Error' > reach base
            [MlbPitchOutcomes.aROE]: AtBatOutcomeState.REACH,
            // 'Reached On Error - Adv 2nd' > reach base
            [MlbPitchOutcomes.aROEAD2]: AtBatOutcomeState.REACH,
            // 'Reached On Error - Adv 3rd' > reach base
            [MlbPitchOutcomes.aROEAD3]: AtBatOutcomeState.REACH,
            // 'Reached On Error - Adv Home' > reach base
            [MlbPitchOutcomes.aROEAD4]: AtBatOutcomeState.REACH,
            // 'Single' > single
            [MlbPitchOutcomes.aS]: AtBatOutcomeState.X1,
            // 'Single - Adv 2nd' > single
            [MlbPitchOutcomes.aSAD2]: AtBatOutcomeState.X1,
            // 'Single - Adv 3rd' > single
            [MlbPitchOutcomes.aSAD3]: AtBatOutcomeState.X1,
            // 'Single - Adv Home' > single
            [MlbPitchOutcomes.aSAD4]: AtBatOutcomeState.X1,
            // 'Sacrifice Bunt - Adv 1st' > bunt
            [MlbPitchOutcomes.aSBAD1]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Adv 2nd' > bunt
            [MlbPitchOutcomes.aSBAD2]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Adv 3rd' > bunt
            [MlbPitchOutcomes.aSBAD3]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Adv Home' > bunt
            [MlbPitchOutcomes.aSBAD4]: AtBatOutcomeState.BI,
            // 'Sacrifice Fly - Adv 1st' > fly out
            [MlbPitchOutcomes.aSFAD1]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Adv 2nd' > fly out
            [MlbPitchOutcomes.aSFAD2]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Adv 3rd' > fly out
            [MlbPitchOutcomes.aSFAD3]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Adv Home' > fly out
            [MlbPitchOutcomes.aSFAD4]: AtBatOutcomeState.FO,
            // 'Triple' > triple
            [MlbPitchOutcomes.aT]: AtBatOutcomeState.X3,
            // 'Triple - Adv Home' > triple
            [MlbPitchOutcomes.aTAD4]: AtBatOutcomeState.X3,
            // 'Fielders Choice' > reach base
            [MlbPitchOutcomes.oFC]: AtBatOutcomeState.REACH,
            // 'Fly Out' > fly out
            [MlbPitchOutcomes.oFO]: AtBatOutcomeState.FO,
            // 'Ground Out' > ground out
            [MlbPitchOutcomes.oGO]: AtBatOutcomeState.GO,
            // 'Strike Looking - Out at 1st' > strikeout looking
            [MlbPitchOutcomes.oKLT1]: AtBatOutcomeState.KL,
            // 'Strike Looking - Out at 2nd' > strikeout looking
            [MlbPitchOutcomes.oKLT2]: AtBatOutcomeState.KL,
            // 'Strike Looking - Out at 3rd' > strikeout looking
            [MlbPitchOutcomes.oKLT3]: AtBatOutcomeState.KL,
            // 'Strike Looking - Out at Home' > strikeout looking
            [MlbPitchOutcomes.oKLT4]: AtBatOutcomeState.KL,
            // 'Strike Swinging - Out at 1st' > strikeout swinging
            [MlbPitchOutcomes.oKST1]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Out at 2nd' > strikeout swinging
            [MlbPitchOutcomes.oKST2]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Out at 3rd' > strikeout swinging
            [MlbPitchOutcomes.oKST3]: AtBatOutcomeState.KS,
            // 'Strike Swinging - Out at Home' > strikeout swinging
            [MlbPitchOutcomes.oKST4]: AtBatOutcomeState.KS,
            // 'Line Out' > out
            [MlbPitchOutcomes.oLO]: AtBatOutcomeState.OUT,
            // 'Pop Out' > out
            [MlbPitchOutcomes.oPO]: AtBatOutcomeState.OUT,
            // 'Sacrifice Bunt' > bunt
            [MlbPitchOutcomes.oSB]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Out at 2nd' > bunt
            [MlbPitchOutcomes.oSBT2]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Out at 3rd' > bunt
            [MlbPitchOutcomes.oSBT3]: AtBatOutcomeState.BI,
            // 'Sacrifice Bunt - Out at Home' > bunt
            [MlbPitchOutcomes.oSBT4]: AtBatOutcomeState.BI,
            // 'Sacrifice Fly' > fly out
            [MlbPitchOutcomes.oSF]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Out at 2nd' > fly out
            [MlbPitchOutcomes.oSFT2]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Out at 3rd' > fly out
            [MlbPitchOutcomes.oSFT3]: AtBatOutcomeState.FO,
            // 'Sacrifice Fly - Out at Home' > fly out
            [MlbPitchOutcomes.oSFT4]: AtBatOutcomeState.FO,
            // 'Ruling Pending, At Bat Continues' > reach base
            [MlbPitchOutcomes.rPABC]: AtBatOutcomeState.REACH,
            // 'Ruling Pending, At Bat Over' > out
            [MlbPitchOutcomes.rPABO]: AtBatOutcomeState.OUT
        };

        return outcomeMap[event.outcome_id] || event.outcome_id;
    }
}
