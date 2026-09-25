import { createMageProgression } from "../classes/progression";
import { getSelectedClass } from "../classes/storage";
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
    const previousState = loadPlayerXp(player);
    const previousMageProgression = createMageProgression(previousState);
    const state = grantXp(previousState, amount);
    savePlayerXp(player, state);
    synchronizeXpScoreboards(player, state);
    const currentMageProgression = createMageProgression(state);
    if (getSelectedClass(player) === "mage" &&
        !previousMageProgression.firstMilestoneUnlocked &&
        currentMageProgression.firstMilestoneUnlocked) {
        player.sendMessage(`Mage milestone unlocked: ${currentMageProgression.unlockName}. Open your Mage Guide to review your private rank.`);
    }
    return state;
}
//# sourceMappingURL=service.js.map