import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupReleaseIt(targetDir) {
  await runStep("Configuring release-it...", async () => {
    const config = {
      git: {
        commitMessage: "chore: release v${version}",
        tagName: "v${version}",
        requireCleanWorkingDir: false,
      },
      npm: {
        publish: false,
      },
      github: {
        release: false,
      },
      plugins: {
        "@release-it/conventional-changelog": {
          preset: "conventionalcommits",
          infile: "CHANGELOG.md",
          header: "# Changelog\n\nAll notable changes are documented here.\n",
        },
      },
    };

    const configPath = path.join(targetDir, ".release-it.json");

    if (await fs.pathExists(configPath)) {
      return "release-it already configured";
    }

    await fs.writeJson(path.join(targetDir, ".release-it.json"), config, {
      spaces: 2,
    });
  });
}
