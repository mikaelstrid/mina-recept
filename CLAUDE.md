# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Mina recept** is a personal recipe library web app. All UI text must be in Swedish. The data model (code properties, field names) must be in English.

## Tech Stack

- **Framework:** Next.js with TypeScript — this version may have breaking changes from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.
- **Hosting:** Azure Static Web Apps (hybrid/Next.js mode)
- **Database:** Azure Table Storage (recipe JSON data)
- **File storage:** Azure Blob Storage (images)
- **AI:** Azure AI Foundry (recipe parsing, image generation, tag/category suggestions)
- **Auth:** Magic link via email (no passwords)

## Development Commands

The project has not been initialized yet. Once `package.json` exists, the standard Next.js commands apply:

```bash
npm run dev       # Start local dev server
npm run build     # Production build
npm run lint      # ESLint
npm run test      # Run tests
npx playwright test  # E2E tests
```

## Local Development: Storage Emulation

**Never use Azure services during local development.** Replace cloud services with the local filesystem:

- Azure Table Storage → `data/azure-table-storage/`
- Azure Blob Storage → `data/azure-blob-storage/`

Storage abstraction must be designed so the same interface works with both the local filesystem (dev) and Azure (production), switching via environment variables.

## Architecture

### Authentication

Magic link flow: user submits email → server sends link → user clicks link → session created. Admin role is controlled by a comma-separated list of email addresses in a server environment variable (not stored in the database).

### Recipe Input Pipeline

Four entry points feed into a unified recipe creation flow:

1. **Camera/image upload** — images sent to Azure AI Foundry for OCR/interpretation
2. **URL** — page content fetched server-side and parsed by AI
3. **Plain text paste** — unstructured text parsed by AI
4. **Manual form** — direct structured input

After AI processing, the result is presented to the user for review/correction before saving.

### AI Features

- Parse recipes from images, URLs, and unstructured text
- Generate recipe images when none is provided (based on ingredients + steps)
- Suggest categories and tags (prefer existing ones from the database; propose new ones only when none fit)

### Data Model

```
Recipe: Id, Title, UrlSlug (unique), Ingredients[], Steps[], Tags[], Categories[], CookingTimeMinutes, Author (User), SharedWith (User[])
Ingredient: Id, Name (unique)
User: Id, EmailAddress (unique), FirstName, LastName
Category: Id, Name (unique), SvgIcon
```

Deleted recipes are archived (soft delete), not permanently removed. They remain accessible in admin mode.

### UX Principles

Mobile-first. Design reference: Airbnb (airbnb.se) — card-based grid, large images, rounded corners, warm coral accent color, white background, generous whitespace. Feel: "premium men mänsklig" (premium but human).
