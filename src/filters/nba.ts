
export function hasShotType(ev: any, shotType: string): boolean {
    // if (!ev.payload.event.statistics) {
    //     return false;
    // }
    // for (let stat of ev.payload.event.statistics) {
    //     if (stat.shot_type === shotType || stat.type === shotType) {
    //         return true;
    //     }
    // }
    return false;
}

export function hasPlayerName(ev: PayloadEvent, playerName: string): boolean {
    // if (!ev.payload.event.statistics) {
    //     return false;
    // }
    // for (let stat of ev.payload.event.statistics) {
    //     if (!stat.player) {
    //         continue;
    //     }
    //     if (stat.type === "assist") { // Ignore assists.
    //         continue;
    //     }
    //     if (stat.player.full_name === playerName) {
    //         return true;
    //     }
    // }
    return false;
}
