import { ButtonInteraction, Client } from "discord.js";
import { ButtonRoleManager } from "../classes/ButtonRoleManager";
import { loadConfigs } from "../util/getConfig";

module.exports = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("rrb:")) return;

  const parts = interaction.customId.split(":");
  const configIndex = parseInt(parts[1]);
  const buttonIndex = parseInt(parts[2]);

  const configs = loadConfigs();
  const config = configs[configIndex];
  if (!config) return;

  const buttonConfig = config.buttons[buttonIndex];
  if (!buttonConfig) return;

  const manager = new ButtonRoleManager(interaction, config, buttonConfig);
  await manager.handleRoles();
};
