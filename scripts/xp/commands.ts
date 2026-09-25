import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandSource,
  CustomCommandStatus,
  Player,
  StartupEvent,
  system,
} from "@minecraft/server";
import { grantCustomXp } from "./service";

export function registerXpCommands(event: StartupEvent): void {
  event.customCommandRegistry.registerCommand(
    {
      name: "customxp:add",
      description: "Adds custom XP to the player who runs the command.",
      mandatoryParameters: [
        { name: "amount", type: CustomCommandParamType.Integer },
      ],
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
    },
    (origin, amount: number) => {
      if (
        origin.sourceType !== CustomCommandSource.Entity ||
        !(origin.sourceEntity instanceof Player)
      ) {
        return {
          status: CustomCommandStatus.Failure,
          message: "This command must be run by a player.",
        };
      }

      if (!Number.isSafeInteger(amount) || amount <= 0) {
        return {
          status: CustomCommandStatus.Failure,
          message: "Amount must be a positive whole number.",
        };
      }

      const player = origin.sourceEntity;
      system.run(() => {
        const state = grantCustomXp(player, amount);
        player.sendMessage(
          `Custom XP: level ${state.level}, ${state.currentXp}/${state.requiredXp}.`,
        );
      });

      return {
        status: CustomCommandStatus.Success,
        message: "Custom XP grant queued.",
      };
    },
  );
}
