# Orion-Worship

Orion-Worship is a church presentation application for managing worship services, scripture passages, song lyrics, sermon notes, and live presentation output from a single interface.

Built with React, TypeScript, Vite, and TanStack Router, the app is designed to help teams run a service smoothly from a central workspace with slide navigation, media selection, and live display controls.

## Features

- Worship service management
- Slide-based presentation workflow
- Scripture, lyrics, and sermon content organization
- Media item selection and display
- Live output panel for the current presentation
- Presentation overlay mode for full-screen display
- Modern UI with Tailwind styling and reusable shadcn-style components

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router / TanStack Start
- Tailwind CSS
- Radix UI primitives
- ESLint + Prettier

## Project Structure

```text
.
├── src/
│   ├── components/
│   │   └── church/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── ui/
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   ├── styles.css
│   └── ...
├── .gitignore
├── .prettierignore
├── .prettierrc
├── components.json
├── eslint.config.js
├── package.json
├── project.json
├── README.md
├── tsconfig.json
├── bun.lock
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm

### Install dependencies

Using Bun:

```bash
bun install
```

Using npm:

```bash
npm install
```

### Run the app locally

```bash
bun run dev
```

or

```bash
npm run dev
```

Then open the local development URL shown in the terminal.

## Available Scripts

```bash
bun run dev
bun run build
bun run preview
bun run lint
bun run format
```

## Production Build

```bash
bun run build
```

or

```bash
npm run build
```

## Usage

The application is built around a single presentation workspace:

- Select a service item from the left panel
- Navigate slides in the center panel
- Preview or present the output on the right panel
- Use the presentation overlay for full-screen display

This makes it suitable for church services where worship leaders and presenters need to coordinate song lyrics, scripture, and sermon content live.

## Notes

This project is currently a focused presentation tool and is best suited for a church or ministry context where content needs to be delivered cleanly and consistently during live events.

## License

This project is currently unlicensed. If you plan to share or distribute it publicly, consider adding an appropriate license file.

## Contributing

Contributions are welcome. If you’d like to help improve the app, fork the repository, make your changes, and open a pull request.

## Repository

- GitHub: https://github.com/likus-69/Orion-Worship
