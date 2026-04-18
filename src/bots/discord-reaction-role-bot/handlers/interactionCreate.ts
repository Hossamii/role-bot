import { ButtonInteraction, Client } from "discord.js";
import { ButtonRoleManager } from "../classes/ButtonRoleManager";
import { getConfig } from "../util/getConfig";
import { Config } from "../types"; // استيراد التعريف الصحيح للبيانات

module.exports = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("role_")) return;

    try {
        // جلب الإعدادات والتأكد من أنها كائن واحد (Config) وليست مصفوفة
        const rawConfigs = getConfig();
        
        // تحويل البيانات لتعريف Config الصريح لحل مشكلة Property 'buttons' does not exist
        const configs = (Array.isArray(rawConfigs) ? rawConfigs[0] : rawConfigs) as Config;

        if (!configs || !configs.buttons) {
            console.error("[Interaction] No valid config or buttons found.");
            return;
        }

        const buttonIndex = parseInt(interaction.customId.replace("role_", ""));
        const buttonConfig = configs.buttons[buttonIndex];

        if (!buttonConfig) return;

        const manager = new ButtonRoleManager(interaction, configs, buttonConfig);
        await manager.handleRoles();
        
    } catch (error) {
        console.error("Error in button interaction:", error);
    }
};
