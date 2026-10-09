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

### Completed for the first local build stage

- Built a responsive dashboard from ten synthetic placements across nine fictional employers and ten fictional students. The derived overview shows 6 verified paid starts, 6 placements eligible for human payment review, and 3 placements with warning flags.
- Implemented deterministic eligibility: only paid placements with an official start date and evidence marked verified qualify for human payment review. Warning signals are separate from eligibility and never trigger automatic suspension.
- Added fictional repeated-short-placement, possible shadow-clause, and continuing-junior-work signals. Added a static, clearly labeled simulated AI summary; it has no decision authority and does not call an API.
- Confirmed no editable inputs, login, database, real personal data, secrets, or external API dependency are needed for this prototype.
- Mechanical verification: all 5 rule tests pass; ESLint passes; `next build` passes. The first production build exposed an extra closing brace in the responsive stylesheet; removing it fixed the build. The production dependency audit then identified a vulnerable earlier Next.js line, so Next.js was upgraded to 16.4.0. The Next-specific lint preset introduced five high findings in a development-only transitive dependency; replacing it with the standard TypeScript ESLint preset resulted in zero reported vulnerabilities across the installed dependency tree.
- Started the local Next.js development server at `http://127.0.0.1:3000` and inspected the rendered dashboard. Disabled Next.js managed agent-rule file generation to avoid adding an unrelated `AGENTS.md`.
- No Vercel deployment or synthetic administrator persona test has been performed.

### Next action

Configure and verify Vercel deployment 1 with fictional data only. In the later stage, discover and fix a genuine product behavior bug with a regression test, redeploy as deployment 2, and run the synthetic administrator persona test. Do not mark those later-stage tasks complete until performed.
