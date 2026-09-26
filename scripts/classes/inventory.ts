import {
  Container,
  EntityComponentTypes,
  EntityInventoryComponent,
  ItemStack,
  Player,
} from "@minecraft/server";
import { CLASS_SELECTOR_BOOK_ID } from "./definitions";

function getInventory(player: Player): Container | undefined {
  const inventory = player.getComponent(EntityComponentTypes.Inventory) as
    EntityInventoryComponent | undefined;
  return inventory?.container;
}

export function findSelectorBookSlot(player: Player): number | undefined {
  const inventory = getInventory(player);
  if (!inventory) {
    return undefined;
  }

  for (let slot = 0; slot < inventory.size; slot += 1) {
    if (inventory.getItem(slot)?.typeId === CLASS_SELECTOR_BOOK_ID) {
      return slot;
    }
  }

  return undefined;
}

export function grantSelectorBookIfMissing(player: Player): boolean {
  if (findSelectorBookSlot(player) !== undefined) {
    return true;
  }

  const inventory = getInventory(player);
  if (!inventory) {
    return false;
  }

  return (
    inventory.addItem(new ItemStack(CLASS_SELECTOR_BOOK_ID, 1)) === undefined
  );
}

export function grantItemToInventory(
  player: Player,
  itemId: string,
  amount: number,
): boolean {
  const inventory = getInventory(player);
  if (!inventory) {
    return false;
  }

  return inventory.addItem(new ItemStack(itemId, amount)) === undefined;
}

export function replaceSelectorBook(
  player: Player,
  classBookItemId: string,
): boolean {
  const selectorSlot = findSelectorBookSlot(player);
  const inventory = getInventory(player);
  if (selectorSlot === undefined || !inventory) {
    return false;
  }

  inventory.setItem(selectorSlot, new ItemStack(classBookItemId, 1));
  return true;
}
