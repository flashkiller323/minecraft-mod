import { Player } from "@minecraft/server";
import { PROOF_OF_CONCEPT_SPELL_ID } from "./spell-definitions";

const PROOF_OF_CONCEPT_SPELL_PROPERTY = `customxp:mage_spell:${PROOF_OF_CONCEPT_SPELL_ID}`;

export function hasLearnedProofOfConceptSpell(player: Player): boolean {
  return player.getDynamicProperty(PROOF_OF_CONCEPT_SPELL_PROPERTY) === true;
}

export function learnProofOfConceptSpell(player: Player): void {
  player.setDynamicProperty(PROOF_OF_CONCEPT_SPELL_PROPERTY, true);
}
