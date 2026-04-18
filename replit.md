# Discord Reaction Role Bot

## Overview
A Discord bot that allows users to self-assign roles by reacting to specific messages. Built on TypeScript with discord.js v13.

## Architecture
- **Runtime**: Node.js 20 with TypeScript (ts-node)
- **Framework**: Custom loader in `src/index.ts` that mimics the `create-discord-bot` plugin architecture
- **Plugin**: `src/bots/discord-reaction-role-bot/` contains all bot logic

## Project Structure
```
src/
  index.ts                         # Main entry point - loads all bots
  bots/
    discord-reaction-role-bot/
      config.json                  # Emoji-to-role mapping configuration
      intents.ts                   # Discord gateway intents
      types.ts                     # TypeScript type definitions
      handlers/
        ready.ts                   # Bot startup - reacts to configured messages
        messageReactionAdd.ts      # Handles user reactions
      classes/
        ReactionRoleManager.ts     # Core role assignment logic
      util/
        getConfig.ts               # Config lookup helper
```

## Configuration
Edit `src/bots/discord-reaction-role-bot/config.json` to set up your reaction roles:
- `messageId`: The Discord message ID to watch for reactions
- `channelId`: The channel the message is in
- `removeReaction`: Whether to remove the user's reaction after processing
- `policy`: `once`, `any`, or `unique` (default)
- `emojiRoleMap`: Maps emojis to role IDs

## Required Secret
- `DISCORD_BOT_TOKEN`: Your Discord bot token (set in environment secrets)

## Running
```
npm start
```

## Bot Permissions Required
- Manage Roles
- Manage Messages (if removeReaction is enabled)
- Read Message History
