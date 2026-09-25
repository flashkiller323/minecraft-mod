import { system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { CHARACTER_CLASSES, CLASS_SELECTOR_BOOK_ID, MAGE_BOOK_ID, } from "./definitions";
import { getMageProgression } from "./progression";
import { selectClass } from "./service";
import { hasClassAssignment } from "./storage";
const activeSelections = new Set();
const mageGuideSections = [
    {
        id: "overview",
        title: "Overview",
        summary: "Your class identity and purpose.",
        body: "The Mage is a scholar of arcane power.\n\n" +
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
        body: "Your next objective is to earn custom XP and advance your Mage path.\n\n" +
            "A future Mage crafting or spell-learning system will turn progression into active magical powers.\n\n" +
            "Use this guide as the central reference for your class progress and upcoming unlocks.",
    },
];
export function registerClassBookInteractions() {
    world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
        if (itemStack.typeId === MAGE_BOOK_ID) {
            void openMageGuide(source);
            return;
        }
        if (itemStack.typeId !== CLASS_SELECTOR_BOOK_ID ||
            hasClassAssignment(source) ||
            activeSelections.has(source.id)) {
            return;
        }
        activeSelections.add(source.id);
        void showClassSelection(source);
    });
}
function openMageGuide(player) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tabs = new ActionFormData()
                .title("Mage Guide")
                .body("Select a section to review your Mage class progress.");
            for (const section of mageGuideSections) {
                tabs.button(`${section.title}\n${section.summary}`);
            }
            const response = yield tabs.show(player);
            if (response.canceled || response.selection === undefined) {
                return;
            }
            const section = mageGuideSections[response.selection];
            if (!section) {
                return;
            }
            const progression = getMageProgression(player);
            yield new MessageFormData()
                .title(`Mage Guide - ${section.title}`)
                .body(getMageGuideSectionBody(section, progression))
                .button1("Back")
                .button2("Close")
                .show(player);
        }
        catch (_a) {
            player.sendMessage("Unable to open the Mage Guide right now.");
        }
    });
}
function getMageGuideSectionBody(section, progression) {
    if ("getBody" in section) {
        return section.getBody(progression);
    }
    return section.body;
}
function getProgressionGuideBody(progression) {
    const xpRemaining = Math.max(progression.nextThreshold - progression.totalXp, 0);
    const unlockStatus = progression.firstMilestoneUnlocked
        ? `${progression.unlockName} unlocked.`
        : `${xpRemaining} XP until ${progression.unlockName}.`;
    return ("Mage growth is driven by the shared custom XP system.\n\n" +
        `Private Mage Rank: ${progression.rank}\n` +
        `Custom XP: ${progression.totalXp}/${progression.nextThreshold}\n` +
        `First Milestone: ${unlockStatus}\n\n` +
        "Your rank is only shown here for your own progress tracking. It is not announced publicly.");
}
function getAbilitiesGuideBody(progression) {
    const focusStatus = progression.firstMilestoneUnlocked
        ? "Unlocked: Arcane Focus is active as your first Mage milestone."
        : `Locked: Arcane Focus unlocks at ${progression.nextThreshold} custom XP.`;
    return ("Mage abilities are not granted all at once.\n\n" +
        `${focusStatus}\n\n` +
        "The class will unlock new powers through progression, milestones, and later spell-learning systems.");
}
function showClassSelection(player) {
    return __awaiter(this, void 0, void 0, function* () {
        let selectionQueued = false;
        try {
            const form = new ActionFormData()
                .title("Choose Your Class")
                .body("Your class choice is permanent. Choose carefully.");
            for (const definition of CHARACTER_CLASSES) {
                form.button(definition.displayName);
            }
            const response = yield form.show(player);
            if (response.canceled || response.selection === undefined) {
                return;
            }
            const definition = CHARACTER_CLASSES[response.selection];
            if (!definition) {
                return;
            }
            selectionQueued = yield showClassConfirmation(player, definition);
        }
        catch (_a) {
            player.sendMessage("Unable to open class selection right now.");
        }
        finally {
            if (!selectionQueued) {
                activeSelections.delete(player.id);
            }
        }
    });
}
function showClassConfirmation(player, definition) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield new MessageFormData()
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
                    player.sendMessage(`You are now a ${definition.displayName}. Your Mage Guide has replaced the selection book.`);
                }
                else if (result === "already-assigned") {
                    player.sendMessage("You already have a class assignment.");
                }
                else {
                    player.sendMessage("Class selection failed because the selection book is no longer in your inventory.");
                }
            }
            finally {
                activeSelections.delete(player.id);
            }
        });
        return true;
    });
}
//# sourceMappingURL=forms.js.map