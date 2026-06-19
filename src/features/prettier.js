import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupPrettier(targetDir) {
  await runStep("Adding Prettier config...", async () => {
    await fs.writeJson(
      path.join(targetDir, ".prettierrc"),
      {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
        printWidth: 100,
        plugins: ["@trivago/prettier-plugin-sort-imports"],
        importOrder: [
          "^react(.*)$",
          "^next(.*)$",
          "<THIRD_PARTY_MODULES>",
          "^@/(.*)$",
          "^[./]",
        ],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      },
      { spaces: 2 },
    );

    const eslintPath = path.join(targetDir, ".eslintrc.json");
    if (await fs.pathExists(eslintPath)) {
      const eslint = await fs.readJson(eslintPath);
      eslint.extends = [...(eslint.extends || []), "prettier"];
      await fs.writeJson(eslintPath, eslint, { spaces: 2 });
    }
  });
}
