const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");

function autoFix(raw) {
    if (!raw) return "";
    return raw.replace(/(\s*\[\s*\]\s*,\s*)+/g, "\n").trim();
}

function getConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return [];
        const raw = fs.readFileSync(CONFIG_PATH, "utf8");
        const fixed = autoFix(raw);
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
        console.error("[config] Failed to load config.json:", err.message);
        return [];
    }
}

// السطر ده هو السر اللي هيخلي ملف الـ Y يشوف الدالة
module.exports = { getConfig };
