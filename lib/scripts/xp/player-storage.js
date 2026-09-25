import { createDefaultXpState, createXpState, } from "./progression";
const LEVEL_PROPERTY = "custom_xp:level";
const CURRENT_XP_PROPERTY = "custom_xp:current";
export function loadPlayerXp(player) {
    const level = player.getDynamicProperty(LEVEL_PROPERTY);
    const currentXp = player.getDynamicProperty(CURRENT_XP_PROPERTY);
    if (typeof level !== "number" || typeof currentXp !== "number") {
        return createDefaultXpState();
    }
    return createXpState(level, currentXp);
}
export function savePlayerXp(player, state) {
    player.setDynamicProperty(LEVEL_PROPERTY, state.level);
    player.setDynamicProperty(CURRENT_XP_PROPERTY, state.currentXp);
}
//# sourceMappingURL=player-storage.js.map