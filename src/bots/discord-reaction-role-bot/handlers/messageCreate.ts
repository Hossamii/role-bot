const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { getConfig } = require("../util/getConfig");

module.exports = async (message) => {
    if (message.author.bot) return;

    if (message.content === 'Y') {
        const config = getConfig(message); 
        if (!config) return;

        const data = config[0]; 

        const embed = new EmbedBuilder()
            .setTitle(data.embedTitle)
            .setDescription(data.embedDescription)
            .setColor(data.embedColor);

        const rows = [];
        let currentRow = new ActionRowBuilder();

        data.buttons.forEach((btn, index) => {
            const cleanLabel = btn.label.replace(/##/g, "").replace(/:[^:]+:/g, "").trim();
            
            const button = new ButtonBuilder()
                .setLabel(cleanLabel)
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`role_${index}`);

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

        await message.channel.send({ embeds: [embed], components: rows });
        await message.delete().catch(() => {}); 
    }
};
