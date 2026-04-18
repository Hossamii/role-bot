import {
  BaseGuildTextChannel,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";
import { loadConfigs } from "../util/getConfig";
import { Config, ButtonConfig } from "../types";

const styleMap: Record<string, ButtonStyle> = {
  PRIMARY: ButtonStyle.Primary,
  SECONDARY: ButtonStyle.Secondary,
  SUCCESS: ButtonStyle.Success,
  DANGER: ButtonStyle.Danger,
};

module.exports = async (client: Client): Promise<void> => {
  console.log("Button Role Bot is ready!");

  const configs = loadConfigs();

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i] as unknown as Config;

    try {
      const channel = await client.channels.fetch(config.channelId);
      if (!channel || !channel.isTextBased() || channel.isDMBased()) continue;

      const textChannel = channel as BaseGuildTextChannel;

      const container = new ContainerBuilder();

      if (config.embedColor) {
        container.setAccentColor(config.embedColor);
      }

      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${config.embedTitle}\n${config.embedDescription}`
        )
      );

      container.addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true)
      );

      config.buttons.forEach((btn: ButtonConfig, btnIndex: number) => {
        const section = new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `### ${btn.label}\n${btn.description}`
            )
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId(`rrb:${i}:${btnIndex}`)
              .setLabel("Get alerts")
              .setStyle(styleMap[btn.style] ?? ButtonStyle.Primary)
          );

        container.addSectionComponents(section);

        if (btnIndex < config.buttons.length - 1) {
          container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
          );
        }
      });

      await textChannel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });

      console.log(`Sent Components V2 message to channel ${config.channelId}`);
    } catch (err: any) {
      console.error(`Error setting up channel ${config.channelId}: ${err.message}`);
    }
  }
};
