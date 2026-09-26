import { Player, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import {
  CHARACTER_CLASSES,
  CLASS_SELECTOR_BOOK_ID,
  MAGE_BOOK_ID,
  CharacterClassDefinition,
} from "./definitions";
import { getMageProgression, MageProgressionState } from "./progression";
import { selectClass } from "./service";
import { hasClassAssignment } from "./storage";
import {
  PROOF_OF_CONCEPT_SPELL_NAME,
  PROOF_OF_CONCEPT_SPELL_OUTPUT_ITEM_ID,
  SPELL_CRAFTING_BLOCK_ID,
} from "./spell-definitions";
import { hasLearnedProofOfConceptSpell } from "./spell-storage";

const activeSelections = new Set<string>();
interface MageGuideState {
  progression: MageProgressionState;
  proofOfConceptSpellLearned: boolean;
}

const mageGuideSections = [
  {
    id: "overview",
    title: "Overview",
    summary: "Your class identity and purpose.",
    body:
      "The Mage is a scholar of arcane power.\n\n" +
      "Your path is built around custom XP progression, magical study, and the discovery of new abilities.\n\n" +
      "The Mage Guide is your permanent reference for class identity, progression milestones, and the next magical objective.",
  },
  {
    id: "progression",
    title: "Progression",
    summary: "The XP-based path to new Mage milestones.",
    getBody: getProgressionGuideBody,
  },
  {
    id: "abilities",
    title: "Abilities",
    summary: "Current and upcoming Magic abilities.",
    getBody: getAbilitiesGuideBody,
  },
  {
    id: "next-steps",
    title: "Next Steps",
    summary: "What you should do next as a Mage.",
    getBody: getNextStepsGuideBody,
  },
] as const;

export function registerClassBookInteractions(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === MAGE_BOOK_ID) {
      void openMageGuide(source);
      return;
    }

    if (
      itemStack.typeId !== CLASS_SELECTOR_BOOK_ID ||
      hasClassAssignment(source) ||
      activeSelections.has(source.id)
    ) {
      return;
    }

    activeSelections.add(source.id);
    void showClassSelection(source);
  });
}

async function openMageGuide(player: Player): Promise<void> {
  try {
    const tabs = new ActionFormData()
      .title("Mage Guide")
      .body("Select a section to review your Mage class progress.");

    for (const section of mageGuideSections) {
      tabs.button(`${section.title}\n${section.summary}`);
    }

    const response = await tabs.show(player);
    if (response.canceled || response.selection === undefined) {
      return;
    }

    const section = mageGuideSections[response.selection];
    if (!section) {
      return;
    }

    const guideState: MageGuideState = {
      progression: getMageProgression(player),
      proofOfConceptSpellLearned: hasLearnedProofOfConceptSpell(player),
    };

    await new MessageFormData()
      .title(`Mage Guide - ${section.title}`)
      .body(getMageGuideSectionBody(section, guideState))
      .button1("Back")
      .button2("Close")
      .show(player);
  } catch {
    player.sendMessage("Unable to open the Mage Guide right now.");
  }
}

function getMageGuideSectionBody(
  section: (typeof mageGuideSections)[number],
  guideState: MageGuideState,
): string {
  if ("getBody" in section) {
    return section.getBody(guideState);
  }

  return section.body;
}

function getProgressionGuideBody(guideState: MageGuideState): string {
  const progression = guideState.progression;
  const xpRemaining = Math.max(
    progression.nextThreshold - progression.totalXp,
    0,
  );
  const unlockStatus = progression.firstMilestoneUnlocked
    ? `${progression.unlockName} unlocked. You can use an enchanting table for the proof spell craft.`
    : `${xpRemaining} XP until ${progression.unlockName}.`;
  const spellStatus = guideState.proofOfConceptSpellLearned
    ? `${PROOF_OF_CONCEPT_SPELL_NAME} learned.`
    : `${PROOF_OF_CONCEPT_SPELL_NAME} not learned.`;

  return (
    "Mage growth is driven by the shared custom XP system.\n\n" +
    `Private Mage Rank: ${progression.rank}\n` +
    `Custom XP: ${progression.totalXp}/${progression.nextThreshold}\n` +
    `First Milestone: ${unlockStatus}\n` +
    `Proof Spell: ${spellStatus}\n\n` +
    "Your rank is only shown here for your own progress tracking. It is not announced publicly."
  );
}

