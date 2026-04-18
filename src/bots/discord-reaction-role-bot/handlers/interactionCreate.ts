import { ButtonInteraction, Client } from "discord.js";
import { ButtonRoleManager } from "../classes/ButtonRoleManager";
import { getConfig } from "../util/getConfig"; // الاسم الجديد الموحد

module.exports = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("role_")) return; // التأكد من الـ ID

    try {
        const configs = getConfig(); // جلب المصفوفة كاملة
        if (!configs || configs.length === 0) return;

        const data = configs[0]; // الوصول لأول عنصر في المصفوفة
        const buttonIndex = parseInt(interaction.customId.replace("role_", ""));
        const buttonConfig = data.buttons[buttonIndex];

        if (!buttonConfig) return;

        const manager = new ButtonRoleManager(interaction, data, buttonConfig);
        await manager.handleRoles();
    } catch (error) {
        console.error("Error in button interaction:", error);
    }
};
