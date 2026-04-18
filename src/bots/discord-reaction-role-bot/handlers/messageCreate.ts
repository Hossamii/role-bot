import { 
    Message, 
    Client, 
    BaseGuildTextChannel, 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonStyle, 
    ButtonBuilder,
    SectionBuilder, // تم إضافة هذا السطر لحل المشكلة
    MessageFlags
} from "discord.js";
import { getConfig } from "../util/getConfig";
import { Config, ButtonConfig } from "../types";

const styleMap: Record<string, ButtonStyle> = {
    PRIMARY: ButtonStyle.Primary,
    SECONDARY: ButtonStyle.Secondary,
    SUCCESS: ButtonStyle.Success,
    DANGER: ButtonStyle.Danger,
};

module.exports = async (client: Client, message: Message): Promise<void> => {
    if (message.author.bot || message.content !== "Y") return;

    try {
        const rawConfigs = getConfig();
        const configs = (Array.isArray(rawConfigs) ? rawConfigs : [rawConfigs]) as Config[];

        for (const config of configs) {
            if (message.channelId !== config.channelId) continue;

            const textChannel = message.channel as BaseGuildTextChannel;
            await message.delete().catch(() => {});

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
                        new TextDisplayBuilder().setContent(`### ${btn.label}\n${btn.description}`)
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setCustomId(`role_${btnIndex}`)
                            .setLabel("Get Alerts")
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
                flags: [MessageFlags.IsComponentsV2]
            });
        }
    } catch (err: any) {
        console.error(`Error handling Y command: ${err.message}`);
    }
};
