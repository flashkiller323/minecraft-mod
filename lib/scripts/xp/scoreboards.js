import { world } from "@minecraft/server";
const OBJECTIVES = {
    level: { id: "custom_xp_level", displayName: "Custom XP Level" },
    current: { id: "custom_xp_current", displayName: "Custom XP Current" },
    required: { id: "custom_xp_required", displayName: "Custom XP Required" },
};
export function synchronizeXpScoreboards(player, state) {
    getOrCreateObjective(OBJECTIVES.level).setScore(player, state.level);
    getOrCreateObjective(OBJECTIVES.current).setScore(player, state.currentXp);
    getOrCreateObjective(OBJECTIVES.required).setScore(player, state.requiredXp);
}
function getOrCreateObjective(definition) {
    var _a;
    return ((_a = world.scoreboard.getObjective(definition.id)) !== null && _a !== void 0 ? _a : world.scoreboard.addObjective(definition.id, definition.displayName));
}
//# sourceMappingURL=scoreboards.js.map