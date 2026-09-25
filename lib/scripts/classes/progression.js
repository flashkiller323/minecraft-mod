import { loadPlayerXp } from "../xp/player-storage";
export const FIRST_MAGE_THRESHOLD_XP = 25;
export function getMageProgression(player) {
    return createMageProgression(loadPlayerXp(player));
}
export function createMageProgression(xpState) {
    const totalXp = xpState.level * xpState.requiredXp + xpState.currentXp;
    const firstMilestoneUnlocked = totalXp >= FIRST_MAGE_THRESHOLD_XP;
    return {
        rank: firstMilestoneUnlocked ? 1 : 0,
        totalXp,
        nextThreshold: FIRST_MAGE_THRESHOLD_XP,
        firstMilestoneUnlocked,
        unlockName: "Arcane Focus",
    };
}
//# sourceMappingURL=progression.js.map