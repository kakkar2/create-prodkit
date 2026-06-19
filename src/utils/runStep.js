import ora from "ora";
import pc from "picocolors";
import { logger } from "./logger.js";

// ASCII spinner frames — work on every terminal including Git Bash
const spinner_frames =
  process.platform === "win32"
    ? ["-", "\\", "|", "/"] // ASCII fallback for Windows
    : ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]; // nice on Mac/Linux

export async function runStep(message, fn) {
  const spinner = ora({
    text: message,
    color: "cyan",
    spinner: {
      interval: 80,
      frames: spinner_frames,
    },
  }).start();

  try {
    await fn();
    spinner.succeed(pc.green(message.replace("...", " done")));
  } catch (err) {
    spinner.fail(pc.red(message.replace("...", " failed")));
    logger.error(err.message);
    process.exit(1);
  }
}
