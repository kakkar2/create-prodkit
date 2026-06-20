import { Command } from "commander";
import { createRequire } from "module";
import { getProjectOptions } from "./prompts.js";
import { createProject } from "./scaffold.js";
import pc from "picocolors";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

export async function run() {
  program
    .name("create-prodkit")
    .description("Scaffold a production-ready project")
    .version(version)
    .argument("[project-name]", "Name of the project folder to create")
    .action(async (projectName) => {
      console.log();
      console.log(pc.bold(pc.cyan("  >> create-prodkit")));
      console.log(pc.dim("  A production-ready project scaffold\n"));

      try {
        const options = await getProjectOptions(projectName);

        if (!options.confirmed) {
          console.log(pc.dim("\n  Cancelled.\n"));
          process.exit(0);
        }

        await createProject(options);
      } catch (error) {
        if (err.name === "ExitPromptError") {
          console.log(pc.dim("\n\n  Cancelled.\n"));
          process.exit(0);
        }
        throw err;
      }
    });

  process.on("SIGINT", () => {
    console.log(pc.dim("\n\n  Cancelled.\n"));
    process.exit(0);
  });

  program.parse();
}
