import { Player, ScoreboardObjective, world } from "@minecraft/server";
import { PlayerXpState } from "./progression";

const OBJECTIVES = {
  level: { id: "custom_xp_level", displayName: "Custom XP Level" },
  current: { id: "custom_xp_current", displayName: "Custom XP Current" },
  required: { id: "custom_xp_required", displayName: "Custom XP Required" },
} as const;

export function synchronizeXpScoreboards(
  player: Player,
  state: PlayerXpState,
): void {
  getOrCreateObjective(OBJECTIVES.level).setScore(player, state.level);
  getOrCreateObjective(OBJECTIVES.current).setScore(player, state.currentXp);
  getOrCreateObjective(OBJECTIVES.required).setScore(player, state.requiredXp);
}

function getOrCreateObjective(definition: {
  id: string;
  displayName: string;
}): ScoreboardObjective {
  return (
    world.scoreboard.getObjective(definition.id) ??
    world.scoreboard.addObjective(definition.id, definition.displayName)
  );
}
