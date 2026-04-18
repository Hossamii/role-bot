import {
    BaseGuildTextChannel,
    Client,
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder
} from "discord.js";
import { getConfig } from "../util/getConfig"; // تأكد إن الاسم هنا getConfig
import { Config, ButtonConfig } from "../types";

module.exports = async (client: Client): Promise<void> => {
    console.log("Button Role Bot is ready!");

    const configs = getConfig(); // تغيير loadConfigs إلى getConfig

    for (const config of configs) {
        try {
            const channel = await client.channels.fetch(config.channelId);
            if (!channel || !channel.isTextBased()) continue;

            const textChannel = channel as BaseGuildTextChannel;
            // ... باقي الكود اللي عندك سليم ...
        } catch (err: any) {
            console.error(`Error setting up channel ${config.channelId}: ${err.message}`);
        }
    }
};
