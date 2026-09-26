import { PROOF_OF_CONCEPT_SPELL_ID } from "./spell-definitions";
const PROOF_OF_CONCEPT_SPELL_PROPERTY = `customxp:mage_spell:${PROOF_OF_CONCEPT_SPELL_ID}`;
export function hasLearnedProofOfConceptSpell(player) {
    return player.getDynamicProperty(PROOF_OF_CONCEPT_SPELL_PROPERTY) === true;
}
export function learnProofOfConceptSpell(player) {
    player.setDynamicProperty(PROOF_OF_CONCEPT_SPELL_PROPERTY, true);
}
//# sourceMappingURL=spell-storage.js.map