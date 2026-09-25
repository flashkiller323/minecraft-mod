---
name: create-implementation-plan
description: "Use when: creating, revising, or reviewing an implementation plan for this Minecraft Bedrock add-on. Capture decisions, scope, steps, validation, and open questions in plans/."
---

# Create Implementation Plan

Create durable implementation plans for changes to this Minecraft Bedrock add-on. Store each plan in `plans/<feature-name>.md` using lowercase kebab-case names.

## Workflow

1. Read only the code, manifests, and installed API typings needed to identify the owning implementation surface.
2. State the proposed outcome, constraints, and assumptions before planning a large feature.
3. Ask concise questions for product choices that materially change the implementation.
4. Write or revise one focused plan file in `plans/`.
5. Do not implement feature code unless the user explicitly asks to start implementation.

## Required Sections

Use these sections when they apply:

- `# <Feature Name>`: one-sentence outcome.
- `## Goals`: user-visible and technical outcomes.
- `## Decisions`: settled product and technical choices.
- `## Scope`: included work and explicit exclusions.
- `## Implementation Steps`: ordered, concrete changes with affected files and symbols.
- `## Validation`: build, deployment, runtime, and edge-case checks.
- `## Open Questions`: undecided choices that block or affect implementation.

## Project Constraints

- Keep Minecraft script state persistent with player dynamic properties when it belongs to an individual player.
- Treat scoreboard values as derived projections for commands or future HUD work, not as the authoritative state.
- Verify `@minecraft/server` APIs against installed type definitions before committing to an integration.
- Remember execution restrictions: callbacks such as custom commands may need to schedule world mutation through `system.run`.
- Preserve a clear boundary between behavior-pack logic in `scripts/` and resource-pack UI/assets in `resource_packs/`.
- Include `npm run build` and `npm run local-deploy` in validation when a plan changes script or pack files.

## Plan Quality Bar

Plans should make it possible to implement without rediscovering key design decisions. Prefer specific module names, event names, data-property IDs, item IDs, and test commands over general descriptions.

Avoid speculative abstraction, unrelated refactors, and implementation details that are not needed for the stated scope.
