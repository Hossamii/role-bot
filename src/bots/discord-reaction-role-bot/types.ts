import { Snowflake } from "discord.js";

export type Policy = "once" | "any" | "unique";

export type ButtonStyle = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";

export interface ButtonConfig {
  label: string;
  description: string;
  style: ButtonStyle;
  roleIds: Snowflake[];
}

export interface Config {
  channelId: Snowflake;
  embedTitle: string;
  embedDescription: string;
  embedColor?: number;
  policy?: Policy;
  buttons: ButtonConfig[];
}
