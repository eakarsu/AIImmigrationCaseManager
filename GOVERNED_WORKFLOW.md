# Governed matter workflow

`/api/governed-matters` provides tenant-isolated intake, versioned/privilege-classified evidence, advisory deadline calculations, versioned notifications, professional authorization, filing receipt capture, decisions, appeals, and immutable audit events. Privileged evidence requires an attorney role; filing and appeals require an attorney, accredited representative, or administrator. Maker-checker rules prevent the matter creator from self-authorizing.

Document/OCR storage, identity, calendars, e-signature, government/court portals, and billing are not connected. `MATTER_PROVIDER_ALLOWLIST` allows only status recording for separately reviewed adapters and fails closed when empty. Storage keys and checksums are provenance references, not a document vault.

Apply `backend/migrations/` in numeric order after review, then assign tenant IDs through an authorized identity-admin process. Install dependencies with `npm ci`, create an untracked `.env`, migrate, then run `./start.sh`. Startup does not install, seed, migrate, create a database, or terminate port owners. `seed.sql` is demo-only and must never be applied to production.

Deadline calculation is advisory and not legal advice. No government portal credentials, licensed rule content, attorney validation, privilege review, filing acceptance, or regulatory approval is supplied or claimed; professional review and jurisdiction-specific acceptance testing remain launch blockers.
