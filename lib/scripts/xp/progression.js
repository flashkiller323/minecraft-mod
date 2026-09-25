export const XP_PER_LEVEL = 100;
export function createDefaultXpState() {
    return createXpState(0, 0);
}
export function createXpState(level, currentXp) {
    let normalizedLevel = toNonNegativeInteger(level);
    let normalizedCurrentXp = toNonNegativeInteger(currentXp);
    normalizedLevel += Math.floor(normalizedCurrentXp / XP_PER_LEVEL);
    normalizedCurrentXp %= XP_PER_LEVEL;
    return {
        level: normalizedLevel,
        currentXp: normalizedCurrentXp,
        requiredXp: XP_PER_LEVEL,
    };
}
export function grantXp(state, amount) {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("XP amount must be a positive integer.");
    }
    return createXpState(state.level, state.currentXp + amount);
}
function toNonNegativeInteger(value) {
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }
    return Math.floor(value);
}
//# sourceMappingURL=progression.js.map