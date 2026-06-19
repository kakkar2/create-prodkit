import path from "path";
import fs from "fs-extra";
import { logger } from "./logger.js";

export async function modifyPackageJson(targetDir, features, packageManager, huskyHooks = []) {
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);

  pkg.devDependencies = pkg.devDependencies || {};
  pkg.dependencies = pkg.dependencies || {};
  pkg.scripts = pkg.scripts || {};

  // ── Tailwind utils ─────────────────────────────────────────────
  if (features.includes("tailwind")) {
    // Runtime deps — used directly in component code
    pkg.dependencies["clsx"] = "^2.1.0";
    pkg.dependencies["tailwind-merge"] = "^2.3.0";
  }

  // ── ESLint + Prettier ──────────────────────────────────────────
  if (features.includes("eslint")) {
    pkg.devDependencies["prettier"] = "^3.2.0";
    pkg.devDependencies["eslint-config-prettier"] = "^9.1.0";
    pkg.devDependencies["@trivago/prettier-plugin-sort-imports"] = "^4.3.0";
  }

  // ── Husky ──────────────────────────────────────────────────────
  if (features.includes("husky")) {
    pkg.devDependencies["husky"] = "^9.0.0";
    pkg.devDependencies["lint-staged"] = "^15.2.0";
    pkg["lint-staged"] = {
      "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
      "**/*.{json,css,md}": ["prettier --write"],
    };
    // prepare runs husky on npm install — safe because husky
    // skips silently when .git is absent (e.g. in Docker/CI)
    pkg.scripts["prepare"] = "husky";

    // commitlint packages — only needed when commit-msg hook is selected
    if (huskyHooks.includes("commit-msg")) {
      pkg.devDependencies["@commitlint/cli"] = "^19.0.0";
      pkg.devDependencies["@commitlint/config-conventional"] = "^19.0.0";
    }
  }

  // ── release-it ────────────────────────────────────────────────
  if (features.includes("release-it")) {
    pkg.devDependencies["release-it"] = "^17.0.0";
    pkg.devDependencies["@release-it/conventional-changelog"] = "^8.0.0";
    pkg.scripts["release"] = "release-it";
    pkg.scripts["release:patch"] = "release-it patch";
    pkg.scripts["release:minor"] = "release-it minor";
    pkg.scripts["release:major"] = "release-it major";
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  logger.success("package.json updated");
}
