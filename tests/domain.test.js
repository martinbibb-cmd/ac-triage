import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyCase,
  generateHandoverNotes,
  generateMissingQuestions,
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
