const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");

function autoFix(raw) {
    return raw.replace(/(\s*\[\s*\]\s*,\s*)+/g, "\n").trim();
}

function getConfig() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, "utf8");
        const fixed = autoFix(raw);
        return JSON.parse(fixed);
    } catch (err) {
        console.error("[config] Failed to load config.json:", err.message);
        return [];
    }
}

module.exports = { getConfig };
