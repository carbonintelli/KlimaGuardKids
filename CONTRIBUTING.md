# Contributing to KlimaGuard Kids

Thank you for helping protect children from climate-health risks! This project is open source under the MIT License.

## Getting started

1. Fork the repository and clone your fork
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint
npm start        # Run production server
```

## Project structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React UI components
└── lib/
    ├── agents/       # AI agent modules (add new agents here)
    ├── india-regions.ts
    ├── countries.ts
    └── types.ts
```

## Adding a new Indian region

1. Add an entry to `src/lib/india-regions.ts` with lat/lon, climate zone, and primary risks
2. The India Regional Context Agent and Impact Agent will automatically include it
3. Test via `/india` dashboard or `POST /api/analyze` with `regionId`

## Adding or modifying agents

Agents are pure TypeScript functions in `src/lib/agents/`. To add a new agent:

1. Create `src/lib/agents/your-agent.ts`
2. Add the agent ID to `AgentId` in `src/lib/types.ts`
3. Register it in `src/lib/agents/orchestrator.ts`
4. Update the synthesis agent if cross-correlations are needed

## Coding standards

- TypeScript strict mode — no `any` unless unavoidable
- Match existing naming and file structure
- Keep agent logic transparent and document measurement formulas
- Run `npm run lint` and `npm run build` before submitting

## Pull requests

1. Describe what changed and why
2. Link related issues if applicable
3. Ensure CI passes (build + lint)
4. One focused change per PR when possible

## Code of conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be respectful and inclusive.

## Questions

Open a GitHub issue for bugs, feature requests, or questions about the agent pipeline.
