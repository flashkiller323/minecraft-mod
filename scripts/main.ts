import { system, world } from "@minecraft/server";
import { registerClassBookInteractions } from "./classes/forms";
import { initializeClassPlayer } from "./classes/service";
import { registerMageSpellCrafting } from "./classes/spell-crafting";
import { registerXpCommands } from "./xp/commands";
import { synchronizePlayerXp } from "./xp/service";

system.beforeEvents.startup.subscribe(registerXpCommands);
registerClassBookInteractions();
registerMageSpellCrafting();

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {
  system.run(() => {
    synchronizePlayerXp(player);
    initializeClassPlayer(player, initialSpawn);
  });
});
