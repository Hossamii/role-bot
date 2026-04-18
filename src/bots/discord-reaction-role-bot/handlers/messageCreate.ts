const fs = require("fs");
const path = require("path");

// تحديد مسار ملف الإعدادات
const CONFIG_PATH = path.join(__dirname, "..", "config.json");

/**
 * دالة لتنظيف ملف الـ JSON لو فيه أخطاء بسيطة في التنسيق
 */
function autoFix(raw) {
    if (!raw) return "";
    return raw.replace(/(\s*\[\s*\]\s*,\s*)+/g, "\n").trim();
}

/**
 * الدالة الأساسية لجلب الإعدادات
 */
function getConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.error("[config] ملف config.json غير موجود في المسار:", CONFIG_PATH);
            return [];
        }

        const raw = fs.readFileSync(CONFIG_PATH, "utf8");
        const fixed = autoFix(raw);
        const parsed = JSON.parse(fixed);

        // التأكد إن البيانات دايمًا بترجع في شكل مصفوفة (Array)
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
        console.error("[config] فشل في تحميل config.json:", err.message);
        return [];
    }
}

// تصدير الدالة باسم getConfig عشان ملف messageCreate يقدر يشوفها
module.exports = { getConfig };
