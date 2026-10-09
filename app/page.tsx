import AiSummary from "@/app/ai-summary";
import {
  assessPlacement,
  placements,
} from "@/lib/funding";

function formatStartDate(date: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

const assessedPlacements = placements.map((placement) => ({
  placement,
  assessment: assessPlacement(placement),
}));

const partnerCount = new Set(
  placements
    .filter(({ isPartner }) => isPartner)
    .map(({ employerId }) => employerId),
).size;
const studentCount = new Set(
  placements.map(({ studentId }) => studentId),
).size;
const verifiedStartCount = assessedPlacements.filter(
  ({ assessment }) => assessment.verifiedPaidStart,
).length;
const eligibleCount = assessedPlacements.filter(
  ({ assessment }) => assessment.paymentEligible,
).length;
const flaggedPlacements = assessedPlacements.filter(
  ({ assessment }) => assessment.warningFlags.length > 0,
);
const repeatedShortCount = placements.filter(
  ({ reviewSignals }) => reviewSignals.repeatedShortPlacement,
).length;
const shadowClauseCount = placements.filter(
  ({ reviewSignals }) => reviewSignals.possibleShadowClause,
).length;
const continuingJuniorCount = placements.filter(
  ({ reviewSignals }) => reviewSignals.continuingJuniorWork,
).length;

const metrics = [
  {
    label: "Partner employers",
    value: partnerCount,
    note: "Participating in fictional pilot",
    icon: "◆",
    tone: "blue",
  },
  {
    label: "Students placed",
    value: studentCount,
    note: "Unique fictional students",
    icon: "●",
    tone: "green",
  },
  {
    label: "Verified paid starts",
    value: verifiedStartCount,
    note: "Official start + verified evidence",
    icon: "✓",
    tone: "blue",
  },
  {
    label: "Payment-eligible placements",
    value: eligibleCount,
    note: "Eligible for human review only",
    icon: "▰",
    tone: "green",
  },
  {
    label: "Flagged cases",
    value: flaggedPlacements.length,
    note: "Require human review",
    icon: "!",
    tone: "red",
  },
];

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <a className="brand" href="#overview" aria-label="First-Proof dashboard">
          <span className="brand-mark" aria-hidden="true">
            FP
          </span>
          <span>
            <strong>Rivermere</strong>
            <small>University</small>
          </span>
        </a>

        <nav className="navigation">
          <a className="nav-item active" href="#overview">
            <span aria-hidden="true">⌂</span> Dashboard
          </a>
          <a className="nav-item" href="#employers">
            <span aria-hidden="true">▥</span> Employers
          </a>
          <a className="nav-item" href="#students">
            <span aria-hidden="true">♧</span> Students
          </a>
          <a className="nav-item" href="#placements">
            <span aria-hidden="true">▤</span> Placements
          </a>
          <a className="nav-item" href="#funding">
            <span aria-hidden="true">▱</span> Funding review
          </a>
          <a className="nav-item" href="#flags">
            <span aria-hidden="true">△</span> Flagged cases
          </a>
        </nav>

        <div className="sidebar-note">
          <span className="status-dot" />
          Fictional pilot data
        </div>
      </aside>

      <div className="dashboard" id="overview">
        <header className="page-header">
          <div>
            <p className="eyebrow">EMPLOYABILITY FUNDING PILOT</p>
            <h1>First-Proof Funding Dashboard</h1>
            <p className="page-subtitle">
              Review employer partnerships and verified hiring outcomes.
            </p>
          </div>
          <div className="admin-chip">
            <span className="admin-avatar" aria-hidden="true">
              A
            </span>
            <span>
              <strong>University admin</strong>
              <small>Funding reviewer</small>
            </span>
          </div>
        </header>

        <div className="fictional-banner" role="note">
          <span aria-hidden="true">i</span>
          <strong>Fictional demonstration data only.</strong>
          <span>No real students, employers, or hiring outcomes are represented.</span>
        </div>

        <section className="metric-grid" aria-label="Pilot overview">
          {metrics.map((metric, index) => (
            <article
              className={`metric-card metric-${metric.tone}`}
              id={index === 0 ? "employers" : undefined}
              key={metric.label}
            >
              <div className="metric-topline">
                <span className="metric-icon" aria-hidden="true">
                  {metric.icon}
                </span>
                <span className="metric-value">{metric.value}</span>
              </div>
              <h2>{metric.label}</h2>
              <p>{metric.note}</p>
            </article>
          ))}
        </section>

        <section className="rule-banner" id="funding">
          <span className="rule-icon" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Funding rule</strong>
            <p>
              Only a genuine paid role with an official start and verified
              evidence is eligible for human payment review. Eligibility is not
              approval or payment.
            </p>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel placements-panel" id="placements">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">OUTCOME RECORDS</p>
                <h2>Placements</h2>
              </div>
              <span className="record-count">{placements.length} records</span>
            </div>

            <div className="table-scroll" id="students">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Employer / role</th>
                    <th scope="col">Term</th>
                    <th scope="col">Start verification</th>
                    <th scope="col">Payment review</th>
                    <th scope="col">Warning flags</th>
                  </tr>
                </thead>
                <tbody>
                  {assessedPlacements.map(({ placement, assessment }) => {
                    const startDate = formatStartDate(
                      placement.officialStartDate,
                    );
                    return (
                      <tr key={placement.id}>
                        <td>
                          <span className="student-name">
                            {placement.studentName}
                          </span>
                          <span className="cell-detail">
                            {placement.studentId}
                          </span>
                        </td>
                        <td>
                          <span className="employer-name">
                            {placement.employerName}
                          </span>
                          <span className="cell-detail">{placement.role}</span>
                        </td>
                        <td className="term-cell">{placement.term}</td>
                        <td>
                          {assessment.verifiedPaidStart ? (
                            <span className="status status-verified">
                              <span aria-hidden="true">✓</span> Verified
                            </span>
                          ) : (
                            <span className="status status-pending">
                              {placement.evidenceStatus === "pending"
                                ? "Evidence pending"
                                : placement.officialStartDate
                                  ? "Not verified"
                                  : "No official start"}
                            </span>
                          )}
                          {startDate && (
                            <span className="cell-detail">{startDate}</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status ${
                              assessment.paymentEligible
                                ? "status-eligible"
                                : "status-ineligible"
                            }`}
                          >
                            {assessment.paymentEligible
                              ? "Eligible for review"
                              : "Not eligible"}
                          </span>
                          {!assessment.paymentEligible && (
                            <span className="cell-detail">
                              {assessment.eligibilityReason.replace(
                                "Not eligible: ",
                                "",
                              )}
                            </span>
                          )}
                        </td>
                        <td>
                          {assessment.warningFlags.length ? (
                            <div className="flag-list">
                              {assessment.warningFlags.map((flag) => (
                                <span className="flag-chip" key={flag}>
                                  {flag.replace(" — human review required", "")}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="no-flag">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="table-footnote">
              The deterministic rule uses paid status, official start date, and
              evidence status. Evidence authenticity and any payment decision
              remain with university staff.
            </p>
          </section>

          <div className="side-panels">
            <section className="panel warning-panel" id="flags">
              <div className="warning-heading">
                <span className="warning-symbol" aria-hidden="true">
                  !
                </span>
                <div>
                  <p className="eyebrow">HUMAN REVIEW REQUIRED</p>
                  <h2>Warning flags</h2>
                </div>
              </div>
              <p className="warning-intro">
                {flaggedPlacements.length} fictional placements are flagged.
                These signals request review; they do not determine payment or
                automatically suspend an employer.
              </p>
              <ul className="warning-list">
                <li>
                  <span className="warning-bullet amber" aria-hidden="true">
                    !
                  </span>
                  <span>
                    <strong>Repeated short placements</strong>
                    <small>
                      {repeatedShortCount} placements · same employer pattern
                    </small>
                  </span>
                  <span className="warning-count">{repeatedShortCount}</span>
                </li>
                <li>
                  <span className="warning-bullet red" aria-hidden="true">
                    !
                  </span>
                  <span>
                    <strong>Possible shadow-clause issue</strong>
                    <small>Role description needs staff review</small>
                  </span>
                  <span className="warning-count">{shadowClauseCount}</span>
                </li>
                <li>
                  <span className="warning-bullet blue" aria-hidden="true">
                    i
                  </span>
                  <span>
                    <strong>Continuing junior work</strong>
                    <small>Review role progression and expectations</small>
                  </span>
                  <span className="warning-count">{continuingJuniorCount}</span>
                </li>
              </ul>
              <p className="human-note">
                A human administrator reviews evidence and decides any action,
                including whether suspension is appropriate.
              </p>
            </section>

            <AiSummary
              flaggedCount={flaggedPlacements.length}
              studentCount={studentCount}
              verifiedStartCount={verifiedStartCount}
            />
          </div>
        </div>

        <footer className="page-footer">
          <span>First-Proof Funding Dashboard</span>
          <span>Fictional pilot data · Student pays nothing</span>
          <span>Payment decisions remain human-led</span>
        </footer>
      </div>
    </main>
  );
}
