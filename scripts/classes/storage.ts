import { Player } from "@minecraft/server";
import { CharacterClassId, getCharacterClass } from "./definitions";

const CLASS_PROPERTY = "customxp:class";

export function getSelectedClass(player: Player): CharacterClassId | undefined {
  const value = player.getDynamicProperty(CLASS_PROPERTY);
  return typeof value === "string" && getCharacterClass(value)
    ? (value as CharacterClassId)
    : undefined;
}

export function hasClassAssignment(player: Player): boolean {
  return typeof player.getDynamicProperty(CLASS_PROPERTY) === "string";
}

export function saveSelectedClass(
  player: Player,
  classId: CharacterClassId,
): void {
  player.setDynamicProperty(CLASS_PROPERTY, classId);
}
