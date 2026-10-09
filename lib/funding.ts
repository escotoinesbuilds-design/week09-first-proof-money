export type EvidenceStatus = "verified" | "pending" | "missing";

export type Placement = {
  id: string;
  studentId: string;
  studentName: string;
  employerId: string;
  employerName: string;
  role: string;
  term: string;
  paid: boolean;
  officialStartDate: string | null;
  evidenceStatus: EvidenceStatus;
  reviewSignals: {
    repeatedShortPlacement: boolean;
    possibleShadowClause: boolean;
    suspiciousEmployerBehavior: boolean;
    continuingJuniorWork: boolean;
  };
};

export type PlacementAssessment = {
  verifiedPaidStart: boolean;
  paymentEligible: boolean;
  eligibilityReason: string;
  warningFlags: string[];
};

export const placements: Placement[] = [
  {
    id: "FP-1001",
    studentId: "ST-1001",
    studentName: "Maya Chen",
    employerId: "EMP-01",
    employerName: "Northstar Works",
    role: "Marketing Intern",
    term: "Fall 2025",
    paid: true,
    officialStartDate: "2025-09-08",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1002",
    studentId: "ST-1002",
    studentName: "Leo Park",
    employerId: "EMP-02",
    employerName: "Cedar Grove Analytics",
    role: "Data Analyst Co-op",
    term: "Fall 2025",
    paid: true,
    officialStartDate: "2025-09-15",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1003",
    studentId: "ST-1003",
    studentName: "Ana Ruiz",
    employerId: "EMP-03",
    employerName: "Mapleline Studio",
    role: "Project Assistant",
    term: "Fall 2025",
    paid: true,
    officialStartDate: null,
    evidenceStatus: "missing",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1004",
    studentId: "ST-1004",
    studentName: "Jordan Lee",
    employerId: "EMP-04",
    employerName: "Brightpath Services",
    role: "Customer Success Associate",
    term: "Spring 2026",
    paid: true,
    officialStartDate: "2026-01-12",
    evidenceStatus: "pending",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: true,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: true,
    },
  },
  {
    id: "FP-1005",
    studentId: "ST-1005",
    studentName: "Sofie Martin",
    employerId: "EMP-05",
    employerName: "Harbor Point Labs",
    role: "Research Assistant",
    term: "Fall 2025",
    paid: true,
    officialStartDate: "2025-09-02",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: true,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1006",
    studentId: "ST-1006",
    studentName: "Eli Turner",
    employerId: "EMP-05",
    employerName: "Harbor Point Labs",
    role: "Lab Support Intern",
    term: "Spring 2026",
    paid: true,
    officialStartDate: "2026-01-19",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: true,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1007",
    studentId: "ST-1007",
    studentName: "Luca Bennett",
    employerId: "EMP-06",
    employerName: "Pinecrest Digital",
    role: "Software Support Trainee",
    term: "Spring 2026",
    paid: false,
    officialStartDate: null,
    evidenceStatus: "missing",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1008",
    studentId: "ST-1008",
    studentName: "Noor Ahmed",
    employerId: "EMP-07",
    employerName: "Ridgeway Health",
    role: "Data Operations Intern",
    term: "Fall 2025",
    paid: true,
    officialStartDate: "2025-08-25",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1009",
    studentId: "ST-1009",
    studentName: "Mia Brooks",
    employerId: "EMP-08",
    employerName: "Vale & Co.",
    role: "Business Operations Assistant",
    term: "Spring 2026",
    paid: true,
    officialStartDate: "2026-01-05",
    evidenceStatus: "pending",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
  {
    id: "FP-1010",
    studentId: "ST-1010",
    studentName: "Theo Santos",
    employerId: "EMP-09",
    employerName: "Westhaven Cooperative",
    role: "Communications Intern",
    term: "Fall 2025",
    paid: true,
    officialStartDate: "2025-09-22",
    evidenceStatus: "verified",
    reviewSignals: {
      repeatedShortPlacement: false,
      possibleShadowClause: false,
      suspiciousEmployerBehavior: false,
      continuingJuniorWork: false,
    },
  },
];

export function assessPlacement(
  placement: Placement,
): PlacementAssessment {
  const verifiedPaidStart =
    placement.paid &&
    placement.officialStartDate !== null &&
    placement.evidenceStatus === "verified";

  const paymentEligible = verifiedPaidStart;
  const eligibilityReason = paymentEligible
    ? "Verified official start in a paid role; eligible for human payment review."
    : "Not eligible: a paid official start and verified evidence are required.";

  const warningFlags: string[] = [];
  if (placement.reviewSignals.repeatedShortPlacement) {
    warningFlags.push("Repeated short placements — human review required");
  }
  if (placement.reviewSignals.possibleShadowClause) {
    warningFlags.push("Possible shadow-clause issue — human review required");
  }
  if (placement.reviewSignals.suspiciousEmployerBehavior) {
    warningFlags.push("Employer behavior concern — human review required");
  }
  if (placement.reviewSignals.continuingJuniorWork) {
    warningFlags.push("Continuing junior work — human review required");
  }

  return {
    verifiedPaidStart,
    paymentEligible,
    eligibilityReason,
    warningFlags,
  };
}
