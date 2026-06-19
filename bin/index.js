#!/usr/bin/env node

import { run } from "../src/cli.js";

// fix emoji rendering in Git Bash / Windows terminals
if (process.platform === "win32") {
  process.stdout.write("\u001b]0;\u001b\\"); // reset terminal title
}

run();
