import assert from "node:assert/strict";
import test from "node:test";
import { assessPlacement, placements, type Placement } from "./funding";

test("fictional pilot data has consistent dashboard counts", () => {
  const assessments = placements.map(assessPlacement);
  const uniqueEmployers = new Set(placements.map(({ employerId }) => employerId));
  const uniqueStudents = new Set(placements.map(({ studentId }) => studentId));

  assert.equal(uniqueEmployers.size, 9);
  assert.equal(uniqueStudents.size, 10);
  assert.equal(assessments.filter(({ verifiedPaidStart }) => verifiedPaidStart).length, 6);
  assert.equal(assessments.filter(({ paymentEligible }) => paymentEligible).length, 6);
  assert.equal(assessments.filter(({ warningFlags }) => warningFlags.length > 0).length, 3);
});

test("only paid placements with an official verified start are eligible for review", () => {
  const eligiblePlacement = placements.find(({ id }) => id === "FP-1001");
  const missingStart = placements.find(({ id }) => id === "FP-1003");
  const pendingEvidence = placements.find(({ id }) => id === "FP-1004");
  const unpaidPlacement = placements.find(({ id }) => id === "FP-1007");

  assert.ok(eligiblePlacement);
  assert.ok(missingStart);
  assert.ok(pendingEvidence);
  assert.ok(unpaidPlacement);
  assert.equal(assessPlacement(eligiblePlacement).paymentEligible, true);
  assert.equal(assessPlacement(missingStart).paymentEligible, false);
  assert.equal(assessPlacement(pendingEvidence).paymentEligible, false);
  assert.equal(assessPlacement(unpaidPlacement).paymentEligible, false);
});

test("a verified paid start at a non-partner employer is not eligible", () => {
  const partnerPlacement = placements.find(({ id }) => id === "FP-1001");
  assert.ok(partnerPlacement);

  const nonPartnerPlacement: Placement = {
    ...partnerPlacement,
    isPartner: false,
  };

  assert.equal(assessPlacement(nonPartnerPlacement).verifiedPaidStart, false);
  assert.equal(assessPlacement(nonPartnerPlacement).paymentEligible, false);
  assert.match(
    assessPlacement(nonPartnerPlacement).eligibilityReason,
    /employer partnership/,
  );
});

test("a role not established as genuine is not eligible for payment review", () => {
  const placement = placements.find(({ id }) => id === "FP-1001");
  assert.ok(placement);
  const unestablishedRole: Placement = {
    ...placement,
    genuineRole: false,
  };

  const assessment = assessPlacement(unestablishedRole);
  assert.equal(assessment.verifiedPaidStart, false);
  assert.equal(assessment.paymentEligible, false);
  assert.match(assessment.eligibilityReason, /genuine role/);
});

test("warning signals request human review without changing eligibility", () => {
  const repeatedPlacement = placements.find(({ id }) => id === "FP-1005");
  const shadowClausePlacement = placements.find(({ id }) => id === "FP-1004");

  assert.ok(repeatedPlacement);
  assert.ok(shadowClausePlacement);

  const repeatedAssessment = assessPlacement(repeatedPlacement);
  const shadowAssessment = assessPlacement(shadowClausePlacement);

  assert.match(repeatedAssessment.warningFlags.join(" "), /Repeated short placements/);
  assert.equal(repeatedAssessment.paymentEligible, true);
  assert.match(shadowAssessment.warningFlags.join(" "), /Possible shadow-clause issue/);
  assert.match(shadowAssessment.warningFlags.join(" "), /Continuing junior work/);
  assert.equal(shadowAssessment.paymentEligible, false);
});

test("an official start without verified evidence is not eligible", () => {
  const placement = placements.find(({ id }) => id === "FP-1001");
  assert.ok(placement);
  const unverifiedPlacement: Placement = {
    ...placement,
    evidenceStatus: "pending",
  };

  const assessment = assessPlacement(unverifiedPlacement);
  assert.equal(assessment.verifiedPaidStart, false);
  assert.equal(assessment.paymentEligible, false);
  assert.match(assessment.eligibilityReason, /verified evidence required/);
});

test("an invalid official start date cannot qualify for payment review", () => {
  const placement = placements.find(({ id }) => id === "FP-1001");
  assert.ok(placement);
  const invalidDatePlacement: Placement = {
    ...placement,
    officialStartDate: "2025-02-30",
  };

  const assessment = assessPlacement(invalidDatePlacement);
  assert.equal(assessment.verifiedPaidStart, false);
  assert.equal(assessment.paymentEligible, false);
  assert.match(assessment.eligibilityReason, /valid official start date/);
});
