import { execa } from "execa";
import path from "path";
import fs from "fs-extra";
import { logger } from "./utils/logger.js";
import {
  setupPrettier,
  setupReleaseIt,
  setupHusky,
  setupTailwindUtils,
} from "./features/index.js";
import { runStep } from "./utils/runStep.js";
import { modifyPackageJson } from "./utils/modifyPackageJson.js";

export async function installFeatures(options) {
  const { targetDir, packageManager, features, huskyHooks } = options;

  // git init if needed (must be before husky)
  if (features.includes("husky")) {
    const gitExists = await fs.pathExists(path.join(targetDir, ".git"));
    if (!gitExists) {
      await runStep("Initializing git repo...", async () => {
        await execa("git", ["init"], { cwd: targetDir });
      });
    }
  }

  // Inject deps into package.json
  await modifyPackageJson(targetDir, features, packageManager, huskyHooks);

  // Install everything in one pass
  await runStep(
    `Installing dependencies with ${packageManager}...`,
    async () => {
      await execa(packageManager, ["install"], {
        cwd: targetDir,
        stdio: "pipe",
      });
    },
  );

  if (features.includes("husky")) {
    await setupHusky({ targetDir, huskyHooks });
  }

  if (features.includes("release-it")) {
    await setupReleaseIt(targetDir);
  }

  if (features.includes("prettier")) {
    await setupPrettier(targetDir);
  }

  if (features.includes("cn-util")) {
    await setupTailwindUtils(targetDir);
  }

  logger.success("All done! Your project is production-ready.\n");
}
