# First-Proof decisions

## Build-stage decisions

- The prototype is a public, fictional-data-only Next.js dashboard for a university career-services or employability funding administrator.
- The university is the potential payer; students pay nothing. A placement is eligible for human payment review only when it is a genuine paid role with an official start and evidence marked verified. Eligibility is not approval or payment.
- Deterministic application rules, not AI, determine eligibility and warning flags. Eligibility requires a partner employer, a genuine paid role, a valid official start date, and evidence marked verified. Warnings request human review and cannot automatically suspend an employer.
- The dashboard uses a clearly labeled deterministic simulated explanation based on warning flags. It has no LLM endpoint, API key, or external setup.
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
- The initial local-build stage did not include a Vercel deployment or synthetic persona test; the project owner subsequently confirmed the first Vercel deployment succeeded. The synthetic administrator persona test remains outstanding.

## Mechanical test and bug-fix stage

- **Baseline behavior tested:** Confirmed the fictional dashboard's six verified paid starts, six placements eligible for human payment review, and three flagged placements. Tests cover the verified-start requirements, missing/unverified evidence, non-partner employer, non-genuine role, repeated-short-placement warning, shadow-clause warning, and continuing-junior-work warning. Warnings are independent from eligibility and cannot authorize or suspend.
- **Genuine bug reproduced:** Added a regression test using `2025-02-30` as the official start date on an otherwise partner, genuine, paid, verified placement. Before the fix, deterministic assessment returned `paymentEligible: true`; the test failed because a malformed calendar date was accepted as an official start.
- **Fix:** Eligibility now accepts only real `YYYY-MM-DD` calendar dates, verified by strict format plus date round-trip validation. Assessment reasons identify the missing valid start date. The eligibility rule also explicitly requires the structured `genuineRole` field, in addition to partner status, paid status, valid start, and verified evidence.
- **Previous Dragon Stack implementation:** The prior commit added a server-side Gemini endpoint, but persona-test feedback found that its missing-key error was visible and required setup. In response to the requested minimal fix, that endpoint and key setup were removed. The explanation is now deterministic, visibly labeled simulated copy derived from the warning flags; it makes no employment or funding decision and exposes no technical/API errors.
- **Persona evidence visibility fix:** Each placement meeting the deterministic verified-paid-start rule now has a “View evidence” disclosure. It shows explicitly fictional offer/agreement, paid-role, start-date, and employer-confirmation entries, the required funding-review disclaimer, and that final payment authorization remains with university staff.
- **Validation:** The existing funding-rule regression suite passes (7 tests), and `npm run build` passes after the persona-test fixes. No API key or external setup is needed.
- **Deployment:** Commit `67578ec` was pushed to `main`; GitHub reported Vercel status `success` and “Deployment has completed.” Gemini was removed afterward in response to the persona-test feedback, so the current implementation needs no key.

## Next action

Push the persona-test fixes to GitHub and verify the resulting Vercel deployment. No API key is needed. Do not add authentication, databases, or external services.
