import { Client, GatewayIntentBits, Partials } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!TOKEN) {
  console.error("ERROR: DISCORD_BOT_TOKEN environment variable is not set.");
  process.exit(1);
}

const botsDir = path.join(__dirname, "bots");
const botFolders = fs.readdirSync(botsDir).filter((f) =>
  fs.statSync(path.join(botsDir, f)).isDirectory()
);

const allHandlers: Record<string, Function[]> = {};

for (const botFolder of botFolders) {
  const botPath = path.join(botsDir, botFolder);
  const handlersPath = path.join(botPath, "handlers");

  if (fs.existsSync(handlersPath)) {
    const handlerFiles = fs.readdirSync(handlersPath).filter((f) =>
      f.endsWith(".ts") || f.endsWith(".js")
    );

    for (const handlerFile of handlerFiles) {
      const rawName = handlerFile.replace(/\.(ts|js)$/, "");
      const eventName = rawName === "ready" ? "clientReady" : rawName;
      const handlerFn = require(path.join(handlersPath, handlerFile));
      if (!allHandlers[eventName]) {
        allHandlers[eventName] = [];
      }
      allHandlers[eventName].push(handlerFn);
    }
  }
}

const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent, // ضيف السطر ده هنا
  ],

  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

for (const [eventName, handlers] of Object.entries(allHandlers)) {
  for (const handler of handlers) {
    client.on(eventName, (...args: any[]) => handler(client, ...args));
  }
}
// 1. استدعاء الملف (تأكد من المسار)
const messageHandler = require('./bots/discord-reaction-role-bot/handlers/messageCreate');

// 2. سماع الرسائل (لازم يكون قبل سطر الـ login)
client.on('messageCreate', async (message) => {
    // السطر ده هيعرفنا في الـ Console لو البوت شاف رسالتك
    console.log(`Message received: ${message.content}`);

    try {
        await messageHandler(message);
    } catch (err) {
        console.error("Error in message handler:", err);
    }
});

// 3. تسجيل الدخول (دايماً خليه آخر سطر)
client.login(TOKEN).then(() => {
    console.log(`Bot logged in as ${client.user?.tag}`);
}).catch((err) => {
    console.error("Failed to login:", err.message);
});
