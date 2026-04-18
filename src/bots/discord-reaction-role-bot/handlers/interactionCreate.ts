try {
    const configs = getConfig(); // جلب الكائن مباشرة
    if (!configs) return;

    // بما أن الملف كائن واحد (Object) وليس مصفوفة، نستخدم configs مباشرة
    const data = configs; 

    const buttonIndex = parseInt(interaction.customId.replace("role_", ""));
    const buttonConfig = data.buttons[buttonIndex];
    
    if (!buttonConfig) return;

    const manager = new ButtonRoleManager(interaction, data, buttonConfig);
    await manager.handleRoles();
}
