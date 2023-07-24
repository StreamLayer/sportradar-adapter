import { PushData } from "../models/sportradar/basketball/push-data";
import { Event, Statistics } from "../models/sportradar/basketball/event";
import { BasketballEvents } from "../models/triggers/basketball/basketball-events";
import { GameStatus } from "../models/sportradar/basketball/game-status";
import { EventType } from "../models/sportradar/basketball/event-type";
import { GameLevel } from "../models/triggers/basketball/game-level";
import { AdapterEvent } from "../models/triggers/adapter-event";
import { ShotType } from "../models/sportradar/basketball/shot-type";
import { StatType } from "../models/sportradar/basketball/stat-type";
import _ = require("lodash");
import { Qualifier } from "../models/sportradar/basketball/qualifier";
import { Team } from "../models/sportradar/basketball/team";

export class BasketballService {

    private scoreEventTypes = [
        EventType.FreeThrowMade,
        EventType.TwoPointMade,
        EventType.ThreePointMade,
    ]

    constructor() {}

    createEvents(data: PushData) : AdapterEvent[] {

        const result:AdapterEvent[] = []

        result.push(...this.getGameLevelEvents(data))
        result.push(...this.getTeamOrPlayerDunkEvents(data))
        result.push(...this.getTeamOrPlayer3FGScoreEvents(data))
        result.push(...this.getTeamOrPlayer3FGEvents(data))
        result.push(...this.getTeamOrPlayerScoresPointsEvents(data))
        result.push(...this.getTeamOrPlayerShootingFoulEvents(data))
        result.push(...this.getPlayer1FTMadeEvents(data))
        result.push(...this.getTeamOrPlayer2FTMadeEvents(data))
        result.push(...this.getTeamTimeoutEvents(data))
        result.push(...this.getTeamWinOrLossEvent(data))
        result.push(...this.getTeamFirstBasketEvent(data))

        return result
    }

    private getDefaultEvent(data: PushData) {
        const { game, event } = data.payload
        const dt = new Date(event.wall_clock)

        const options = {
            [BasketballEvents.GamePointsHome]: event.home_points.toString(),
            [BasketballEvents.GamePointsAway]: event.away_points.toString(),
            [BasketballEvents.Quarter]: event.period.number.toString()
        }

        const defaultEvent: AdapterEvent = {
            id: event.id,
            datasource: "sportradar",
            scope: "game",
            scopeId: game.id,
            timestamp: dt.getTime(),
            options
        }

        return defaultEvent
    }

    private getGameLevelEvents(data: PushData) : AdapterEvent[]
    {
        const { game, event } = data.payload

        const options = {}

        if (game.status == GameStatus.InProgress
            && event.period.number == 1
            && event.event_type == EventType.OpenTip) {
            options[BasketballEvents.GameLevel] = GameLevel.Start
        }
        else if (game.status == GameStatus.InProgress
            && event.event_type == EventType.EndPeriod) {
            options[BasketballEvents.GameLevel] = GameLevel.QuarterEnd
        }
        else if (game.status == GameStatus.Complete
            || game.status == GameStatus.Cancelled
            || game.status == GameStatus.Closed ) {
            options[BasketballEvents.GameLevel] = GameLevel.End
        }
        // TODO check validity of the approach
        else if (game.status == GameStatus.InProgress
            && event.event_type == EventType.OpenTip) {
            options[BasketballEvents.GameLevel] = GameLevel.HalfStart
        }
        else if (game.status == GameStatus.HalfTime) {
            options[BasketballEvents.GameLevel] = GameLevel.HalfStart
        }

        if ( Object.keys(options).length > 0 ) {
            const event = this.getDefaultEvent(data)
            event.options = {
                ...event.options,
                ...options
            }
            return [ event ]
        } else {
            return []
        }
    }

    private isScoreEvent(event: Event) {
        return this.scoreEventTypes.includes(event.event_type)
    }

    private getTeamOrPlayerDunkEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        const dunks = _.filter(event.statistics ?? [],
            (stat: Statistics) => stat.shot_type == ShotType.Dunk)
        if ( dunks.length > 0 ) {
            for(const stat of dunks ){
                if ( stat.player || stat.team ) {
                    const event = this.getDefaultEvent(data)
                    const extraOptions = {}

                    if ( stat.player ) {
                        extraOptions[BasketballEvents.Player] = stat.player.id
                        extraOptions[BasketballEvents.PlayerDunk] = stat.player.id
                    }

                    if ( stat.team ) {
                        extraOptions[BasketballEvents.Team] = stat.team.id
                        extraOptions[BasketballEvents.TeamDunk] = stat.team.id
                    }

                    event.options = {
                        ...event.options,
                        ...extraOptions
                    }

                    result.push(event)
                }
            }
        }
        return result
    }

    /**
     * @description only successful three-point field goal events (made) which change the score
     */
    private getTeamOrPlayer3FGScoreEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.ThreePointMade) {
            const stats = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.Fieldgoal)
            if ( stats.length > 0 ) {
                for(const stat of stats ){
                    if ( stat.player || stat.team ) {
                        const event = this.getDefaultEvent(data)
                        const extraOptions = {}
                        if ( stat.player ){
                            extraOptions[BasketballEvents.Player3FG] = stat.player.id
                            extraOptions[BasketballEvents.PlayerScoresX3FG] = stat.player.id
                            extraOptions[BasketballEvents.Player] = stat.player.id
                        }
                        if ( stat.team ){
                            extraOptions[BasketballEvents.Team3FG] = stat.team.id
                            extraOptions[BasketballEvents.TeamScores3FG] = stat.team.id
                            extraOptions[BasketballEvents.Team] = stat.team.id
                        }

                        event.options = {
                            ...event.options,
                            ...extraOptions
                        }
                        result.push(event)
                    }
                }
            }
        }
        return result
    }

    /**
     * @description any three-point field goal event regardless of the result (made or missed)
     */
    private getTeamOrPlayer3FGEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.ThreePointMade
            || event.event_type == EventType.ThreePointMiss) {
            const stats = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.Fieldgoal)
            if ( stats.length > 0 ) {
                for(const stat of stats ){
                    if ( stat.player || stat.team ) {
                        const event = this.getDefaultEvent(data)
                        const extraOptions = {}
                        if ( stat.player ){
                            extraOptions[BasketballEvents.Player3FG] = stat.player.id
                            extraOptions[BasketballEvents.Player] = stat.player.id
                        }
                        if ( stat.team ){
                            extraOptions[BasketballEvents.Team3FG] = stat.team.id
                            extraOptions[BasketballEvents.Team] = stat.team.id
                        }
                        event.options = {
                            ...event.options,
                            ...extraOptions
                        }
                        result.push(event)
                    }
                }
            }
        }
        return result
    }

    /**
     * @description successful field goal events (made) which result in a change of the score
     */
    private getTeamOrPlayerScoresPointsEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (this.isScoreEvent(event)) {
            const stats = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.Fieldgoal)
            if ( stats.length > 0 ) {
                for(const stat of stats ){
                    if ( stat.player || stat.team ) {
                        const event = this.getDefaultEvent(data)
                        const extraOptions = {}
                        if ( stat.player ){
                            extraOptions[BasketballEvents.PlayerScoresPoints] = stat.player.id
                            extraOptions[BasketballEvents.Player] = stat.player.id
                        }
                        if ( stat.team ){
                            extraOptions[BasketballEvents.TeamScoresPoints] = stat.team.id
                            extraOptions[BasketballEvents.Team] = stat.team.id
                        }
                        event.options = {
                            ...event.options,
                            ...extraOptions
                        }
                        result.push(event)
                    }
                }
            }
        }
        return result
    }

    /**
     * @description A "Shooting Foul" in an NBA game refers to a situation where a player
     *              is fouled by an opponent while in the act of shooting a field goal (a basket).
     *              Here's a bit more detail:
     *              When a shooting foul is called, the shooter is awarded free throws.
     *              The number of free throws is typically determined by where the player was attempting
     *              to shoot from and whether the shot was successful.
     *              - If a player was fouled while shooting a two-point field goal and missed,
     *              they are awarded two free throws.
     *              - If a player was fouled while shooting a three-point field goal and missed,
     *              they are awarded three free throws.
     *              - If a player was fouled while shooting either a two-point or three-point field
     *              goal and made the shot, they are awarded one free throw, and the field goal counts.
     *              This is often referred to as an "and-one" situation.
     *              The player who committed the foul is charged with a personal foul,
     *              and the team foul count is increased by one. If the team foul count reaches
     *              a certain number in a quarter (in the NBA, it's five), all subsequent non-shooting fouls
     *              by that team in that quarter will result in free throws for the opposing team.
     *              This is referred to as being "in the penalty."
     *              A shooting foul can significantly impact the strategy and outcome of a game,
     *              as it provides a scoring opportunity for the team that was fouled and can lead
     *              to key players being removed from the game if they accumulate too many fouls.
     *
     *              (!! (C) Chat GPT-4, might be erroneous)
     */
    private getTeamOrPlayerShootingFoulEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.ShootingFoul ) {
            // getting a person who was fouled while shooting
            const [ stat ] = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.FoulDrawn)
            if ( stat ) {
                if ( stat.player || stat.team ) {
                    const event = this.getDefaultEvent(data)
                    const extraOptions = {}
                    if ( stat.player ){
                        extraOptions[BasketballEvents.PlayerShootingFoul] = stat.player.id
                        extraOptions[BasketballEvents.Player] = stat.player.id
                    }
                    if ( stat.team ){
                        extraOptions[BasketballEvents.TeamShootingFoul] = stat.team.id
                        extraOptions[BasketballEvents.Team] = stat.team.id
                    }
                    event.options = {
                        ...event.options,
                        ...extraOptions
                    }
                    result.push(event)
                }
            }
        }
        return result
    }

    private getPlayer1FTMadeEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.FreeThrowMade && event.qualifiers?.includes(Qualifier.OneFreeThrow) ) {
            // getting a person who was made "freethrow"
            const [ stat ] = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.FreeThrow)
            if ( stat ) {
                if ( stat.player ) {
                    const event = this.getDefaultEvent(data)
                    const extraOptions = {}
                    if ( stat.player ){
                        extraOptions[BasketballEvents.Player1FTMade] = stat.player.id
                        extraOptions[BasketballEvents.Player] = stat.player.id
                    }
                    event.options = {
                        ...event.options,
                        ...extraOptions
                    }
                    result.push(event)
                }
            }
        }
        return result
    }

    private getTeamOrPlayer2FTMadeEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.FreeThrowMade && event.qualifiers.includes(Qualifier.OneFreeThrow) ) {
            // getting a person who was made "freethrow"
            const [ stat ] = _.filter(event.statistics ?? [],
                (stat: Statistics) => stat.type == StatType.FreeThrow)
            if ( stat ) {
                if ( stat.player || stat.team ) {
                    const event = this.getDefaultEvent(data)
                    const extraOptions = {}
                    if ( stat.player ){
                        extraOptions[BasketballEvents.Player2FTMade] = stat.player.id
                        extraOptions[BasketballEvents.Player] = stat.player.id
                    }
                    if ( stat.team ){
                        extraOptions[BasketballEvents.Team2FTMade] = stat.team.id
                        extraOptions[BasketballEvents.Team] = stat.team.id
                    }
                    event.options = {
                        ...event.options,
                        ...extraOptions
                    }
                    result.push(event)
                }
            }
        }
        return result
    }

    private getTeamTimeoutEvents(data: PushData) {
        const { event } = data.payload
        const result = []
        if (event.event_type == EventType.TeamTimeout) {
            const team = event.attribution as Team
            if ( team ) {
                const event = this.getDefaultEvent(data)
                const extraOptions = {
                    [BasketballEvents.TeamTimeout]: team.id,
                    [BasketballEvents.Team]: team.id
                }
                event.options = {
                    ...event.options,
                    ...extraOptions
                }
                result.push(event)
            }
        }
        return result
    }

    private getTeamWinOrLossEvent(data: PushData) {
        const { game, event } = data.payload
        const result = []

        if (game.status == GameStatus.Complete) {
            const teams = [
                {
                    id: game.home.id,
                    points: game.home.points
                },
                {
                    id: game.away.id,
                    points: game.away.points
                }
            ]
            const [ lost, won ] = _.sortBy(teams, (team) => team.points)

            if ( lost ) {
                const event = this.getDefaultEvent(data)
                const extraOptions = {
                    [BasketballEvents.TeamLoss]: lost.id,
                    [BasketballEvents.Team]: lost.id
                }
                event.options = {
                    ...event.options,
                    ...extraOptions
                }
                result.push(event)
            }

            if ( won ) {
                const event = this.getDefaultEvent(data)
                const extraOptions = {
                    [BasketballEvents.TeamWin]: won.id,
                    [BasketballEvents.Team]: won.id
                }
                event.options = {
                    ...event.options,
                    ...extraOptions
                }
                result.push(event)
            }
        }

        return result
    }

    getTeamFirstBasketEvent(data: PushData) {
        const { game } = data.payload
        const result = []

        if ( game.home && game.away ) {

            if ( game.away.points == 0 && game.home.points > 0 ){
                const event = this.getDefaultEvent(data)
                const extraOptions = {}
                extraOptions[BasketballEvents.TeamFirstBasket] = game.home.id
                extraOptions[BasketballEvents.TeamScoresPoints] = game.home.id
                extraOptions[BasketballEvents.GamePointsHome] = game.home.points
                event.options = {
                    ...event.options,
                    ...extraOptions
                }
                result.push(event)
            }
            else if ( game.away.points > 0 && game.home.points == 0 ){
                const event = this.getDefaultEvent(data)
                const extraOptions = {}
                extraOptions[BasketballEvents.TeamFirstBasket] = game.away.id
                extraOptions[BasketballEvents.TeamScoresPoints] = game.away.id
                extraOptions[BasketballEvents.GamePointsAway] = game.away.points
                event.options = {
                    ...event.options,
                    ...extraOptions
                }
                result.push(event)
            }

        }

        return result
    }

}
