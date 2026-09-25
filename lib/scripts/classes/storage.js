import { getCharacterClass } from "./definitions";
const CLASS_PROPERTY = "customxp:class";
export function getSelectedClass(player) {
    const value = player.getDynamicProperty(CLASS_PROPERTY);
    return typeof value === "string" && getCharacterClass(value)
        ? value
        : undefined;
}
export function hasClassAssignment(player) {
    return typeof player.getDynamicProperty(CLASS_PROPERTY) === "string";
}
export function saveSelectedClass(player, classId) {
    player.setDynamicProperty(CLASS_PROPERTY, classId);
}
//# sourceMappingURL=storage.js.map