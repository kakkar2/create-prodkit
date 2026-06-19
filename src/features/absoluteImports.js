import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupAbsoluteImports(targetDir) {
  await runStep("Configuring absolute imports...", async () => {
    const tsconfigPath = path.join(targetDir, "tsconfig.json");
    const tsconfig = await fs.readJson(tsconfigPath);

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.baseUrl = ".";
    // Merge with any existing paths (create-next-app sets @/* already)
    tsconfig.compilerOptions.paths = {
      ...(tsconfig.compilerOptions.paths || {}),
      "@/*": ["./*"],              // root alias
      "@components/*": ["./components/*"],
      "@lib/*": ["./lib/*"],
      "@hooks/*": ["./hooks/*"],
    };

    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
  });
}
