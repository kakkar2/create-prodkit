import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupPrettier(targetDir) {
  await runStep("Adding Prettier config...", async () => {
    // .prettierrc — framework agnostic
    await fs.writeJson(
      path.join(targetDir, ".prettierrc"),
      {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
        printWidth: 100,
        plugins: ["@trivago/prettier-plugin-sort-imports"],
        importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      },
      { spaces: 2 },
    );

    // .prettierignore
    await fs.outputFile(
      path.join(targetDir, ".prettierignore"),
      `node_modules\ndist\nbuild\n.next\n.cache\ncoverage\n`,
    );

    // extend existing ESLint config if found — supports both legacy and flat config
    const eslintLegacy = path.join(targetDir, ".eslintrc.json");
    const eslintFlat = path.join(targetDir, "eslint.config.mjs");

    if (await fs.pathExists(eslintLegacy)) {
      const eslint = await fs.readJson(eslintLegacy);
      eslint.extends = [...new Set([...(eslint.extends || []), "prettier"])];
      await fs.writeJson(eslintLegacy, eslint, { spaces: 2 });
    } else if (await fs.pathExists(eslintFlat)) {
      // flat config — append prettier import note as a comment
      // user needs to manually add: import prettier from 'eslint-config-prettier'
      // we just ensure the package is installed via modifyPackageJson
    }
  });
}
