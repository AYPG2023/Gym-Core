const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const seed = sandbox.window.GYM_SEED || {};
const storage = path.join(root, "storage");
const demo = path.join(storage, "demo");
fs.mkdirSync(storage, { recursive: true });
fs.mkdirSync(demo, { recursive: true });

for (const [collection, records] of Object.entries(seed)) {
  if (!Array.isArray(records)) continue;
  const json = JSON.stringify(records, null, 2);
  fs.writeFileSync(path.join(storage, `${collection}.json`), json);
  fs.writeFileSync(path.join(demo, `${collection}.json`), json);
}

if (seed.referralProgram) {
  const json = JSON.stringify([seed.referralProgram], null, 2);
  fs.writeFileSync(path.join(storage, "referralProgram.json"), json);
  fs.writeFileSync(path.join(demo, "referralProgram.json"), json);
}

console.log(`Migrated ${Object.keys(seed).length} seed collections.`);

