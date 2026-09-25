import { Player } from "@minecraft/server";
import { PlayerXpState } from "../xp/progression";
import { loadPlayerXp } from "../xp/player-storage";

export const FIRST_MAGE_THRESHOLD_XP = 25;

export interface MageProgressionState {
  rank: number;
  totalXp: number;
  nextThreshold: number;
  firstMilestoneUnlocked: boolean;
  unlockName: string;
}

export function getMageProgression(player: Player): MageProgressionState {
  return createMageProgression(loadPlayerXp(player));
}

export function createMageProgression(
  xpState: PlayerXpState,
): MageProgressionState {
  const totalXp = xpState.level * xpState.requiredXp + xpState.currentXp;
  const firstMilestoneUnlocked = totalXp >= FIRST_MAGE_THRESHOLD_XP;

  return {
    rank: firstMilestoneUnlocked ? 1 : 0,
    totalXp,
    nextThreshold: FIRST_MAGE_THRESHOLD_XP,
    firstMilestoneUnlocked,
    unlockName: "Arcane Focus",
  };
}
