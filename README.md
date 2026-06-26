# create-prodkit

A CLI that adds production-ready DX tooling to any existing project in one command — Husky, commitlint, release-it, and Prettier. Works with Next.js, Vite, Express, or any Node.js project.

## Usage

Run inside any existing project:

```bash
npx create-prodkit init
```

It detects your package manager automatically, asks what you want, and sets everything up in one shot.

## What it sets up

| Feature           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| Husky             | Git hooks via pre-commit and commit-msg             |
| commitlint        | Enforces conventional commit format on every commit |
| release-it        | Semantic versioning + auto-generated CHANGELOG.md   |
| Prettier + ESLint | Formatter config with import sorting                |
| cn() utility      | clsx + tailwind-merge helper for Tailwind projects  |

## Feature details

### Husky + commitlint

Sets up `.husky/` with your choice of hooks:

- `pre-commit` — runs lint-staged, lints and formats only changed files
- `commit-msg` — runs commitlint to enforce conventional commit format

Conventional commit format looks like:

```bash
feat: add dark mode toggle
fix: resolve hydration mismatch on auth page
chore: update dependencies
```

When `commit-msg` is selected, `@commitlint/cli` and `@commitlint/config-conventional` are installed and configured automatically.

### release-it

Adds a `.release-it.json` config and release scripts to your `package.json`:

```bash
npm run release          # auto bump based on commits + generate CHANGELOG.md
npm run release:patch    # force patch bump (0.0.x)
npm run release:minor    # force minor bump (0.x.0)
npm run release:major    # force major bump (x.0.0)
```

Works best alongside commitlint — conventional commit messages let release-it determine the correct version bump automatically.

### Prettier + ESLint

Adds `.prettierrc` with sane defaults and `@trivago/prettier-plugin-sort-imports` which auto-sorts imports on save:

```ts
import axios from "axios";

import { Button } from "@/components/ui/button";

import { formatDate } from "./utils";
```

Also adds:

- `.prettierignore` — excludes `node_modules`, `dist`, `build`, `.next`, `coverage`
- `format` and `format:check` scripts to `package.json`
- `prettier` added to your ESLint extends if `.eslintrc.json` is found

### cn() utility

Optional — for Tailwind CSS projects only. Installs `clsx` and `tailwind-merge` and creates a `cn()` helper:

```ts
import { cn } from '@/lib/utils'

<div className={cn('px-4 py-2', isActive && 'bg-blue-500', 'text-sm')} />
```

Automatically detects:

- TypeScript vs JavaScript — generates `utils.ts` or `utils.js`
- `src/` layout vs root layout — places file in the right `lib/` folder

## Requirements

- Node.js 18+
- An existing project with a `package.json`
- Git installed (required if Husky selected)

## License

MIT
