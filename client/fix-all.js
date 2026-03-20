/**
 * Run this from your client folder:
 *   node fix-all.js
 *
 * It walks the entire src directory, finds every .js/.jsx file
 * where line 1 starts with "port " (missing "im"), and prepends "im".
 * Safe to run multiple times — skips already-correct files.
 */

const fs = require("fs");
const path = require("path");

let fixed = 0;
let skipped = 0;
let alreadyOk = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (entry.endsWith(".js") || entry.endsWith(".jsx")) {
      try {
        const raw = fs.readFileSync(full);

        // Strip BOM if present (EF BB BF)
        let content;
        if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
          content = raw.slice(3).toString("utf8");
          fs.writeFileSync(full, content, "utf8");
          console.log("BOM stripped:", full);
        } else {
          content = raw.toString("utf8");
        }

        // Fix truncated "port " at start of file
        if (content.startsWith("port ")) {
          // Guard against double-fixing
          fs.writeFileSync(full, "im" + content, "utf8");
          console.log("Fixed:", full);
          fixed++;
        } else if (content.startsWith("imim")) {
          // Was fixed twice — remove the extra "im"
          fs.writeFileSync(full, content.slice(2), "utf8");
          console.log("Double-fix corrected:", full);
          fixed++;
        } else {
          alreadyOk++;
        }
      } catch (e) {
        console.error("Error processing", full, e.message);
        skipped++;
      }
    }
  }
}

const srcDir = path.join(__dirname, "src");
if (!fs.existsSync(srcDir)) {
  console.error('ERROR: "src" folder not found. Make sure you run this from the client folder.');
  process.exit(1);
}

walk(srcDir);

console.log("\n=== Done ===");
console.log("Fixed:     ", fixed);
console.log("Already OK:", alreadyOk);
console.log("Skipped:   ", skipped);