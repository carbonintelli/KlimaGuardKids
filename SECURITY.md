# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` (0.2.x) | Yes |

## Reporting a vulnerability

Please report security issues privately to **contact@sustainow.in** (subject: `KlimaGuard Kids security`).

Include:

- Description and impact
- Steps to reproduce
- Affected URL/API or source path if known

We aim to acknowledge reports within **5 business days**. Do not open a public GitHub issue for exploitable vulnerabilities until we confirm a fix or disclosure plan.

## Product security posture (demo)

- No child accounts; kids play progress is browser-local (`localStorage`)
- Analyze requests use country/city/region (or lat/lon) — not personal health records
- Server-side agent pipeline; climate fetch via HTTPS to Open-Meteo
- Production deployments should terminate TLS, restrict CORS as needed, and rate-limit `/api/analyze`

See also: [`/privacy`](https://klimaguardkids.sustainow.in/privacy) and `src/app/privacy/page.tsx`.
