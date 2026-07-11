import assert from "node:assert/strict";
import test from "node:test";
import {
  QUESTION_DEFINITIONS,
  SCHEMA_VERSION,
  calculateCompletionStatus,
  createEmptyCase,
  evaluateQuestions,
  exportPortableCase,
  generateSalesforceHandover,
  importPortableCase,
  migrateCaseToCurrent,
  outstandingItems,
  prepareAiSuggestions,
} from "../src/domain.js";

test("branching questions appear only when prerequisites exist", () => {
  const triageCase = createEmptyCase();
  triageCase.indoorUnits[0].room = "Lounge";

  let questions = evaluateQuestions(triageCase);
  assert.equal(questions.some((question) => question.id === "indoor.pipe_route"), false);
  assert.equal(questions.some((question) => question.id === "outdoor.photos"), false);

  triageCase.indoorUnits[0].agreedLocation = "Back wall";
  triageCase.outdoorUnit.location = "Patio";
  questions = evaluateQuestions(triageCase);

  assert.equal(questions.some((question) => question.id === "indoor.pipe_route"), true);
  assert.equal(questions.some((question) => question.id === "outdoor.photos"), true);
});

test("multi indoor unit cases create scoped questions with shared outdoor questions", () => {
  const triageCase = createEmptyCase();
  triageCase.indoorUnits = [
    { ...triageCase.indoorUnits[0], id: "unit-1", room: "Lounge", agreedLocation: "Rear wall" },
    { ...triageCase.indoorUnits[0], id: "unit-2", room: "Bedroom", agreedLocation: "Side wall" },
  ];
  triageCase.outdoorUnit.location = "Patio";

  const questions = evaluateQuestions(triageCase);
  assert.equal(questions.filter((question) => question.id === "indoor.pipe_route").length, 2);
  assert.equal(questions.filter((question) => question.id === "outdoor.photos").length, 1);
});

test("outstanding items split customer-solvable and internal questions", () => {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "50773906";
  triageCase.customerName = "Chris Smith";
  triageCase.indoorUnits[0].room = "Lounge";
  triageCase.indoorUnits[0].agreedLocation = "Rear wall";
  triageCase.outdoorUnit.location = "Patio";
  triageCase.evidenceStates.consumer_unit_photo.state = "confirmed";

  const groups = outstandingItems(triageCase);

  assert.ok(groups.customerQuestions.some((question) => question.id === "indoor.pipe_route"));
  assert.ok(groups.customerPhotosRequired.some((question) => question.id === "outdoor.photos"));
  assert.ok(groups.internalTechnicalClarification.some((question) => question.id === "electrical.visible_earth"));
});

test("completion status and next action are deterministic", () => {
  const triageCase = createCompleteCase();

  assert.deepEqual(calculateCompletionStatus(triageCase), {
    status: "ready_for_handover",
    nextAction: "Copy Salesforce handover note",
    readyForHandover: true,
  });

  triageCase.evidenceStates.consumer_unit_photo.state = "missing";
  assert.equal(calculateCompletionStatus(triageCase).status, "customer_contact_required");
});

test("Salesforce handover omits empty headings and invented values", () => {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "50773906";
  triageCase.customerName = "Chris Smith";
  triageCase.indoorUnits[0].room = "Lounge";

  const handover = generateSalesforceHandover(triageCase);

  assert.match(handover, /Lead/);
  assert.doesNotMatch(handover, /Outdoor unit:/);
  assert.doesNotMatch(handover, /relevant socket\/location evidence/);
  assert.doesNotMatch(handover, /Customer preferences:/);
  assert.doesNotMatch(handover, /undefined|null|TBC|To confirm/);
});

test("unknown rationale remains unknown", () => {
  const socket = QUESTION_DEFINITIONS.find((question) => question.id === "indoor.nearest_socket");
  const spareWay = QUESTION_DEFINITIONS.find((question) => question.id === "electrical.spare_rcd_rcbo_way");
  const visibleEarth = QUESTION_DEFINITIONS.find((question) => question.id === "electrical.visible_earth");

  for (const question of [socket, spareWay, visibleEarth]) {
    assert.equal(question.why, "Reason not yet confirmed");
    assert.equal(question.rationaleConfidence, "unknown");
  }
});

