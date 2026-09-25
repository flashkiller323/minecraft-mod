import { Player } from "@minecraft/server";
import { loadPlayerXp, savePlayerXp } from "./player-storage";
import { grantXp, PlayerXpState } from "./progression";
import { synchronizeXpScoreboards } from "./scoreboards";

export function synchronizePlayerXp(player: Player): PlayerXpState {
  const state = loadPlayerXp(player);
  savePlayerXp(player, state);
  synchronizeXpScoreboards(player, state);
  return state;
}

export function grantCustomXp(player: Player, amount: number): PlayerXpState {
  const state = grantXp(loadPlayerXp(player), amount);
  savePlayerXp(player, state);
  synchronizeXpScoreboards(player, state);
  return state;
}
