import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCaseTimeline,
  createEmptyCase,
  extractSalesforceLeadDetails,
  generateCallBrief,
  generateCallEPrompt,
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

test("extractSalesforceLeadDetails pulls useful fields from Salesforce text", () => {
  const text = `
    CHI Lead- 50733791 - Louise Thomas - SG1 3ND - (WZ1_S11_63)
    CHI Lead Details
    Customer Name Miss Louise Thomas
    Contact Information
    Customer Address SG1 3ND 2 Langthorne Avenue
    Mobile Phone 07711209584
    Customer Email louise.thomas@hotmail.com
  `;

  const extracted = extractSalesforceLeadDetails(text);

  assert.equal(extracted.leadNumber, "50733791");
  assert.equal(extracted.customerName, "Louise Thomas");
  assert.equal(extracted.contactNumber, "07711209584");
  assert.equal(extracted.customerEmail, "louise.thomas@hotmail.com");
  assert.equal(extracted.postcode, "SG1 3ND");
  assert.equal(extracted.address, "SG1 3ND 2 Langthorne Avenue");
});

test("extractSalesforceLeadDetails handles Classic Salesforce label value rows", () => {
  const text = `
    CHI Lead Details
    CHI Lead Num
    50773906
    Customer Name
    Chris Beetham
    Customer Address
    10 Test Road
    Test Town
    SG1 3ND
    Mobile Phone
    07700 900123
    Customer Email
    chris@example.com
  `;

  const extracted = extractSalesforceLeadDetails(text);

  assert.equal(extracted.leadNumber, "50773906");
  assert.equal(extracted.customerName, "Chris Beetham");
  assert.equal(extracted.address, "10 Test Road, Test Town, SG1 3ND");
  assert.equal(extracted.contactNumber, "07700900123");
  assert.equal(extracted.customerEmail, "chris@example.com");
  assert.equal(extracted.postcode, "SG1 3ND");
});

test("extractSalesforceLeadDetails handles tabular appointed lead and quote products", () => {
  const text = `
    CHI Lead Num
    50774341
    Stage
    Appointed
    CHI Lead Name
    50774341 - Stefanie Bryant - GL52 6BD - (WZ1_S10_58)

    GL52 6BD 42 Leighton Road
    Customer Deceased
    Customer Name
    Mrs Stefanie Bryant
    SC Type
    Owner
    Edit Contact Details
    Stefanie Bryant
    Home Phone
    Install Address Street
    42 Leighton Road
    Mobile Phone
    07895315663
    Install Address City
    Cheltenham
    Customer Email
    stfbryant@yahoo.co.uk
    Install Postcode
    GL52 6BD

    Quote Products
    Action Part Number Product Description Sales Price Gross Total Total Price Ex VAT Quantity ASP Status ASP Removed Lead Time CS Template Section Header
    Edit CACU0018 Bosch Climate 3200i 3.5kW Indoor AC Unit £3,300.00 £3,300.00 £3,300.00 3 28 Air Conditioning
    Edit CACU0013 Bosch Climate 5000M 7.9kW (3) Multi Split Outdoor AC Unit £2,650.00 £2,650.00 £2,650.00 1 28 Air Conditioning
    Edit P978 Additional 5m Pipe Connection (for Bosch Multi-Split installations) £750.00 £750.00 £750.00 3 14 Air Conditioning
    Edit P944 Bosch Module IP Gateway £117.00 £117.00 £117.00 3 14 Air Conditioning
  `;

  const extracted = extractSalesforceLeadDetails(text);

  assert.equal(extracted.leadNumber, "50774341");
  assert.equal(extracted.customerName, "Stefanie Bryant");
  assert.equal(extracted.contactNumber, "07895315663");
  assert.equal(extracted.customerEmail, "stfbryant@yahoo.co.uk");
  assert.equal(extracted.address, "42 Leighton Road, Cheltenham, GL52 6BD");
  assert.equal(extracted.postcode, "GL52 6BD");
  assert.equal(extracted.indoorUnitCount, 3);
  assert.match(extracted.quotedPackage, /Bosch Climate 3200i 3\.5kW Indoor AC Unit x3/);
  assert.match(extracted.quotedPackage, /Bosch Climate 5000M 7\.9kW \(3\) Multi Split Outdoor AC Unit x1/);
});

