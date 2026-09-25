import { system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { CHARACTER_CLASSES, CLASS_SELECTOR_BOOK_ID, MAGE_BOOK_ID, } from "./definitions";
import { selectClass } from "./service";
import { hasClassAssignment } from "./storage";
const activeSelections = new Set();
const mageGuideBody = "Welcome to the Mage Guide.\n\n" +
    "Your path is built around custom XP progression and magical mastery.\n\n" +
    "- Earn progression through the mod's XP systems.\n" +
    "- Unlock new magical abilities through future class progression.\n" +
    "- Use the spell-crafting workflow to learn and prepare your powers.\n\n" +
    "This guide is your first step toward the Mage path.";
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
            yield new ActionFormData()
                .title("Mage Guide")
                .body(mageGuideBody)
                .button("Close")
                .show(player);
        }
        catch (_a) {
            player.sendMessage("Unable to open the Mage Guide right now.");
        }
    });
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