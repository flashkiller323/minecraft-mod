import { grantSelectorBookIfMissing, replaceSelectorBook } from "./inventory";
import { hasClassAssignment, saveSelectedClass } from "./storage";
export function initializeClassPlayer(player, initialSpawn) {
    if (!initialSpawn || hasClassAssignment(player)) {
        return;
    }
    grantSelectorBookIfMissing(player);
}
export function selectClass(player, definition) {
    if (hasClassAssignment(player)) {
        return "already-assigned";
    }
    if (!replaceSelectorBook(player, definition.bookItemId)) {
        return "selector-missing";
    }
    saveSelectedClass(player, definition.id);
    return "selected";
}
//# sourceMappingURL=service.js.map