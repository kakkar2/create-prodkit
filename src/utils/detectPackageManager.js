import fs from "fs-extra";
import path from "path";

export async function detectPackageManager(dir) {
  if (await fs.pathExists(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (await fs.pathExists(path.join(dir, "yarn.lock"))) return "yarn";
  return "npm";
}
