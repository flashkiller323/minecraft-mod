# Mage Class

## Local Setup

1. Install Node.js 18+ or the version required by the Minecraft scripting toolchain.
2. Open a terminal in this project folder and run:

   ```bash
   npm install
   ```

3. To deploy the packs locally for testing in Minecraft, run:

   ```bash
   npm run local-deploy
   ```

   Keep this terminal running while you work so the project rebuilds and copies the behavior/resource packs to the local Bedrock dev folders.
4. If you want a clean build without deploying, run:

   ```bash
   npm run build
   ```

## Debugger Workflow

This project is configured for the **Minecraft Bedrock Edition Debugger** VS Code extension. Install the recommended `mojang-studios.minecraft-debugger` extension when prompted.

1. Run `npm install` once, then run `npm run local-deploy` in a terminal. Leave it running while you work so changes are rebuilt and copied to Minecraft's development pack folders.
2. In VS Code, select **Debug with Minecraft** and press `F5`. The `build` task runs first and VS Code listens on port `19144`.
3. Open a Bedrock world with **Mage Class** enabled, then run:

   ```text
   /script debugger connect
   ```

4. Set breakpoints in files under `scripts/`. Source maps resolve these TypeScript breakpoints to `dist/scripts/main.js` automatically.
5. After a source change, wait for the deploy watcher to copy the output, run `/reload` in the world, and reconnect the debugger if Minecraft closes the connection.

`targetModuleUuid` in [.vscode/launch.json](.vscode/launch.json) is set to this behavior pack's script module, preventing the debugger from attaching to another scripted pack.

### Connection Troubleshooting

- Ensure the VS Code debugger is listening before running `/script debugger connect`.
- Allow port `19144` through Windows Firewall when debugging across devices.
- If the local client cannot connect, run `npm run enablemcloopback` from an elevated PowerShell window, then restart Minecraft.
- Use `/script debugger close` before reconnecting when a stale session remains.

### Profiling

Use `/script profiler start`, exercise the behavior, then run `/script profiler stop`. Open the resulting `.cpuprofile` from Minecraft's logs folder in VS Code.

## Custom XP Backend

Custom XP is separate from Minecraft's native XP and persists per player. The behavior pack mirrors it to scoreboards for command inspection and future HUD integration:

- `custom_xp_level`
- `custom_xp_current`
- `custom_xp_required`

In a world with the behavior pack enabled, use the temporary test command:

```text
/customxp:add 25
```

The command grants XP only to the player who runs it. The current level uses a fixed cost of 100 XP. Inspect values with:

```text
/scoreboard players get @s custom_xp_level
/scoreboard players get @s custom_xp_current
/scoreboard players get @s custom_xp_required
```

## Class Selection

Players without a class receive one **Class Selection Book** on their first spawn. Use it, choose **Mage**, and confirm the permanent selection. The book is replaced by a **Mage Guide**; spells and class abilities are not implemented yet.

For development recovery, give yourself a replacement selector with:

```text
/give @s customxp:class_selector_book
```

The selector book only works for players without a saved class assignment.