test("extractSalesforceLeadDetails handles Salesforce job detail pages", () => {
  const text = `
    JOB-3260926
    Job Detail
    Status
    Pending
    Sub Status
    Install Date Required
    Installation Date

    Job Number
    JOB-3260926
    Customer Name
    Mrs Bryant
    CHI Lead
    50774341 - Stefanie Bryant - GL52 6BD - (WZ1_S10_58)
    Quote
    C507743410_CP
    Payment Method
    Finance
    Hide Section - Contact InfoContact Info
    Installation Address
    GL52 6BD 42
    District
    4B SEVERN AND AVON
    Customer Email Address
    stfbryant@yahoo.co.uk
    Home Phone
    07895315663
    Customer Mobile Phone
    07895315663
    Customer Email
    stfbryant@yahoo.co.uk
    Job Element
    Action Job Element ID Description Product ID Type Skill Sub Status Units Code Status Order
    Edit JE-121431369 7.9kW Climate 5000M Installation CACU0013 Work Mechanical Awaiting Order 3.50 8834 Active
    Edit JE-121431370 3.5kW 3200i Indoor Unit Installation CACU0018 Work Mechanical Awaiting Order 6.00 8839 Active
    Edit JE-121431371 3.5kW 3200i Indoor Unit Installation CACU0018 Work Mechanical Awaiting Order 6.00 8839 Active
    Edit JE-121431372 3.5kW 3200i Indoor Unit Installation CACU0018 Work Mechanical Awaiting Order 6.00 8839 Active
    Edit JE-121431373 5m Bosch Multi Split System AC Pipework P978 Work Mechanical Awaiting Order 0.01 8842 Active
    Edit JE-121431374 5m Bosch Multi Split System AC Pipework P978 Work Mechanical Awaiting Order 0.01 8842 Active
    Edit JE-121431375 5m Bosch Multi Split System AC Pipework P978 Work Mechanical Awaiting Order 0.01 8842 Active
  `;

  const extracted = extractSalesforceLeadDetails(text);

  assert.equal(extracted.jobNumber, "JOB-3260926");
  assert.equal(extracted.leadNumber, "50774341");
  assert.equal(extracted.customerName, "Stefanie Bryant");
  assert.equal(extracted.address, "GL52 6BD 42");
  assert.equal(extracted.contactNumber, "07895315663");
  assert.equal(extracted.customerEmail, "stfbryant@yahoo.co.uk");
  assert.equal(extracted.jobStatus, "Pending");
  assert.equal(extracted.jobSubStatus, "Install Date Required");
  assert.equal(extracted.quoteReference, "C507743410_CP");
  assert.equal(extracted.paymentMethod, "Finance");
  assert.equal(extracted.indoorUnitCount, 3);
  assert.match(extracted.quotedPackage, /3\.5kW 3200i Indoor Unit Installation x3/);
  assert.match(extracted.quotedPackage, /7\.9kW Climate 5000M Installation x1/);
});

