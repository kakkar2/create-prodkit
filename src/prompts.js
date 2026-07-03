import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import { detectPackageManager } from "./utils/detectPackageManager.js";

export async function getInitOptions(skipPrompts = false) {
  const cwd = process.cwd();

  const hasPkg = await fs.pathExists(path.join(cwd, "package.json"));
  if (!hasPkg) {
    throw new Error(
      "No package.json found. Run create-prodkit init inside an existing project.",
    );
  }

  const detectedPm = await detectPackageManager(cwd);

  // Detect whether package manager came from a lockfile
  const hasPnpmLock = await fs.pathExists(path.join(cwd, "pnpm-lock.yaml"));

  const hasYarnLock = await fs.pathExists(path.join(cwd, "yarn.lock"));

  const hasNpmLock = await fs.pathExists(path.join(cwd, "package-lock.json"));

  const packageManagerDetected = hasPnpmLock || hasYarnLock || hasNpmLock;

  // --yes flag — skip all prompts, use sensible defaults
  if (skipPrompts) {
    return {
      targetDir: cwd,
      packageManager: detectedPm,
      features: ["husky", "release-it", "prettier"],
      huskyHooks: ["pre-commit", "commit-msg"],
      confirmed: true,
    };
  }

  const questions = [];

  // Only ask if we couldn't confidently detect package manager
  if (!packageManagerDetected) {
    questions.push({
      type: "list",
      name: "packageManager",
      message: "Select package manager",
      choices: ["npm", "yarn", "pnpm"],
      default: detectedPm,
    });
  }

  questions.push(
    {
      type: "checkbox",
      name: "features",
      message: "What do you want to set up?",
      choices: [
        {
          name: "Husky (git hooks)",
          value: "husky",
          checked: true,
        },
        {
          name: "release-it (changelog + semantic versioning)",
          value: "release-it",
          checked: true,
        },
        {
          name: "Prettier + ESLint config",
          value: "prettier",
          checked: true,
        },
        {
          name: "cn() utility (clsx + tailwind-merge)",
          value: "cn-util",
          checked: false,
        },
      ],
      validate: (input) => input.length > 0 || "Select at least one feature",
    },
    {
      type: "checkbox",
      name: "huskyHooks",
      message: "Which git hooks?",
      choices: [
        {
          name: "pre-commit → lint-staged",
          value: "pre-commit",
          checked: true,
        },
        {
          name: "commit-msg → commitlint",
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
  );

  const answers = await inquirer.prompt(questions);

  return {
    targetDir: cwd,
    packageManager: answers.packageManager || detectedPm,
    features: answers.features,
    huskyHooks: answers.huskyHooks || [],
    confirmed: answers.confirm,
  };
}