function getAbilitiesGuideBody(guideState: MageGuideState): string {
  const progression = guideState.progression;
  const focusStatus = guideState.proofOfConceptSpellLearned
    ? `Learned: ${PROOF_OF_CONCEPT_SPELL_NAME} produces ${PROOF_OF_CONCEPT_SPELL_OUTPUT_ITEM_ID} and has no active effect yet.`
    : progression.firstMilestoneUnlocked
      ? `Ready: interact with ${SPELL_CRAFTING_BLOCK_ID} to craft ${PROOF_OF_CONCEPT_SPELL_NAME}.`
      : `Locked: ${PROOF_OF_CONCEPT_SPELL_NAME} unlocks at ${progression.nextThreshold} custom XP.`;

  return (
    "Mage abilities are not granted all at once.\n\n" +
    `${focusStatus}\n\n` +
    "This first spell craft only proves the gated learning flow. Later passes can attach real spell behavior."
  );
}

function getNextStepsGuideBody(guideState: MageGuideState): string {
  const progression = guideState.progression;

  if (guideState.proofOfConceptSpellLearned) {
    return (
      `${PROOF_OF_CONCEPT_SPELL_NAME} is learned.\n\n` +
      "There is no active spell effect yet; this proof of concept confirms the gated crafting path works."
    );
  }

  const nextStep = progression.firstMilestoneUnlocked
    ? `Interact with ${SPELL_CRAFTING_BLOCK_ID} to craft ${PROOF_OF_CONCEPT_SPELL_NAME}.`
    : `Locked: Arcane Focus unlocks at ${progression.nextThreshold} custom XP.`;

  return (
    "Your next objective is to prove the first spell-crafting flow.\n\n" +
    `${nextStep}\n\n` +
    "Use this guide as the central reference for your class progress and upcoming unlocks."
  );
}

async function showClassSelection(player: Player): Promise<void> {
  let selectionQueued = false;

  try {
    const form = new ActionFormData()
      .title("Choose Your Class")
      .body("Your class choice is permanent. Choose carefully.");

    for (const definition of CHARACTER_CLASSES) {
      form.button(definition.displayName);
    }

    const response = await form.show(player);
    if (response.canceled || response.selection === undefined) {
      return;
    }

    const definition = CHARACTER_CLASSES[response.selection];
    if (!definition) {
      return;
    }

    selectionQueued = await showClassConfirmation(player, definition);
  } catch {
    player.sendMessage("Unable to open class selection right now.");
  } finally {
    if (!selectionQueued) {
      activeSelections.delete(player.id);
    }
  }
}

async function showClassConfirmation(
  player: Player,
  definition: CharacterClassDefinition,
): Promise<boolean> {
  const response = await new MessageFormData()
    .title(`Choose ${definition.displayName}`)
    .body(`${definition.description}\n\nThis choice is permanent. Continue?`)
    .button1("Choose Mage")
    .button2("Back")
    .show(player);

  if (response.canceled || response.selection !== 0) {
    return false;
  }

  system.run(() => {
    try {
      const result = selectClass(player, definition);
      if (result === "selected") {
        player.sendMessage(
          `You are now a ${definition.displayName}. Your Mage Guide has replaced the selection book.`,
        );
      } else if (result === "already-assigned") {
        player.sendMessage("You already have a class assignment.");
      } else {
        player.sendMessage(
          "Class selection failed because the selection book is no longer in your inventory.",
        );
      }
    } finally {
      activeSelections.delete(player.id);
    }
  });

  return true;
}
