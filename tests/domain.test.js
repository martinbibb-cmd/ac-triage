import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyCase,
  generateAiReviewPack,
  generateAiReviewPackJson,
  generateAiReviewPrompt,
  generateCustomerRequestMessage,
  generateHandoverNotes,
  generateMissingQuestions,
  generateReferenceText,
  suggestUnitSize,
} from "../src/domain.js";

test("suggestUnitSize returns expected small, medium, and large bands", () => {
  assert.equal(suggestUnitSize("14.9"), "SMALL");
  assert.equal(suggestUnitSize("15"), "MED");
  assert.equal(suggestUnitSize("25"), "MED");
  assert.equal(suggestUnitSize("25.1"), "LARGE");
  assert.equal(suggestUnitSize("45"), "LARGE");
  assert.equal(suggestUnitSize(""), "");
});

test("generateMissingQuestions only asks for missing handover details", () => {
  const triageCase = createEmptyCase();
  triageCase.installDate = "2026-08-14";
  triageCase.planningDate = "2026-08-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.rooms[0].internalLocation = "Above patio doors";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.outsideUnit.location = "Rear wall";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";

  assert.deepEqual(generateMissingQuestions(triageCase), [
    "Where is the nearest plug socket?",
  ]);
});

test("generateCustomerRequestMessage asks only for missing data", () => {
  const triageCase = createEmptyCase();
  triageCase.customerName = "Alex Customer";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.rooms[0].internalLocation = "Bedroom outside wall";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.outsideUnit.location = "Rear patio";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";

  const message = generateCustomerRequestMessage(triageCase);

  assert.match(message, /Hi Alex,/);
  assert.match(message, /Where is the nearest plug socket\?/);
  assert.doesNotMatch(message, /electric meter/);
});

test("generateCustomerRequestMessage handles complete data", () => {
  const triageCase = createEmptyCase();
  triageCase.customerName = "Alex Customer";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.rooms[0].internalLocation = "Bedroom outside wall";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.rooms[0].plugLocation = "Socket beside bed";
  triageCase.outsideUnit.location = "Rear patio";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";

  assert.match(generateCustomerRequestMessage(triageCase), /we have the triage information we need/);
});

test("generateHandoverNotes creates short Salesforce-ready triage text", () => {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "LEAD-123";
  triageCase.customerName = "A Customer";
  triageCase.address = "1 Test Street";
  triageCase.propertyType = "Detached";
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.clearancesChecked = true;
  triageCase.checklist.ladderAccessChecked = true;
  triageCase.outsideUnit = {
    location: "Patio wall",
    mounting: "Wall bracket",
    clearances: "Clear side access",
    ladderAccess: "No ladder required",
    notes: "Keep away from bins",
  };
  triageCase.rooms[0] = {
    ...triageCase.rooms[0],
    roomName: "Lounge",
    roomSize: "22",
    internalLocation: "Left wall",
    pipeRun: "Along skirting then outside",
    trunkingColour: "Black",
    electricalSupplyNotes: "Spare way available",
    plugLocation: "Double socket by TV",
    wifiDongleRequired: true,
  };

  const notes = generateHandoverNotes(triageCase);

  assert.match(notes, /TRIAGE NOTES/);
  assert.match(notes, /Lead: LEAD-123/);
  assert.match(notes, /ROOM 1/);
  assert.match(notes, /Unit size: MED/);
  assert.match(notes, /OUTSIDE UNIT/);
  assert.match(notes, /Location: Patio wall/);
  assert.match(notes, /Wi-Fi dongle required: Yes/);
  assert.match(notes, /Questions outstanding: None/);
});

test("generateReferenceText includes Climate 3200i clearances and dimensions", () => {
  const reference = generateReferenceText();

  assert.match(reference, /Bosch Climate 3200i reference/);
  assert.match(reference, /Top: 150mm minimum/);
  assert.match(reference, /Front \/ service space: 2000mm/);
  assert.match(reference, /2.6 kW: H 292mm, W 729mm, D 200mm, 8kg/);
  assert.match(reference, /7 kW: H 673mm, W 890mm, D 342mm, 43.9kg/);
});

test("generateAiReviewPack creates clean JSON without image data", () => {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "LEAD-456";
  triageCase.sourceDetails = "Raw Salesforce notes";
  triageCase.photos = [{
    id: "photo-1",
    name: "meter.jpg",
    label: "Meter",
    type: "electric_meter",
    notes: "Close-up meter photo",
    requestedAnnotation: "Label meter position",
    dataUrl: "data:image/jpeg;base64,SHOULD_NOT_EXPORT",
    marks: [],
  }];

  const pack = generateAiReviewPack(triageCase);
  const json = generateAiReviewPackJson(triageCase);

  assert.equal(pack.schema, "bg.ac_triage.review_pack.v1");
  assert.equal(pack.lead.leadNumber, "LEAD-456");
  assert.equal(pack.lead.pastedJobDetails, "Raw Salesforce notes");
  assert.equal(pack.evidence.electricMeterPhotoPresent, true);
  assert.deepEqual(pack.photoManifest[0], {
    id: "photo-1",
    fileName: "meter.jpg",
    label: "Meter",
    type: "electric_meter",
    notes: "Close-up meter photo",
    requestedAnnotation: "Label meter position",
    hasAppMarkup: false,
  });
  assert.doesNotMatch(json, /SHOULD_NOT_EXPORT/);
});

test("generateAiReviewPrompt instructs model not to invent information", () => {
  const prompt = generateAiReviewPrompt();

  assert.match(prompt, /air-con triage reviewer/);
  assert.match(prompt, /Do not invent missing information/);
  assert.match(prompt, /photo annotation instructions/);
});

test("generateAiReviewPack includes previous AI decision and customer reply", () => {
  const triageCase = createEmptyCase();
  triageCase.status = "awaiting_customer";
  triageCase.nextAction = "review_again";
  triageCase.reviewRounds = [{
    id: "round-1",
    round: 1,
    sentAt: "2026-07-08T10:00:00.000Z",
    inputSummary: "Initial pack",
    aiDecision: "missing_info",
    aiOutput: "Need fuse board photo",
    customerMessage: "Please send fuse board photo",
    outstandingBlockers: "Fuse board photo missing\nOutdoor location unclear",
  }];
  triageCase.customerReplies = [{
    id: "reply-1",
    receivedAt: "2026-07-08T11:00:00.000Z",
    text: "Fuse board photo attached",
    photoIds: ["photo-2"],
    notes: "Customer replied by SMS",
  }];

  const pack = generateAiReviewPack(triageCase);

  assert.equal(pack.lead.status, "awaiting_customer");
  assert.equal(pack.lead.nextAction, "review_again");
  assert.equal(pack.reviewHistory[0].aiDecision, "missing_info");
  assert.deepEqual(pack.reviewHistory[0].outstandingBlockers, [
    "Fuse board photo missing",
    "Outdoor location unclear",
  ]);
  assert.equal(pack.customerReplies[0].text, "Fuse board photo attached");
  assert.deepEqual(pack.customerReplies[0].photoIds, ["photo-2"]);
});
