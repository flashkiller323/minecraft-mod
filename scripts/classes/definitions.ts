export const CLASS_SELECTOR_BOOK_ID = "customxp:class_selector_book";
export const MAGE_BOOK_ID = "customxp:mage_book";

export interface CharacterClassDefinition {
  id: "mage";
  displayName: string;
  description: string;
  bookItemId: string;
}

export const CHARACTER_CLASSES: readonly CharacterClassDefinition[] = [
  {
    id: "mage",
    displayName: "Mage",
    description:
      "Study spells and unlock magical abilities through custom XP progression.",
    bookItemId: MAGE_BOOK_ID,
  },
];

export type CharacterClassId = CharacterClassDefinition["id"];

export function getCharacterClass(
  id: string,
): CharacterClassDefinition | undefined {
  return CHARACTER_CLASSES.find((definition) => definition.id === id);
}
