# Bonito's Car — Engineering Instructions

## Product

Bonito's Car is a premium automotive bodywork and painting website.

Commercial segments:
- Leves: cars and light commercial vehicles.
- Pesados: trucks, heavy vehicles and fleets.

Production:
https://www.bonitoscar.com.br

Hosting:
Hostinger.

The site already receives organic traffic from Google. SEO regressions are production regressions.

## Stack

- React 18
- TypeScript
- Vite 5
- React Router 6
- Tailwind CSS 3
- Framer Motion

## Source of truth

Work on source files only.

Primary source:
- src/
- public/
- index.html
- configuration files

Never manually edit generated files inside:
- dist/
- bonitos-car-deploy/

## Engineering rules

- Preserve the current premium visual identity.
- Do not redesign unrelated sections.
- Prefer small and isolated changes.
- Avoid unnecessary dependencies.
- Do not commit credentials, tokens or secrets.
- Do not deploy directly to production.
- Do not modify Hostinger production files directly.
- Do not perform broad dependency upgrades as part of unrelated tasks.
- Never run npm audit fix --force without explicit approval.

## UX

- Mobile is first-class.
- Navigation must be predictable.
- Calls to action must remain clear.
- Motion must improve hierarchy or feedback, never obstruct interaction.
- Preserve accessibility, readable contrast and comfortable touch targets.

## SEO

Canonical production origin:
https://www.bonitoscar.com.br

Primary routes:
- /
- /leves
- /pesados
- /orcamento

Before changing routes, titles, canonicals, sitemap, robots or indexed content:
1. analyze SEO impact;
2. identify existing URL behavior;
3. preserve indexed authority;
4. define redirects when required.

Never remove or rename an indexed URL casually.

Legacy URLs may exist and must be audited before removal.

## Validation

After any source-code change, run:

npm run build

The task is not complete if:
- TypeScript compilation fails;
- Vite production build fails;
- affected navigation is broken;
- browser console errors are introduced;
- mobile behavior regresses;
- SEO metadata unintentionally changes.

## Git

Use small task-specific changes.

Recommended branches:
- fix/*
- feat/*
- seo/*
- chore/*

Do not mix unrelated refactors with functional changes.

## Production

Production is conservative.

Workflow:

source change
→ local validation
→ review diff
→ Git
→ human approval
→ Hostinger deploy

Never deploy automatically unless explicitly instructed.
