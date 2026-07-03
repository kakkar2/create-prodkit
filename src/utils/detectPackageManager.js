import path from "path";
import fs from "fs-extra";

export async function detectPackageManager(cwd) {
  if (await fs.pathExists(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (await fs.pathExists(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (await fs.pathExists(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  return "npm";
}
