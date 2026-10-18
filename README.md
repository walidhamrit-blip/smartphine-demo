# MyPhone — Tripoli storefront

Next.js 16 (App Router) + Tailwind CSS 4 storefront for MyPhone Tripoli, backed by
PostgreSQL through Drizzle ORM. Bilingual (EN/AR, with RTL), with a checkout that
sends orders to WhatsApp, a customer order tracker and an `/admin` console.

---

## Requirements

- Node.js 20+ and npm
- A PostgreSQL database (local Docker, Neon, Supabase, Vercel Postgres…)

## Local development

```bash
npm install
cp .env.example .env.local     # then set DATABASE_URL
npm run dev
```

The app is usable with an **empty** database: the tables and the demo catalog
(products, categories, brands, reviews, sample orders) are created automatically
on the first request that touches the database.

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:push` | Push the Drizzle schema to the database (optional, the app bootstraps itself) |
| `npm run db:studio` | Drizzle Studio |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes in production | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/db?sslmode=require` |
| `ADMIN_PASSWORD` | Recommended | Password of the `/admin` console (default `myphone2026`) |
| `ADMIN_SECRET` | Recommended | Secret used to sign the admin session cookie |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public URL used by `sitemap.xml` and `robots.txt` |
| `DATABASE_POOL_MAX` | No | Connection pool size for serverless (default `5`) |

## Deploying on Vercel

The build **never** requires a reachable database: the pool is created lazily and a
missing `DATABASE_URL` can no longer break `next build`. The catalogue appears as
soon as the variable is set.

1. Import the repository in Vercel (it is already connected to `main`).
2. Provision a PostgreSQL database (Vercel Postgres, Neon, Supabase…).
3. In **Project → Settings → Environment Variables**, add:

   | Name | Value | Environments |
   | --- | --- | --- |
   | `DATABASE_URL` | the connection string of your database | Production + Preview |
   | `ADMIN_PASSWORD` | a strong password | Production |
   | `ADMIN_SECRET` | a long random string | Production |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Production + Preview |

4. Redeploy: **Deployments → ⋯ → Redeploy** (a new commit to `main` also works).
5. Check `https://your-domain.com/api/health` — it answers `{"ok":true}` once the
   database is reachable.

> The first request after the redeploy creates the tables and seeds the demo data.

## Brand logos

The partner ribbons on the home page show the real brand marks, not text monograms.

| File | Role |
| --- | --- |
| `src/lib/brand-logos.ts` | 24x24 SVG paths + official colour of each brand |
| `src/components/brand-logo.tsx` | `<BrandLogo>` renderer, with monogram fallback |
| `src/components/brand-name.tsx` | `<BrandLine>`: logo + properly cased brand name |

Apple, Samsung, Xiaomi, HONOR, JBL and Sony use the official single-colour artwork
from [Simple Icons](https://simpleicons.org) (CC0), recoloured with the brand accent
stored in the `brands` table. Infinix, TECNO, Anker, Spigen, Baseus, soundcore and
SanDisk are not in that dataset, so they ship with a locally drawn, brand-coloured
mark — replace the `paths` entry in `src/lib/brand-logos.ts` with the official
artwork as soon as you have it.

Everything is inlined as SVG: no image request, no missing asset, and a brand added
through `/admin` simply falls back to its monogram badge. On the dark theme the
marks are inverted to the current text colour, because brand colours such as
`#111114` would disappear on `--surface`.

The same logos are reused in the shop brand filters, on the product cards and on the
product pages, where the raw `brand_slug` used to be printed.

## Troubleshooting

**`Error: DATABASE_URL is required` during the build**

The build no longer imports the database eagerly, so this message can only come
from a runtime request. Set `DATABASE_URL` in the Vercel project settings (all
the environments you need), then redeploy. A banner is displayed on the storefront
while the variable is missing.

**The storefront is empty but the build is green**

The database is configured but unreachable or empty. `GET /api/health` returns the
reason (`DATABASE_URL is not configured`, connection error, …) and the server logs
print the failing query. The brand ribbon is the only section that stays populated:
it falls back to the seeded list of partner logos.

**`relation "products" does not exist`**

The tables were never created. Any request that reads the catalogue creates them
automatically; `npm run db:push` does the same from the command line.
