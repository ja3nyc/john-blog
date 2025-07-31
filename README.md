# JA3NYC Monorepo

This is a Turborepo monorepo containing John Annunziato III's projects.

## Apps

- **blog** (`@ja3nyc/blog`) - Personal blog built with TanStack Start, React, and TypeScript

## Getting Started

```bash
# Install dependencies
bun install

# Start development server for blog
bun run blog:dev

# Or start all apps
bun run dev
```

## Building

```bash
# Build blog
bun run blog:build

# Or build all apps
bun run build
```

## Project Structure

```
.
├── apps/
│   └── blog/          # Personal blog application
├── packages/          # Shared packages (future)
├── turbo.json         # Turborepo configuration
└── package.json       # Root package.json
```

## Tech Stack

- React + TypeScript
- Tailwind CSS
- MDX for blog posts

## Contact

- Twitter: [@ja3nyc](https://twitter.com/ja3nyc)
- GitHub: [@ja3nyc](https://github.com/ja3nyc)
- Email: john@caltho.com