test("portable JSON export/import round trip omits image data by default", () => {
  const triageCase = createCompleteCase();
  triageCase.photos = [{
    id: "photo-1",
    name: "outside.jpg",
    label: "Outside",
    type: "outdoor_location",
    dataUrl: "data:image/jpeg;base64,SECRET",
    annotatedDataUrl: "data:image/jpeg;base64,ANNOTATED",
    marks: [],
  }];

  const exported = exportPortableCase(triageCase);
  const json = JSON.stringify(exported);
  const imported = importPortableCase(exported);

  assert.equal(exported.schemaVersion, SCHEMA_VERSION);
  assert.doesNotMatch(json, /SECRET|ANNOTATED/);
  assert.equal(imported.schemaVersion, SCHEMA_VERSION);
  assert.equal(imported.photos[0].name, "outside.jpg");
});

test("legacy cases migrate to schema v2 while preserving timeline source", () => {
  const migrated = migrateCaseToCurrent({
    id: "legacy-1",
    leadNumber: "50773906",
    customerName: "Chris Smith",
    sourceDetails: "CHI Lead- 50773906 - Chris Smith - SG1 3ND",
    status: "ready",
    rooms: [{ id: "room-1", roomName: "Lounge", internalLocation: "Rear wall", pipeRun: "Straight out" }],
    outsideUnit: { location: "Patio" },
    photos: [],
    reviewRounds: [],
    customerReplies: [],
  });

  assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.indoorUnits[0].agreedLocation, "Rear wall");
  assert.equal(migrated.outdoorUnit.location, "Patio");
  assert.ok(migrated.timeline.some((event) => event.type === "salesforce_text"));
});

test("AI suggestions cannot silently overwrite confirmed answers", () => {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "50773906";
  triageCase.customerName = "Chris Smith";

  const suggestions = prepareAiSuggestions(triageCase, {
    lead: {
      leadNumber: "99999999",
      customerName: "Chris Smith",
    },
  });

  assert.equal(triageCase.leadNumber, "50773906");
  assert.deepEqual(suggestions.map((item) => item.path), ["leadNumber"]);
  assert.equal(suggestions[0].requiresAcceptance, true);
});

test("customer call answered state completes scoped deterministic questions", () => {
  const triageCase = createEmptyCase();
  triageCase.indoorUnits[0].id = "unit-1";
  triageCase.indoorUnits[0].room = "Lounge";
  triageCase.indoorUnits[0].agreedLocation = "Rear wall";

  const pipeQuestion = evaluateQuestions(triageCase).find((question) => question.id === "indoor.pipe_route");
  assert.equal(pipeQuestion.complete, false);

  triageCase.answers[pipeQuestion.key] = {
    state: "confirmed",
    value: "Straight out through rear wall",
    notes: "Answered on call",
    source: "customer_call",
    updatedAt: "2026-07-10T10:00:00.000Z",
  };

  const updated = evaluateQuestions(triageCase).find((question) => question.id === "indoor.pipe_route");
  assert.equal(updated.complete, true);
});

function createCompleteCase() {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "50773906";
  triageCase.customerName = "Chris Smith";
  triageCase.address = "10 Test Road";
  triageCase.caseDetails.quotedPackage = "2.6 kW Climate 3200i";
  triageCase.caseDetails.planningStatus = "Not required";
  triageCase.caseDetails.installDate = "2026-08-14";
  triageCase.indoorUnits[0] = {
    ...triageCase.indoorUnits[0],
    room: "Lounge",
    roomSize: "18",
    agreedLocation: "Rear wall",
    wallConstruction: "External brick wall",
    pipeRoute: "Straight out",
    trunkingColour: "White",
    nearestSocket: "Socket by TV",
    accessDetails: "Ground floor",
  };
  triageCase.outdoorUnit = {
    location: "Patio",
    mounting: "Wall bracket",
    route: "Straight through rear wall",
    clearances: "Clear",
    access: "Ground level",
    condensateRoute: "Drain nearby",
    notes: "",
  };
  triageCase.electrical.spareWay = "Spare way visible";
  triageCase.electrical.visibleEarth = "Visible";
  for (const evidence of Object.values(triageCase.evidenceStates)) {
    evidence.state = "confirmed";
  }
  return triageCase;
}
