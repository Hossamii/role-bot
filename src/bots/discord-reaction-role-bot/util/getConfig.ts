import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.join(__dirname, "..", "config.json");

function autoFix(raw: string): string {
    if (!raw) return "";
    return raw.replace(/(\s*\[\s*\]\s*,\s*)+/g, "\n").trim();
}

export function getConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return [];
        const raw = fs.readFileSync(CONFIG_PATH, "utf8");
        const fixed = autoFix(raw);
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err: any) {
        console.error("[config] Failed to load config.json:", err.message);
        return [];
    }
}
