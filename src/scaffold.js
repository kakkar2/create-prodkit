import path from "path";
import fs from "fs";
import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";
import { logger } from "./utils/logger.js";
import { installFeatures } from "./installer.js";

export async function createProject(options) {
  const { projectName, packageManager, features } = options;

  // ── 1. Resolve target directory ───────────────────────────────
  const isSameDir = projectName === ".";
  const targetDir = isSameDir
    ? process.cwd()
    : path.resolve(process.cwd(), projectName);

  const appName = isSameDir ? path.basename(process.cwd()) : projectName;

  // ── 2. Check if folder exists and has files ───────────────────
  if (!isSameDir && fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      logger.error(`Folder "${projectName}" already exists and is not empty.`);
      logger.dim("Delete it or choose a different name.");
      process.exit(1);
    }
  }

  // ── 3. Build create-next-app args ─────────────────────────────
  const nextArgs = [
    "create-next-app@latest",
    isSameDir ? "." : projectName,
    "--typescript",
    "--app",        // use App Router
    "--no-src-dir", // scaffold app/ at root (not inside src/)
    "--no-git",     // we'll init git ourselves if husky selected
    "--no-install", // we'll run install ourselves
    "--import-alias",
    "@/*",          // default alias → maps to ./* at root
    `--use-${packageManager}`,
  ];

  // if tailwind selected, pass the flag — otherwise skip it
  if (features.includes("tailwind")) {
    nextArgs.push("--tailwind");
  } else {
    nextArgs.push("--no-tailwind");
  }

  // ESLint flag
  if (features.includes("eslint")) {
    nextArgs.push("--eslint");
  } else {
    nextArgs.push("--no-eslint");
  }

  // ── 4. Run create-next-app ────────────────────────────────────
  logger.step("Creating Next.js project...");

  const spinner = ora({
    text: "Running create-next-app...",
    color: "cyan",
  }).start();

  try {
    await execa("npx", nextArgs, {
      cwd: isSameDir ? targetDir : process.cwd(),
      stdio: "pipe", // suppress create-next-app's own output
    });
    spinner.succeed(pc.green("Next.js project created"));
  } catch (err) {
    spinner.fail("create-next-app failed");
    logger.error(err.message);
    process.exit(1);
  }

  // ── 5. Install selected features ──────────────────────────────
  await installFeatures({
    ...options,
    targetDir,
    appName,
  });

  // ── 6. Done ───────────────────────────────────────────────────
  printSuccess({ appName, isSameDir, projectName, packageManager });
}

// ── Success message ────────────────────────────────────────────
function printSuccess({ appName, isSameDir, projectName, packageManager }) {
  const runCmd =
    packageManager === "npm" ? "npm run dev" : `${packageManager} dev`;

  console.log();
  console.log(pc.bold(pc.green("  ✔ Project ready!")));
  console.log();

  if (!isSameDir) {
    console.log(pc.dim("  Next steps:"));
    console.log(pc.cyan(`    cd ${projectName}`));
  }

  console.log(pc.cyan(`    ${runCmd}`));
  console.log();
}
