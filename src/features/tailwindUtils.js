import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupTailwindUtils(targetDir) {
  await runStep("Adding cn() utility...", async () => {
    // detect TypeScript
    const isTs = await fs.pathExists(path.join(targetDir, "tsconfig.json"));
    const ext = isTs ? "ts" : "js";

    // detect src/ layout
    const hasSrc = await fs.pathExists(path.join(targetDir, "src"));
    const libDir = hasSrc
      ? path.join(targetDir, "src", "lib")
      : path.join(targetDir, "lib");

    const utilsTs = path.join(libDir, "utils.ts");
    const utilsJs = path.join(libDir, "utils.js");

    if ((await fs.pathExists(utilsTs)) || (await fs.pathExists(utilsJs))) {
      return; // already exists — skip silently
    }

    await fs.ensureDir(libDir);

    const content = isTs
      ? `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely.
 * Resolves conflicts (e.g. p-4 + p-2 → p-2) and
 * supports conditional classes via clsx syntax.
 *
 * @example cn('px-4', isActive && 'bg-blue-500', 'text-sm')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      : `import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely.
 * @example cn('px-4', isActive && 'bg-blue-500', 'text-sm')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`;

    await fs.writeFile(path.join(libDir, `utils.${ext}`), content, "utf-8");
  });
}
