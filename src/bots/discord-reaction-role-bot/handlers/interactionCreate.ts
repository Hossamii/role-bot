import { ButtonInteraction, Client } from "discord.js";
import { ButtonRoleManager } from "../classes/ButtonRoleManager";
import { getConfig } from "../util/getConfig";

module.exports = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
    // 1. التأكد أن التفاعل هو ضغطة زر
    if (!interaction.isButton()) return;
    
    // 2. التأكد أن الزر يخص نظام الرتب
    if (!interaction.customId.startsWith("role_")) return;

    try {
        // 3. جلب الإعدادات (وهي كائن Object وليست مصفوفة)
        const configs = getConfig();
        if (!configs || Object.keys(configs).length === 0) return;

        // 4. تحديد أي زر تم الضغط عليه
        const buttonIndex = parseInt(interaction.customId.replace("role_", ""));
        const buttonConfig = configs.buttons[buttonIndex];

        if (!buttonConfig) return;

        // 5. تشغيل مدير الرتب لإضافة أو إزالة الرتبة
        const manager = new ButtonRoleManager(interaction, configs, buttonConfig);
        await manager.handleRoles();
        
    } catch (error) {
        console.error("Error in button interaction:", error);
    }
};
