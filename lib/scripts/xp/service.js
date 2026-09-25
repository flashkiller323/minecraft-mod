import { loadPlayerXp, savePlayerXp } from "./player-storage";
import { grantXp } from "./progression";
import { synchronizeXpScoreboards } from "./scoreboards";
export function synchronizePlayerXp(player) {
    const state = loadPlayerXp(player);
    savePlayerXp(player, state);
    synchronizeXpScoreboards(player, state);
    return state;
}
export function grantCustomXp(player, amount) {
    const state = grantXp(loadPlayerXp(player), amount);
    savePlayerXp(player, state);
    synchronizeXpScoreboards(player, state);
    return state;
}
//# sourceMappingURL=service.js.map