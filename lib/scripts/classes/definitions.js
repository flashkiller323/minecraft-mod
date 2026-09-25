export const CLASS_SELECTOR_BOOK_ID = "customxp:class_selector_book";
export const MAGE_BOOK_ID = "customxp:mage_book";
export const CHARACTER_CLASSES = [
    {
        id: "mage",
        displayName: "Mage",
        description: "Study spells and unlock magical abilities through custom XP progression.",
        bookItemId: MAGE_BOOK_ID,
    },
];
export function getCharacterClass(id) {
    return CHARACTER_CLASSES.find((definition) => definition.id === id);
}
//# sourceMappingURL=definitions.js.map