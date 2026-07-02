import { Command } from "commander";
import { createRequire } from "module";
import { getInitOptions } from "./prompts.js";
import { installFeatures } from "./installer.js";
import pc from "picocolors";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

export async function run() {
  program
    .name("create-prodkit")
    .description("Add production-ready DX tooling to any project")
    .version(version);

  program
    .command("init")
    .description(
      "Set up Husky, commitlint, release-it and Prettier in your project",
    )
    .option("-y, --yes", "skip prompts and use all defaults")
    .action(async (cmdOptions) => {
      console.log();
      console.log(pc.bold(pc.cyan("  >> create-prodkit")));
      console.log(pc.dim("  Production-ready DX tooling for any project\n"));

      try {
        const options = await getInitOptions(cmdOptions.yes);

        if (!options.confirmed) {
          console.log(pc.dim("\n  Cancelled.\n"));
          process.exit(0);
        }

        await installFeatures(options);
      } catch (err) {
        if (err.name === "ExitPromptError") {
          console.log(pc.dim("\n\n  Cancelled.\n"));
          process.exit(0);
        }
        throw err;
      }
    });

  // show usage hint if no subcommand given
  program.action(() => {
    console.log();
    console.log(pc.bold(pc.cyan("  >> create-prodkit")));
    console.log(pc.dim("  Production-ready DX tooling for any project\n"));
    console.log(pc.white("  Run inside your project folder:"));
    console.log(pc.bold(pc.green("    npx create-prodkit init\n")));
  });

  process.on("SIGINT", () => {
    console.log(pc.dim("\n\n  Cancelled.\n"));
    process.exit(0);
  });

  program.parse();
}
