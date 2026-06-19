import { execa } from "execa";
import path from "path";
import fs from "fs-extra";
import { logger } from "./utils/logger.js";
import {
  setupAbsoluteImports,
  setupPrettier,
  setupReleaseIt,
  setupHusky,
  setupTailwindUtils,
} from "./features/index.js";
import { runStep } from "./utils/runStep.js";
import { modifyPackageJson } from "./utils/modifyPackageJson.js";

export async function installFeatures(options) {
  const { targetDir, packageManager, features, huskyHooks } = options;

  // ── 1. Modify package.json before install ─────────────────────
  // Pass huskyHooks so commitlint deps are added when commit-msg is selected
  await modifyPackageJson(targetDir, features, packageManager, huskyHooks);

  // ── 2. git init (must happen before husky setup) ──────────────
  if (features.includes("husky")) {
    await runStep("Initializing git repo...", async () => {
      await execa("git", ["init"], { cwd: targetDir });
    });
  }

  // ── 3. Single install pass (picks up all deps we just added) ──
  await runStep(
    `Installing dependencies with ${packageManager}...`,
    async () => {
      await execa(packageManager, ["install"], {
        cwd: targetDir,
        stdio: "pipe",
      });
    },
  );

  // ── 4. Husky setup ────────────────────────────────────────────
  if (features.includes("husky")) {
    await setupHusky({ targetDir, huskyHooks, packageManager });
  }

  // ── 5. release-it config ──────────────────────────────────────
  if (features.includes("release-it")) {
    await setupReleaseIt(targetDir);
  }

  // ── 6. Prettier config ────────────────────────────────────────
  if (features.includes("eslint")) {
    await setupPrettier(targetDir);
  }

  // ── 7. Tailwind utils (clsx + tailwind-merge cn helper) ───────
  if (features.includes("tailwind")) {
    await setupTailwindUtils(targetDir);
  }

  // ── 8. Absolute imports ───────────────────────────────────────
  if (features.includes("absolute-imports")) {
    await setupAbsoluteImports(targetDir);
  }

  logger.success("All features installed\n");
}
