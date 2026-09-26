import { world } from "@minecraft/server";
import { grantItemToInventory } from "./inventory";
import { getMageProgression } from "./progression";
import { getSelectedClass } from "./storage";
import { PROOF_OF_CONCEPT_SPELL_NAME, PROOF_OF_CONCEPT_SPELL_OUTPUT_ITEM_ID, SPELL_CRAFTING_BLOCK_ID, } from "./spell-definitions";
import { hasLearnedProofOfConceptSpell, learnProofOfConceptSpell, } from "./spell-storage";
export function registerMageSpellCrafting() {
    world.afterEvents.playerInteractWithBlock.subscribe(({ block, isFirstEvent, player }) => {
        if (!isFirstEvent || block.typeId !== SPELL_CRAFTING_BLOCK_ID) {
            return;
        }
        craftProofOfConceptSpell(player);
    });
}
function craftProofOfConceptSpell(player) {
    if (getSelectedClass(player) !== "mage") {
        player.sendMessage("Only Mages can craft spells at this block.");
        return;
    }
    const progression = getMageProgression(player);
    if (!progression.firstMilestoneUnlocked) {
        player.sendMessage(`${progression.unlockName} is required before crafting this spell. Earn ${progression.nextThreshold} custom XP to unlock it.`);
        return;
    }
    if (hasLearnedProofOfConceptSpell(player)) {
        player.sendMessage(`${PROOF_OF_CONCEPT_SPELL_NAME} is already learned.`);
        return;
    }
    if (!grantItemToInventory(player, PROOF_OF_CONCEPT_SPELL_OUTPUT_ITEM_ID, 1)) {
        player.sendMessage("Spell crafting failed because your inventory is full.");
        return;
    }
    learnProofOfConceptSpell(player);
    player.sendMessage(`${PROOF_OF_CONCEPT_SPELL_NAME} learned. This proof-of-concept spell has no active effect yet.`);
}
//# sourceMappingURL=spell-crafting.js.map