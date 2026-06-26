import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import { detectPackageManager } from "./utils/detectPackageManager.js";

export async function getInitOptions() {
  const cwd = process.cwd();

  // guard — must be run inside an existing project
  const hasPkg = await fs.pathExists(path.join(cwd, "package.json"));
  if (!hasPkg) {
    throw new Error(
      "No package.json found. Run create-prodkit init inside an existing project.",
    );
  }

  const detectedPm = await detectPackageManager(cwd);

  const answers = await inquirer.prompt([
    // Package manager
    {
      type: "list",
      name: "packageManager",
      message: `Package manager: (detected: ${detectedPm})`,
      choices: ["npm", "yarn", "pnpm"],
      default: detectedPm,
    },

    // Feature selection
    {
      type: "checkbox",
      name: "features",
      message: "What do you want to set up?",
      choices: [
        {
          name: "Husky  (git hooks)",
          value: "husky",
          checked: true,
        },
        {
          name: "release-it  (changelog + semantic versioning)",
          value: "release-it",
          checked: true,
        },
        {
          name: "Prettier + ESLint config",
          value: "prettier",
          checked: true,
        },
      ],
      validate: (input) => input.length > 0 || "Select at least one feature",
    },

    {
      name: "cn() utility  (clsx + tailwind-merge for Tailwind projects)",
      value: "cn-util",
      checked: false,
    },

    {
      type: "checkbox",
      name: "huskyHooks",
      message: "Which git hooks?",
      choices: [
        {
          name: "pre-commit  → lint-staged (lint + format on every commit)",
          value: "pre-commit",
          checked: true,
        },
        {
          name: "commit-msg  → commitlint (enforce conventional commits)",
          value: "commit-msg",
          checked: true,
        },
      ],
      when: (ans) => ans.features.includes("husky"),
      validate: (input) => input.length > 0 || "Select at least one hook",
    },

    {
      type: "confirm",
      name: "confirm",
      message: "Set up selected tools in this project?",
      default: true,
    },
  ]);

  return {
    targetDir: cwd,
    packageManager: answers.packageManager,
    features: answers.features,
    huskyHooks: answers.huskyHooks || [],
    confirmed: answers.confirm,
  };
}
