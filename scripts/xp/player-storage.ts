import { Player } from "@minecraft/server";
import {
  createDefaultXpState,
  createXpState,
  PlayerXpState,
} from "./progression";

const LEVEL_PROPERTY = "custom_xp:level";
const CURRENT_XP_PROPERTY = "custom_xp:current";

export function loadPlayerXp(player: Player): PlayerXpState {
  const level = player.getDynamicProperty(LEVEL_PROPERTY);
  const currentXp = player.getDynamicProperty(CURRENT_XP_PROPERTY);

  if (typeof level !== "number" || typeof currentXp !== "number") {
    return createDefaultXpState();
  }

  return createXpState(level, currentXp);
}

export function savePlayerXp(player: Player, state: PlayerXpState): void {
  player.setDynamicProperty(LEVEL_PROPERTY, state.level);
  player.setDynamicProperty(CURRENT_XP_PROPERTY, state.currentXp);
}
