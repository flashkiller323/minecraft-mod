import { Player } from "@minecraft/server";
import { CharacterClassDefinition } from "./definitions";
import { grantSelectorBookIfMissing, replaceSelectorBook } from "./inventory";
import { hasClassAssignment, saveSelectedClass } from "./storage";

export type ClassSelectionResult =
  "selected" | "already-assigned" | "selector-missing";

export function initializeClassPlayer(
  player: Player,
  initialSpawn: boolean,
): void {
  if (!initialSpawn || hasClassAssignment(player)) {
    return;
  }

  grantSelectorBookIfMissing(player);
}

export function selectClass(
  player: Player,
  definition: CharacterClassDefinition,
): ClassSelectionResult {
  if (hasClassAssignment(player)) {
    return "already-assigned";
  }

  if (!replaceSelectorBook(player, definition.bookItemId)) {
    return "selector-missing";
  }

  saveSelectedClass(player, definition.id);
  return "selected";
}
