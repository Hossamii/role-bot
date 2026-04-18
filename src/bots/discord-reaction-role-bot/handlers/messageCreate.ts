const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { getConfig } = require("../util/getConfig");

module.exports = async (message) => {
    // التأكد إن الرسالة مش من بوت وإنها موجودة فعلاً
    if (!message || !message.author || message.author.bot) return;

    // لو المحتوى هو حرف Y كابيتال
    if (message.content === 'Y') {
        try {
            const config = getConfig(message); 
            if (!config || !config[0]) return;

            const data = config[0]; 

            const embed = new EmbedBuilder()
                .setTitle(data.embedTitle || "الرتب")
                .setDescription(data.embedDescription || "اختر رتبتك من الأزرار أدناه")
                .setColor(data.embedColor || "#0099ff");

            const rows = [];
            let currentRow = new ActionRowBuilder();

            data.buttons.forEach((btn, index) => {
                // تنظيف الاسم من أي رموز
                const cleanLabel = btn.label.replace(/##/g, "").replace(/:[^:]+:/g, "").trim();
                
                const button = new ButtonBuilder()
                    .setLabel(cleanLabel)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`role_${index}`);

                // إضافة إيموجي لو موجود في النص
                const emojiMatch = btn.label.match(/:([^:]+):/);
                if (emojiMatch) {
                    button.setEmoji(emojiMatch[0]); 
                }

                if (currentRow.components.length < 5) {
                    currentRow.addComponents(button);
                } else {
                    rows.push(currentRow);
                    currentRow = new ActionRowBuilder().addComponents(button);
                }
            });

            if (currentRow.components.length > 0) rows.push(currentRow);

            // إرسال الرسالة
            await message.channel.send({ embeds: [embed], components: rows });
            
            // مسح حرف الـ Y
            await message.delete().catch(() => {}); 
            
        } catch (error) {
            console.error("Error in Y command:", error);
        }
    }
};
