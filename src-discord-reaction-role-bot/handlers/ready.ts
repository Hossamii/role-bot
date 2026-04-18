import { BaseGuildTextChannel, Client } from "discord.js";
import { getConfig } from "../util/getConfig"; // استدعاء الدالة الجديدة اللي أصلحناها

module.exports = async (client: Client): Promise<void> => {
    console.log(`[ready] البوت جاهز وسجل دخوله كـ ${client.user?.tag}`);

    try {
        const configs = getConfig(); // جلب الإعدادات باستخدام الدالة الموحدة
        if (!configs || configs.length === 0) {
            console.log("[ready] لا توجد إعدادات لتحميلها.");
            return;
        }

        for (const config of configs) {
            try {
                const channel = await client.channels.fetch(config.channelId);
                if (!channel || channel.type !== 0) continue; // التأكد أنه روم كتابي (GuildText)

                console.log(`[ready] تم العثور على القناة: ${config.channelId}`);
                
                // هنا البوت بيحاول يحدث التفاعلات لو فيه رسالة قديمة
                // لو حابب يبعت الرسالة تلقائياً أول ما يفتح، نقدر نضيف الكود هنا
            } catch (err) {
                console.error(`[ready] فشل الوصول للقناة ${config.channelId}:`, err);
            }
        }
    } catch (error) {
        console.error("[ready] خطأ في تشغيل ملف ready:", error);
    }
};
