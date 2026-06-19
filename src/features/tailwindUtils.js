import path from "path";
import fs from "fs-extra";
import { runStep } from "../utils/runStep.js";

export async function setupTailwindUtils(targetDir) {
  await runStep("Adding clsx + tailwind-merge utils...", async () => {
    // Create lib/ directory at project root (no src/ dir)
    const libDir = path.join(targetDir, "lib");
    await fs.ensureDir(libDir);

    // cn() helper — merges Tailwind classes safely, deduplicates conflicts
    const utilsContent = `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely.
 * Resolves class conflicts (e.g. p-4 + p-2 → p-2) and
 * supports conditional classes via clsx syntax.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-sm')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

    await fs.writeFile(path.join(libDir, "utils.ts"), utilsContent, "utf-8");
  });
}
