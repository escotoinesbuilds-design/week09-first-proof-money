# First-Proof decisions

## Build-stage decisions

- The prototype is a public, fictional-data-only Next.js dashboard for a university career-services or employability funding administrator.
- The university is the potential payer; students pay nothing. A placement is eligible for human payment review only when it is a genuine paid role with an official start and evidence marked verified. Eligibility is not approval or payment.
- Deterministic application rules, not AI, determine eligibility and warning flags. Warnings request human review and cannot automatically suspend an employer.
- The AI summary is static simulated explanatory copy for this prototype. No LLM provider, API key, login, database, editable input, or payment integration is needed for this minimum build.
- The dashboard will include partner-employer, student-placement, verified-start, eligible-placement, and flagged-case counts; a placements table; repeated-short-placement and possible shadow-clause warnings; and a visible simulated AI summary.
- The provided mockup is visual guidance, not a source of real or claimed pilot data.
- Keep the Vercel free-tier deployment path available. Verify current platform limits and confirm fictional-only content before any public deployment.

## Next action at local build-stage close

Run the application and mechanical checks locally, then configure the first Vercel deployment. The later build stage must discover and fix at least one genuine product bug, add a regression test, redeploy, and conduct the synthetic administrator persona test; do not treat those later-stage tasks as complete here.
