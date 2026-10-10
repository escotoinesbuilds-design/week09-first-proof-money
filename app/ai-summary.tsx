"use client";

import { useState } from "react";

type Props = {
  studentCount: number;
  verifiedStartCount: number;
  flaggedCount: number;
  warningFlags: string[];
};

function explainWarnings(warningFlags: string[]) {
  const explanations = warningFlags.map((flag) => {
    if (flag.includes("Repeated short placements")) {
      return "Repeated short placements can warrant a closer look at whether each placement reflects sustained paid work.";
    }
    if (flag.includes("shadow-clause")) {
      return "A possible shadow-clause issue means staff should review the role description for work that may continue outside the placement.";
    }
    if (flag.includes("Continuing junior work")) {
      return "Continuing junior work may merit a human review of role expectations and progression.";
    }
    if (flag.includes("Employer behavior concern")) {
      return "A reported employer-behavior concern should be reviewed by university staff.";
    }
    return null;
  });

  return explanations.filter((explanation) => explanation !== null).join(" ");
}

export default function AiSummary({
  studentCount,
  verifiedStartCount,
  flaggedCount,
  warningFlags,
}: Props) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const warningExplanation = explainWarnings(warningFlags);

  return (
    <section className="panel ai-panel">
      <div className="ai-heading">
        <span className="ai-sparkle" aria-hidden="true">
          ✦
        </span>
        <div>
          <p className="eyebrow">DETERMINISTIC · FICTIONAL DATA</p>
          <h2>Simulated explanation</h2>
        </div>
      </div>
      <p className="ai-copy">
        This fictional sample has {studentCount} placements. {verifiedStartCount}{" "}
        show a verified paid start and are eligible for human payment review.{" "}
        {flaggedCount} placements have warning flags for staff review.
      </p>
      <p className="ai-simulated-label">
        SIMULATED EXPLANATION — generated from the displayed warning flags.
      </p>
      <button
        className="ai-button"
        onClick={() => setExplanation(warningExplanation)}
        type="button"
      >
        Explain flagged warnings
      </button>
      {explanation && (
        <p className="ai-explanation" role="status">
          {explanation ||
            "There are no warning flags requiring explanation in this fictional record."}
        </p>
      )}
      <p className="ai-boundary">
        This simulated explanation describes warning signals only. It does not
        make an employment or funding decision, authorize payment, or replace
        review by university staff.
      </p>
    </section>
  );
}
