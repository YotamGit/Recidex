import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");

export async function loadJsonFromData(file, subFolder = "") {
  const fullPath = path.join(serverRoot, "data", subFolder, `${file}.json`);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}
