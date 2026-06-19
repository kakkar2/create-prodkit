import pc from "picocolors";

// these render correctly in Git Bash, PowerShell, Mac, Linux
const S = {
  info: pc.cyan("i"),
  success: pc.green("√"),
  warn: pc.yellow("‼"),
  error: pc.red("×"),
  rocket: pc.cyan(">>"),
  bullet: pc.dim("·"),
};

export const logger = {
  info: (msg) => console.log(S.info + "  " + msg),
  success: (msg) => console.log(S.success + "  " + msg),
  warn: (msg) => console.log(S.warn + "  " + msg),
  error: (msg) => console.log(S.error + "  " + msg),
  step: (msg) => console.log(pc.bold(pc.white("\n  " + msg))),
  dim: (msg) => console.log(pc.dim("  " + msg)),
};
