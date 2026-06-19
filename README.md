# create-next-starter

A CLI to scaffold a production-ready Next.js project with only the tools you actually want — no bloat, no manual setup every time.

## Usage

```bash
npx create-next-starter my-app
```

Or scaffold into the current folder:

```bash
npx create-next-starter .
```

## What it sets up

When you run the CLI it asks a few questions then sets everything up in one shot:

**Package manager** — choose between npm, yarn, or pnpm

**Features** — pick what you need:

| Feature           | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| Tailwind CSS      | Installed via `create-next-app` + `cn()` utility helper |
| ESLint + Prettier | Prettier config with import sorting                     |
| Husky             | Git hooks with lint-staged pre-commit                   |
| release-it        | Changelog generation + semantic versioning              |
| Absolute imports  | `@/*`, `@components/*`, `@lib/*`, `@hooks/*`            |

## Project structure

Projects are scaffolded with the `app/` directory at the root (no `src/` wrapper):

```
my-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/     ← added if absolute-imports selected
├── lib/
│   └── utils.ts   ← cn() helper (added if Tailwind selected)
├── hooks/
├── public/
├── next.config.ts
└── package.json
```

## Feature details

### Tailwind CSS

Installed via the `create-next-app` `--tailwind` flag. When selected, two utilities are also added:

- `clsx` — conditional class helper
- `tailwind-merge` — merges Tailwind classes without conflicts

A `lib/utils.ts` file is created with a ready-to-use `cn()` helper:

```ts
import { cn } from '@/lib/utils'

// Conditional classes, deduplication, conflict resolution — all handled
<div className={cn('px-4 py-2', isActive && 'bg-blue-500', 'text-sm')} />
```

### ESLint + Prettier

Adds `.prettierrc` with sane defaults — single quotes, no semicolons, 100 char print width. Also adds `@trivago/prettier-plugin-sort-imports` which auto-sorts your imports on save:

```ts
import { useState } from 'react'

import Link from 'next/link'

import axios from 'axios'

import { Button } from '@/components/ui/button'
```

### Husky

Sets up `.husky/` with your choice of hooks:

- `pre-commit` — runs lint-staged on changed files only before every commit
- `commit-msg` — runs commitlint to enforce conventional commit format (installs `@commitlint/cli` + `@commitlint/config-conventional` automatically)

### release-it

Replaces the deprecated `standard-version`. Adds `npm run release` scripts and a `.release-it.json` config with conventional changelog:

```bash
npm run release          # auto bump + generate CHANGELOG.md
npm run release:patch    # force patch bump
npm run release:minor    # force minor bump
npm run release:major    # force major bump
```

### Absolute imports

Extends `tsconfig.json` with path aliases so you never write `../../../` again:

```ts
import { Button } from '@/components/ui/button'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@lib/utils'
```

## Requirements

- Node.js 18+
- Git installed (required if Husky selected)

## License

MIT
