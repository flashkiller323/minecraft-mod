import { EntityComponentTypes, ItemStack, } from "@minecraft/server";
import { CLASS_SELECTOR_BOOK_ID } from "./definitions";
function getInventory(player) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    return inventory === null || inventory === void 0 ? void 0 : inventory.container;
}
export function findSelectorBookSlot(player) {
    var _a;
    const inventory = getInventory(player);
    if (!inventory) {
        return undefined;
    }
    for (let slot = 0; slot < inventory.size; slot += 1) {
        if (((_a = inventory.getItem(slot)) === null || _a === void 0 ? void 0 : _a.typeId) === CLASS_SELECTOR_BOOK_ID) {
            return slot;
        }
    }
    return undefined;
}
export function grantSelectorBookIfMissing(player) {
    if (findSelectorBookSlot(player) !== undefined) {
        return true;
    }
    const inventory = getInventory(player);
    if (!inventory) {
        return false;
    }
    return (inventory.addItem(new ItemStack(CLASS_SELECTOR_BOOK_ID, 1)) === undefined);
}
export function grantItemToInventory(player, itemId, amount) {
    const inventory = getInventory(player);
    if (!inventory) {
        return false;
    }
    return inventory.addItem(new ItemStack(itemId, amount)) === undefined;
}
export function replaceSelectorBook(player, classBookItemId) {
    const selectorSlot = findSelectorBookSlot(player);
    const inventory = getInventory(player);
    if (selectorSlot === undefined || !inventory) {
        return false;
    }
    inventory.setItem(selectorSlot, new ItemStack(classBookItemId, 1));
    return true;
}
//# sourceMappingURL=inventory.js.map