import * as fs from "fs";
import * as path from "path";
import { Config } from "../types";

const CONFIG_PATH = path.join(__dirname, "../config.json");

function autoFix(raw: string): string {
  // Fix the common pattern: [ }, { ... } ] → [ { ... } ]
  return raw.replace(/^\s*\[\s*\},\s*\{/m, "[\n  {");
}

export function loadConfigs(): Config[] {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const fixed = autoFix(raw);

    // If we fixed something, write it back so the file stays clean
    if (fixed !== raw) {
      fs.writeFileSync(CONFIG_PATH, fixed, "utf8");
      console.log("[config] Auto-fixed JSON syntax error in config.json");
    }

    return JSON.parse(fixed) as Config[];
  } catch (err: any) {
    console.error(`[config] Failed to load config.json: ${err.message}`);
    return [];
  }
}
