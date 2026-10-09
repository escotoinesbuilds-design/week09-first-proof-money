# First-Proof decisions

## Build-stage decisions

- The prototype is a public, fictional-data-only Next.js dashboard for a university career-services or employability funding administrator.
- The university is the potential payer; students pay nothing. A placement is eligible for human payment review only when it is a genuine paid role with an official start and evidence marked verified. Eligibility is not approval or payment.
- Deterministic application rules, not AI, determine eligibility and warning flags. Eligibility requires a partner employer, a genuine paid role, a valid official start date, and evidence marked verified. Warnings request human review and cannot automatically suspend an employer.
- The dashboard retains clearly labeled simulated sample text and now also has an optional server-side Gemini Flash explanation of an allowlisted fictional placement and its deterministic assessment. It does not require login, a database, or payment integration.
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

## Mechanical test, bug-fix, and Dragon Stack stage

- **Baseline behavior tested:** Confirmed the fictional dashboard's six verified paid starts, six placements eligible for human payment review, and three flagged placements. Tests cover the verified-start requirements, missing/unverified evidence, non-partner employer, non-genuine role, repeated-short-placement warning, shadow-clause warning, and continuing-junior-work warning. Warnings are independent from eligibility and cannot authorize or suspend.
- **Genuine bug reproduced:** Added a regression test using `2025-02-30` as the official start date on an otherwise partner, genuine, paid, verified placement. Before the fix, deterministic assessment returned `paymentEligible: true`; the test failed because a malformed calendar date was accepted as an official start.
- **Fix:** Eligibility now accepts only real `YYYY-MM-DD` calendar dates, verified by strict format plus date round-trip validation. Assessment reasons identify the missing valid start date. The eligibility rule also explicitly requires the structured `genuineRole` field, in addition to partner status, paid status, valid start, and verified evidence.
- **Dragon Stack:** Added a server route that derives the record and deterministic assessment from an allowlisted placement ID, constructs a structured fictional-data prompt, and calls Gemini 2.5 Flash using `GEMINI_API_KEY` only in a server-side `x-goog-api-key` header. The prompt constrains the LLM to explanation only. The response is visibly labeled as live LLM output and rendered as text; static sample copy is explicitly labeled simulated. Missing key, invalid input, provider errors, and empty response are surfaced without changing deterministic state. No API key is stored in the repository.
- **Validation:** Eleven automated unit tests pass, including the invalid-date regression, prompt/assessment binding, request validation, provider response parsing, and proof that the API key is sent in a header rather than the URL. ESLint, TypeScript type-check, production build, and full dependency audit pass (zero audit findings). A production-server smoke test confirmed the dashboard renders and the explanation endpoint returns an explicit HTTP 503 with setup guidance when the key is absent. No live Gemini request was made because no API key has been configured.
- **Key setup still required:** For local live LLM use, copy `.env.example` to ignored `.env.local` and set `GEMINI_API_KEY` to a Gemini API key from Google AI Studio. For Vercel, add `GEMINI_API_KEY` in the project's Environment Variables for Production (and Preview if needed), then redeploy. Do not send the key in chat or commit it. Until configured, the dashboard and deterministic rules work and the endpoint clearly reports that live LLM output is unavailable.
- **Deployment:** Commit `67578ec` was pushed to `main`; GitHub reports Vercel status `success` and “Deployment has completed.” The deployment completed without a Gemini key, so the live LLM explanation remains unavailable until the key is configured privately.

## Next action

Add `GEMINI_API_KEY` privately in Vercel project settings (Production, and Preview if needed) and redeploy to enable the live Gemini explanation. Do not send or commit the key. Run the synthetic administrator persona test only in its separate planned stage; it has not been started.
