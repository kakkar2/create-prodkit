import inquirer from "inquirer";
import path from "path";
import fs from "fs";

export async function getProjectOptions(projectNameArg) {
  const answers = await inquirer.prompt([
    // ── 1. Project name ──────────────────────────────────────────
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: projectNameArg || "my-next-app",
      when: !projectNameArg,
      validate: (input) => {
        if (!input.trim()) return "Project name cannot be empty";
        if (!/^[a-z0-9-_]+$/.test(input))
          return "Only lowercase letters, numbers, - and _ allowed";
        return true;
      },
    },

    // ── 2. Package manager ───────────────────────────────────────
    {
      type: "list",
      name: "packageManager",
      message: "Package manager:",
      choices: ["npm", "yarn", "pnpm"],
      default: "npm",
    },

    // ── 3. Feature selection ─────────────────────────────────────
    {
      type: "checkbox",
      name: "features",
      message: "Select features to include:",
      choices: [
        {
          name: "Tailwind CSS  (+ clsx & tailwind-merge cn helper)",
          value: "tailwind",
          checked: true,
        },
        {
          name: "ESLint + Prettier",
          value: "eslint",
          checked: true,
        },
        {
          name: "Husky  (git hooks + pre-commit lint-staged)",
          value: "husky",
          checked: false,
        },
        {
          name: "release-it  (changelog + semantic versioning)",
          value: "release-it",
          checked: false,
        },
        {
          name: "Absolute imports  (@/* → root, @components/*, @lib/*, @hooks/*)",
          value: "absolute-imports",
          checked: true,
        },
      ],
    },

    // ── 4. Husky hook selection ───────────────────────────────────
    {
      type: "checkbox",
      name: "huskyHooks",
      message: "Which git hooks do you want?",
      choices: [
        {
          name: "pre-commit  → lint-staged (lint + format changed files)",
          value: "pre-commit",
          checked: true,
        },
        {
          name: "commit-msg  → commitlint (enforce conventional commits)",
          value: "commit-msg",
          checked: false,
        },
      ],
      when: (ans) => ans.features.includes("husky"),
    },

    // ── 5. Confirm before doing anything ─────────────────────────
    {
      type: "confirm",
      name: "confirm",
      message: (ans) => {
        const name = projectNameArg || ans.projectName;
        return `Create project "${name}" with selected options?`;
      },
      default: true,
    },
  ]);

  const projectName = projectNameArg || answers.projectName;

  return {
    projectName,
    packageManager: answers.packageManager,
    features: answers.features,
    huskyHooks: answers.huskyHooks || [],
    confirmed: answers.confirm,
  };
}
