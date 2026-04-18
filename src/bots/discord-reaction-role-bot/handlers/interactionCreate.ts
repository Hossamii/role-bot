import { ButtonInteraction, Client } from "discord.js";
import { ButtonRoleManager } from "../classes/ButtonRoleManager";
import { getConfig } from "../util/getConfig"; // تم تغيير الاسم هنا من loadConfigs إلى getConfig

module.exports = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("role_")) return; // تأكد أن الـ ID يبدأ بـ role_ كما في ملف messageCreate

    try {
        const config = getConfig(); // تم تغيير الاسم هنا أيضاً
        if (!config || !config[0]) return;

        const data = config[0];
        const buttonIndex = parseInt(interaction.customId.replace("role_", ""));
        const buttonConfig = data.buttons[buttonIndex];

        if (!buttonConfig) return;

        const manager = new ButtonRoleManager(interaction, data, buttonConfig);
        await manager.handleRoles();
    } catch (error) {
        console.error("Error in button interaction:", error);
    }
};
