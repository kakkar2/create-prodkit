import path from "path";
import fs from "fs-extra";
import { logger } from "./logger.js";

export async function modifyPackageJson(
  targetDir,
  features,
  packageManager,
  huskyHooks = [],
) {
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);

  pkg.devDependencies = pkg.devDependencies || {};
  pkg.scripts = pkg.scripts || {};

  // Husky
  if (features.includes("husky")) {
    pkg.devDependencies["husky"] = "^9.0.0";
    pkg.devDependencies["lint-staged"] = "^15.2.0";
    pkg["lint-staged"] = {
      "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
      "**/*.{json,css,md}": ["prettier --write"],
    };
    pkg.scripts["prepare"] = "husky";

    if (huskyHooks.includes("commit-msg")) {
      pkg.devDependencies["@commitlint/cli"] = "^19.0.0";
      pkg.devDependencies["@commitlint/config-conventional"] = "^19.0.0";
    }
  }

  // release-it
  if (features.includes("release-it")) {
    pkg.devDependencies["release-it"] = "^20.2.0";
    pkg.devDependencies["@release-it/conventional-changelog"] = "^11.0.1";
    pkg.scripts["release"] = "release-it";
    pkg.scripts["release:patch"] = "release-it patch";
    pkg.scripts["release:minor"] = "release-it minor";
    pkg.scripts["release:major"] = "release-it major";
  }

  // Prettier + ESLint
  if (features.includes("prettier")) {
    pkg.devDependencies["prettier"] = "^3.2.0";
    pkg.devDependencies["eslint-config-prettier"] = "^9.1.0";
    pkg.devDependencies["@trivago/prettier-plugin-sort-imports"] = "^4.3.0";
    pkg.scripts["format"] = "prettier --write .";
    pkg.scripts["format:check"] = "prettier --check .";
  }

  // clsx + tailwind-merge
  if (features.includes("cn-util")) {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies["clsx"] = "^2.1.0";
    pkg.dependencies["tailwind-merge"] = "^2.3.0";
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  logger.success("package.json updated");
}
