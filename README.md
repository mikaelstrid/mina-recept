# Mina recept

Ett personligt receptbibliotek byggt med Next.js och TypeScript, hostat på Azure.

Lägg till recept via kamera, URL, inklistrad text eller manuellt formulär. AI tolkar och strukturerar innehållet automatiskt.

## Teknikstack

| Del | Teknik |
|---|---|
| Ramverk | Next.js + TypeScript |
| Hosting | Azure Static Web Apps (hybrid/Next.js-läge) |
| Databas | Azure Table Storage |
| Fillagring | Azure Blob Storage |
| AI | Azure AI Foundry |
| Auth | Magic link via e-post |

## Kom igång

### Förutsättningar

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Starta lokal utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

### Övriga kommandon

```bash
npm run build       # Produktionsbygge
npm run lint        # ESLint
npm run test        # Enhetstester
npx playwright test # E2E-tester
```

### Lokal datalagring

Under lokal utveckling används filsystemet istället för Azure:

- Azure Table Storage → `data/azure-table-storage/`
- Azure Blob Storage → `data/azure-blob-storage/`

Växling sker automatiskt via miljövariabler. Se [`.env.example`](.env.example) för konfiguration.

## Krav och design

Detaljerade funktionella krav, datamodell och UX-riktlinjer finns i [REQUIREMENTS.md](REQUIREMENTS.md).
