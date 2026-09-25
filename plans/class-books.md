# Extendable Class Books

Add a persistent character-class system with Mage as the first registered class. New players receive a selector book on their first spawn; confirming Mage permanently replaces that selector with a Mage book.

## Goals

- Give unassigned new players a class-selection item automatically.
- Let a player select Mage through a confirmation flow.
- Persist the selected class across sessions.
- Replace the selector book with a class-specific book.
- Keep the design data-driven so later classes do not require rewriting the selection flow.

## Decisions

- Stable initial class ID: `mage`.
- Store class assignment in player dynamic property `customxp:class`.
- Class selection is permanent in this release.
- A future in-world NPC, not a command or consumable, will handle class resets.
- Mage selection requires confirmation.
- The Mage book is a placeholder in this slice and will later become an in-game guide for the Mage class.
- Spells will be learned through a dedicated spell-crafting block, not cast or selected directly from the Mage book.
- Reuse vanilla book visuals initially; custom art is deferred.
- Class selection does not modify custom XP in this first slice.

## Future XP Integration

- The existing custom XP system remains the authoritative progression source for future class skills and class-specific item unlocks.
- Class features should read XP state through the shared XP service rather than creating a second class-level or class-XP store.
- A later class-progression plan should define Mage skill thresholds, unlock behavior, and whether each class uses shared XP, level-gated unlocks, or a derived class-progression track.
- The Mage book will later explain class progression, learned spells, available skills, spell recipes, level requirements, the spell-crafting workflow, and how players obtain the spell-crafting block. It is a guide, not the spell-crafting interface.
- UI layout and visual styling for the Mage guide are deferred; its first implementation should prioritize complete, usable information.
- A future custom spell-crafting block will be the only place players learn or craft spells. Its recipes and availability should use the shared custom XP state and the player's selected class.

## Future Class Systems

- Add an in-world NPC interaction that can reset a player's class. The reset flow should confirm the action, clear `customxp:class`, remove or replace the old class book, and grant exactly one selector book.
- Define reset consequences before implementation: whether learned spells, class-specific items, and class-derived unlocks are removed, retained, or refunded.
- Design a custom spell-crafting block with recipes limited by class, learned-spell state, and custom XP or level requirements.
- Keep learned spells separate from the selected class property. Class selection identifies eligibility; a future persistent spell collection records individual learned spells.

## Scope

Included:

- Custom selector and Mage book item definitions.
- Initial-spawn selector grant.
- Class picker and confirmation forms.
- Persistent assignment and safe inventory replacement.
- Runtime documentation and test flow.

Excluded:

- Class switching, resets, or multi-class progression.
- Mage abilities, equipment, skills, and stats.
- XP-based skill and item unlocks.
- NPC class reset behavior.
- Spell-crafting block, spell recipes, and learned-spell persistence.
- Custom book artwork or HUD UI.

## Implementation Steps

1. Add behavior-pack item definitions for `customxp:class_selector_book` and `customxp:mage_book` under `behavior_packs/mage-class/items/`. Make both non-stackable and give each an explicit name and icon key.
2. Add `resource_packs/mage-class/textures/item_texture.json` to map the item keys to existing vanilla-style book textures.
3. Create `scripts/classes/definitions.ts` with a `CharacterClassDefinition` type and registry keyed by class ID. Mage provides display text, description, and class-book item ID.
4. Create `scripts/classes/storage.ts` with `getSelectedClass`, `hasSelectedClass`, and `saveSelectedClass` functions over `customxp:class`.
5. Create `scripts/classes/inventory.ts` to find a selector book, grant one when absent, and replace the specific selector slot with a class book.
6. Create `scripts/classes/service.ts` to grant the selector only during `playerSpawn.initialSpawn` for unassigned players and to execute the final selection transaction.
7. Create `scripts/classes/forms.ts` to generate the picker from the registry, show a Mage confirmation form, and handle selector-book use.
8. Update `scripts/main.ts` to compose class spawn initialization and item-use handling with the existing XP hooks.
9. Update `README.md` with the first-join flow, `/give @s customxp:class_selector_book` recovery command, and test steps.

## Validation

1. Run `npm run build`.
2. Run `npm run local-deploy` and join with a player who has no class property; verify one selector book is added.
3. Dismiss the picker or confirmation form; verify no item or class state changes.
4. Confirm Mage; verify the selector slot becomes a Mage book and no duplicate item appears.
5. Rejoin; verify Mage remains selected and a selector is not re-granted.
6. Open the form, then move or drop the selector before confirming; verify no class assignment or Mage book is created.
7. Give a selector book to an assigned player; verify its use does not reopen class selection.

## Open Questions

- What will the first spell-crafting block look like and how will players obtain it?