test("generateMissingQuestions only asks for missing handover details", () => {
  const triageCase = createEmptyCase();
  triageCase.installDate = "2026-08-14";
  triageCase.planningDate = "2026-08-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
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
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
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

test("generateCustomerRequestMessage asks for missing outdoor photos specifically", () => {
  const triageCase = createEmptyCase();
  triageCase.customerName = "Alex Customer";
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.rooms[0].internalLocation = "Bedroom outside wall";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.rooms[0].plugLocation = "Socket beside bed";
  triageCase.outsideUnit.location = "Rear patio";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";
  triageCase.photos = [{
    id: "photo-1",
    name: "indoor.jpg",
    label: "Indoor",
    type: "indoor_location",
    notes: "",
    requestedAnnotation: "",
    marks: [],
  }];

  const message = generateCustomerRequestMessage(triageCase);

  assert.match(message, /outdoor unit location and the space around it/);
  assert.doesNotMatch(message, /indoor and outdoor unit locations/);
  assert.doesNotMatch(message, /electric meter/);
});

test("generateCustomerRequestMessage does not ask for outdoor photo when it exists", () => {
  const triageCase = createEmptyCase();
  triageCase.customerName = "Alex Customer";
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
  triageCase.rooms[0].internalLocation = "Bedroom outside wall";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.rooms[0].plugLocation = "Socket beside bed";
  triageCase.outsideUnit.location = "Rear patio";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";
  triageCase.photos = [{
    id: "photo-1",
    name: "outside.jpg",
    label: "Outside",
    type: "outdoor_location",
    notes: "",
    requestedAnnotation: "",
    marks: [],
  }];

  assert.doesNotMatch(generateCustomerRequestMessage(triageCase), /outdoor unit location and the space around it/);
});

test("generateCustomerRequestMessage handles complete data", () => {
  const triageCase = createEmptyCase();
  triageCase.customerName = "Alex Customer";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
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
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.checklist.externalUnitLocationChecked = true;
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
  triageCase.sourceDetails = "CHI Lead- 50733791 - Louise Thomas - SG1 3ND - (WZ1_S11_63)\nMobile Phone 07711209584";
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
  assert.equal(pack.lead.leadNumber, "50733791");
  assert.equal(pack.lead.customerName, "Louise Thomas");
  assert.equal(pack.lead.contactNumber, "07711209584");
  assert.equal(pack.lead.pastedJobDetails, triageCase.sourceDetails);
  assert.equal(pack.lead.extractedFromSalesforceText.postcode, "SG1 3ND");
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

test("generateAiReviewPack can include compressed image data for full JSON export", () => {
  const triageCase = createEmptyCase();
  triageCase.photos = [{
    id: "photo-1",
    name: "meter.jpg",
    type: "electric_meter",
    dataUrl: "data:image/jpeg;base64,COMPRESSED",
    marks: [],
  }];

  const json = generateAiReviewPackJson(triageCase, { includeImages: true });

  assert.match(json, /data:image\/jpeg;base64,COMPRESSED/);
  assert.match(json, /"mimeType": "image\/jpeg"/);
});

test("generateAiReviewPrompt instructs model not to invent information", () => {
  const prompt = generateAiReviewPrompt();

  assert.match(prompt, /air-con triage reviewer/);
  assert.match(prompt, /Do not invent missing information/);
  assert.match(prompt, /This pasted JSON is the review pack/);
  assert.match(prompt, /bg\.ac_triage\.ai_result\.v1/);
  assert.match(prompt, /normalised photo coordinates from 0 to 1/);
  assert.match(prompt, /photoAnnotations/);
});

test("generateCallBrief creates a CALL-E-ready brief with only unanswered questions", () => {
  const triageCase = createEmptyCase();
  triageCase.sourceDetails = `
    CHI Lead Num
    50773906
    Customer Name
    Chris Beetham
    Mobile Phone
    07700 900123
  `;
  triageCase.installDate = "2026-09-10";
  triageCase.planningDate = "2026-09-01";
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.electricMeterPhoto = true;
  triageCase.checklist.fuseBoardPhoto = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.rooms[0].internalLocation = "Bedroom outside wall";
  triageCase.rooms[0].pipeRun = "Straight through wall";
  triageCase.rooms[0].trunkingColour = "White";
  triageCase.rooms[0].plugLocation = "Socket beside bed";
  triageCase.outsideUnit.location = "Rear patio";
  triageCase.outsideUnit.clearances = "Clear";
  triageCase.outsideUnit.ladderAccess = "No ladder required";
  triageCase.photos = [{
    id: "photo-1",
    name: "indoor.jpg",
    label: "Indoor",
    type: "indoor_location",
    notes: "",
    requestedAnnotation: "",
    marks: [],
  }];

  const brief = generateCallBrief(triageCase);
  const prompt = generateCallEPrompt(triageCase);

  assert.equal(brief.schema, "bg.ac_triage.call_brief.v1");
  assert.equal(brief.lead.leadNumber, "50773906");
  assert.equal(brief.lead.customerName, "Chris Beetham");
  assert.equal(brief.lead.contactNumber, "07700900123");
  assert.ok(brief.unansweredQuestions.length > 0);
  assert.ok(brief.unansweredQuestions.every((question) => question.key && question.question));
  assert.match(brief.unansweredQuestions.map((question) => question.question).join("\n"), /photo|send|outdoor|unit/i);
  assert.match(prompt, /Use CALL-E to call this customer/);
  assert.match(prompt, /bg\.ac_triage\.call_result\.v1/);
  assert.doesNotMatch(prompt, /```/);
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

test("buildCaseTimeline captures source, photos, AI reviews, and replies", () => {
  const triageCase = createEmptyCase();
  triageCase.createdAt = "2026-07-08T09:00:00.000Z";
  triageCase.updatedAt = "2026-07-08T12:00:00.000Z";
  triageCase.sourceDetails = "CHI Lead- 50733791 - Louise Thomas - SG1 3ND - (WZ1_S11_63)";
  triageCase.photos = [{
    id: "photo-1",
    name: "outside.jpg",
    label: "Outside",
    type: "outdoor_location",
    notes: "",
    requestedAnnotation: "",
    marks: [],
  }];
  triageCase.reviewRounds = [{
    id: "round-1",
    round: 1,
    sentAt: "2026-07-08T10:00:00.000Z",
    inputSummary: "Initial pack",
    aiDecision: "missing_info",
    aiOutput: "{}",
    customerMessage: "Please send fuse board photo",
    outstandingBlockers: "Fuse board photo missing",
  }];
  triageCase.customerReplies = [{
    id: "reply-1",
    receivedAt: "2026-07-08T11:00:00.000Z",
    text: "Photo attached",
    photoIds: ["photo-2"],
    notes: "",
  }];

  const timeline = buildCaseTimeline(triageCase);
  const pack = generateAiReviewPack(triageCase);

  assert.deepEqual(timeline.map((event) => event.type), [
    "case_created",
    "salesforce_text",
    "photos_uploaded",
    "ai_review",
    "customer_reply",
  ]);
  assert.equal(timeline[1].detail, "Extracted lead 50733791, Louise Thomas");
  assert.equal(timeline[3].decision, "missing_info");
  assert.deepEqual(timeline[3].blockers, ["Fuse board photo missing"]);
  assert.equal(pack.timeline.length, timeline.length);
});
