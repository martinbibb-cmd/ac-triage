export const JOB_STAGES = [
  "Not checked",
  "Photos missing",
  "Needs customer call",
  "Ready for install date",
  "Complete",
];

export const TRUNKING_COLOURS = ["White", "Black", "Other"];
export const PHOTO_TYPES = [
  "indoor_location",
  "outdoor_location",
  "electric_meter",
  "fuse_board",
  "floorplan",
  "other",
];
export const SCHEMA_VERSION = 2;
export const LEGACY_CASE_STATUSES = ["draft", "ai_review_needed", "awaiting_customer", "ready", "complete"];
export const CASE_STATUSES = [
  "not_started",
  "evidence_review",
  "customer_contact_required",
  "awaiting_customer",
  "internal_clarification_required",
  "ready_for_handover",
  "completed",
];
export const NEXT_ACTIONS = [
  "review_again",
  "send_customer_message",
  "wait_for_reply",
  "copy_handover_to_salesforce",
];
export const AI_DECISIONS = ["", "ready", "missing_info"];
export const EVIDENCE_STATES = [
  "confirmed",
  "missing",
  "unclear",
  "not_applicable",
  "awaiting_customer",
  "awaiting_internal_clarification",
];
export const RATIONALE_CONFIDENCE = ["confirmed", "suspected", "unknown"];
export const RESOLVER_TYPES = ["customer", "customer_photo", "internal", "admin", "surveyor"];

export const REFERENCE_DATA = {
  title: "Bosch Climate 3200i reference",
  indoorClearances: [
    { label: "Top", value: "150mm minimum" },
    { label: "Left side", value: "120mm minimum" },
    { label: "Right side", value: "120mm minimum" },
    { label: "Floor / below unit", value: "1800mm minimum" },
  ],
  outdoorClearances: [
    { label: "Above unit", value: "600mm minimum" },
    { label: "Rear / wall side", value: "100mm minimum" },
    { label: "Left side", value: ">300mm" },
    { label: "Right side", value: ">600mm" },
    { label: "Front / service space", value: "2000mm" },
  ],
  indoorDimensions: [
    { output: "2.6 kW", height: 292, width: 729, depth: 200, weight: 8 },
    { output: "3.5 kW", height: 295, width: 802, depth: 200, weight: 8.7 },
    { output: "5.3 kW", height: 321, width: 971, depth: 228, weight: 11.2 },
    { output: "7 kW", height: 337, width: 1082, depth: 234, weight: 13.6 },
  ],
  outdoorDimensions: [
    { output: "2.6 kW", height: 495, width: 720, depth: 270, weight: 23.5 },
    { output: "3.5 kW", height: 495, width: 720, depth: 270, weight: 23.7 },
    { output: "5.3 kW", height: 554, width: 805, depth: 330, weight: 33.5 },
    { output: "7 kW", height: 673, width: 890, depth: 342, weight: 43.9 },
  ],
};

export const CHECKLIST = [
  { id: "salesforceLeadChecked", label: "Salesforce lead checked", group: "Admin" },
  { id: "installDateChecked", label: "Install date checked", group: "Dates" },
  { id: "customerPhotosPresent", label: "Customer photos present", group: "Photos" },
  { id: "electricMeterPhoto", label: "Electric meter photo", group: "Electrics" },
  { id: "fuseBoardPhoto", label: "Fuse board / consumer unit photo", group: "Electrics" },
  { id: "visibleEarthChecked", label: "Visible earth checked", group: "Electrics" },
  { id: "spareFuseChecked", label: "Spare fuse / circuit checked", group: "Electrics" },
  { id: "internalUnitLocationChecked", label: "Internal unit location checked", group: "Locations" },
  { id: "externalUnitLocationChecked", label: "External unit location checked", group: "Locations" },
  { id: "clearancesChecked", label: "Clearances checked", group: "Install" },
  { id: "ladderAccessChecked", label: "Ladder access / height safety checked", group: "Install" },
  { id: "quoteChecked", label: "Quote checked", group: "Admin" },
  { id: "wifiDongleChecked", label: "Wi-Fi dongle checked", group: "Options" },
  { id: "pipeworkChecked", label: "Pipework / trunking checked", group: "Install" },
  { id: "planningDateConfirmed", label: "Planning date confirmed", group: "Dates" },
];

export const WORKFLOW_STEPS = [
  { id: "stageChecked", label: "Stage checked" },
  { id: "preTriageComplete", label: "Pre-triage complete" },
  { id: "customerContacted", label: "Customer contacted" },
  { id: "photosPrepared", label: "Photos annotated / prepared" },
  { id: "notesUploaded", label: "Handover notes uploaded" },
  { id: "installDateConfirmed", label: "Install date confirmed" },
  { id: "spreadsheetUpdated", label: "Spreadsheet updated / complete" },
];

export const EVIDENCE_ITEMS = [
  { id: "lead_customer_details", label: "Lead/customer details", resolverType: "admin" },
  { id: "quote_package", label: "Quote/package", resolverType: "admin" },
  { id: "indoor_unit_locations", label: "Indoor-unit locations", resolverType: "customer" },
  { id: "indoor_unit_wall_photos", label: "Indoor-unit wall photos", resolverType: "customer_photo" },
  { id: "outdoor_unit_location", label: "Outdoor-unit location", resolverType: "customer" },
  { id: "outdoor_unit_photos", label: "Outdoor-unit photos", resolverType: "customer_photo" },
  { id: "pipe_route", label: "Pipe route", resolverType: "customer" },
  { id: "condensate_route", label: "Condensate route", resolverType: "surveyor" },
  { id: "electrical_evidence", label: "Electrical evidence", resolverType: "internal" },
  { id: "consumer_unit_photo", label: "Consumer-unit photo", resolverType: "customer_photo" },
  { id: "nearest_internal_socket", label: "Nearest relevant internal socket", resolverType: "customer" },
  { id: "access_ladder_requirements", label: "Access and ladder requirements", resolverType: "customer" },
  { id: "customer_preferences", label: "Customer preferences", resolverType: "customer" },
  { id: "planning_status", label: "Planning status", resolverType: "admin" },
  { id: "install_date", label: "Install date", resolverType: "admin" },
  { id: "other_notes", label: "Other notes", resolverType: "admin" },
];

export const QUESTION_DEFINITIONS = [
  questionDefinition({
    id: "case.lead_details",
    category: "lead_customer_details",
    customerQuestion: "",
    internalLabel: "Lead/customer details",
    why: "Supports Salesforce handover and customer contact.",
    whoUsesAnswer: "BG/admin",
    resolverType: "admin",
    requiredWhen: [{ field: "leadNumber", op: "missing" }],
    completeWhen: [{ field: "leadNumber", op: "present" }],
  }),
  questionDefinition({
    id: "case.quoted_package",
    category: "quote_package",
    customerQuestion: "",
    internalLabel: "Quoted package",
    why: "Supports package and equipment suitability review.",
    whoUsesAnswer: "BG/admin",
    resolverType: "admin",
    requiredWhen: [{ field: "caseDetails.quotedPackage", op: "missing" }],
    completeWhen: [{ field: "caseDetails.quotedPackage", op: "present" }],
  }),
  questionDefinition({
    id: "indoor.room_size",
    category: "indoor_unit_locations",
    customerQuestion: "What is the approximate room size?",
    internalLabel: "Room size",
    why: "Supports equipment suitability review.",
    whoUsesAnswer: "Surveyor",
    resolverType: "customer",
    scope: "indoorUnit",
    requiredWhen: [{ field: "room", op: "present" }],
    completeWhen: [{ field: "roomSize", op: "present" }],
  }),
  questionDefinition({
    id: "indoor.location",
    category: "indoor_unit_locations",
    customerQuestion: "Where would you like the indoor unit fitted?",
    internalLabel: "Indoor unit agreed location",
    why: "Supports mounting, pipe route and appearance review.",
    whoUsesAnswer: "Installer and surveyor",
    resolverType: "customer",
    scope: "indoorUnit",
    requiredWhen: [{ field: "room", op: "present" }],
    completeWhen: [{ field: "agreedLocation", legacyField: "internalLocation", op: "present" }],
  }),
  questionDefinition({
    id: "indoor.wall_photo",
    category: "indoor_unit_wall_photos",
    customerQuestion: "Can you send a clear photo of the proposed indoor unit wall?",
    internalLabel: "Indoor wall photo",
    why: "Supports mounting, access and pipe exit review.",
    whoUsesAnswer: "Installer and surveyor",
    resolverType: "customer_photo",
    scope: "indoorUnit",
    requiredWhen: [{ field: "agreedLocation", legacyField: "internalLocation", op: "present" }],
    completeWhen: [{ evidence: "indoor_unit_wall_photos", stateIn: ["confirmed", "not_applicable"] }],
  }),
  questionDefinition({
    id: "indoor.pipe_route",
    category: "pipe_route",
    customerQuestion: "What route should the pipework take from the indoor unit?",
    internalLabel: "Pipe route",
    why: "Supports installation route, materials and appearance review.",
    whoUsesAnswer: "Installer and surveyor",
    resolverType: "customer",
    scope: "indoorUnit",
    requiredWhen: [{ field: "agreedLocation", legacyField: "internalLocation", op: "present" }],
    completeWhen: [{ field: "pipeRoute", legacyField: "pipeRun", op: "present" }],
  }),
  questionDefinition({
    id: "indoor.trunking_colour",
    category: "customer_preferences",
    customerQuestion: "Would you prefer white or black trunking?",
    internalLabel: "Trunking colour",
    why: "Customer preference.",
    whoUsesAnswer: "Installer",
    resolverType: "customer",
    scope: "indoorUnit",
    requiredWhen: [{ field: "pipeRoute", legacyField: "pipeRun", op: "present" }],
    completeWhen: [{ field: "trunkingColour", op: "present" }],
  }),
  questionDefinition({
    id: "indoor.nearest_socket",
    category: "nearest_internal_socket",
    customerQuestion: "Where is the nearest relevant internal socket?",
    internalLabel: "Nearest internal socket",
    why: "Reason not yet confirmed",
    whoUsesAnswer: "Internal technical reviewer",
    resolverType: "customer",
    rationaleConfidence: "unknown",
    scope: "indoorUnit",
    requiredWhen: [{ field: "agreedLocation", legacyField: "internalLocation", op: "present" }],
    completeWhen: [{ field: "nearestSocket", legacyField: "plugLocation", op: "present" }],
  }),
  questionDefinition({
    id: "outdoor.location",
    category: "outdoor_unit_location",
    customerQuestion: "Where can the outdoor unit go?",
    internalLabel: "Outdoor location",
    why: "Supports mounting, access and clearance review.",
    whoUsesAnswer: "Installer and surveyor",
    resolverType: "customer",
    requiredWhen: [],
    completeWhen: [{ field: "outdoorUnit.location", legacyField: "outsideUnit.location", op: "present" }],
  }),
  questionDefinition({
    id: "outdoor.photos",
    category: "outdoor_unit_photos",
    customerQuestion: "Can you send clear photos of the proposed outdoor unit position and surrounding space?",
    internalLabel: "Outdoor-unit photos",
    why: "Supports mounting, access and clearance review.",
    whoUsesAnswer: "Installer and surveyor",
    resolverType: "customer_photo",
    requiredWhen: [{ field: "outdoorUnit.location", legacyField: "outsideUnit.location", op: "present" }],
    completeWhen: [{ evidence: "outdoor_unit_photos", stateIn: ["confirmed", "not_applicable"] }],
  }),
  questionDefinition({
    id: "outdoor.clearances",
    category: "outdoor_unit_location",
    customerQuestion: "",
    internalLabel: "Outdoor clearances/access",
    why: "Supports mounting, access and clearance review.",
    whoUsesAnswer: "Surveyor",
    resolverType: "surveyor",
    requiredWhen: [{ field: "outdoorUnit.location", legacyField: "outsideUnit.location", op: "present" }],
    completeWhen: [{ field: "outdoorUnit.clearances", legacyField: "outsideUnit.clearances", op: "present" }],
  }),
  questionDefinition({
    id: "outdoor.condensate",
    category: "condensate_route",
    customerQuestion: "",
    internalLabel: "Condensate route",
    why: "Supports installation route and drainage review.",
    whoUsesAnswer: "Surveyor",
    resolverType: "surveyor",
    requiredWhen: [{ field: "outdoorUnit.location", legacyField: "outsideUnit.location", op: "present" }],
    completeWhen: [{ field: "outdoorUnit.condensateRoute", op: "present" }, { evidence: "condensate_route", stateIn: ["confirmed", "not_applicable"] }],
    completeMode: "any",
  }),
  questionDefinition({
    id: "electrical.consumer_unit_photo",
    category: "consumer_unit_photo",
    customerQuestion: "Can you send a clear photo of the consumer unit/fuse board?",
    internalLabel: "Consumer-unit photo",
    why: "Supports electrical evidence review.",
    whoUsesAnswer: "Internal technical reviewer",
    resolverType: "customer_photo",
    requiredWhen: [],
    completeWhen: [{ evidence: "consumer_unit_photo", stateIn: ["confirmed", "not_applicable"] }],
  }),
  questionDefinition({
    id: "electrical.spare_rcd_rcbo_way",
    category: "electrical_evidence",
    customerQuestion: "",
    internalLabel: "Spare RCD/RCBO way",
    why: "Reason not yet confirmed",
    whoUsesAnswer: "Internal technical reviewer",
    resolverType: "internal",
    rationaleConfidence: "unknown",
    requiredWhen: [{ evidence: "consumer_unit_photo", stateIn: ["confirmed"] }],
    completeWhen: [{ field: "electrical.spareWay", op: "present" }, { evidence: "electrical_evidence", stateIn: ["confirmed", "not_applicable"] }],
    completeMode: "any",
  }),
  questionDefinition({
    id: "electrical.visible_earth",
    category: "electrical_evidence",
    customerQuestion: "",
    internalLabel: "Visible earth",
    why: "Reason not yet confirmed",
    whoUsesAnswer: "Internal technical reviewer",
    resolverType: "internal",
    rationaleConfidence: "unknown",
    requiredWhen: [{ evidence: "consumer_unit_photo", stateIn: ["confirmed"] }],
    completeWhen: [{ field: "electrical.visibleEarth", op: "present" }, { evidence: "electrical_evidence", stateIn: ["confirmed", "not_applicable"] }],
    completeMode: "any",
  }),
  questionDefinition({
    id: "case.planning_status",
    category: "planning_status",
    customerQuestion: "",
    internalLabel: "Planning status",
    why: "Supports admin readiness review.",
    whoUsesAnswer: "BG/admin",
    resolverType: "admin",
    requiredWhen: [],
    completeWhen: [{ field: "caseDetails.planningStatus", legacyField: "planningDate", op: "present" }, { evidence: "planning_status", stateIn: ["confirmed", "not_applicable"] }],
    completeMode: "any",
  }),
  questionDefinition({
    id: "case.install_date",
    category: "install_date",
    customerQuestion: "",
    internalLabel: "Install date",
    why: "Supports handover scheduling.",
    whoUsesAnswer: "BG/admin",
    resolverType: "admin",
    requiredWhen: [],
    completeWhen: [{ field: "caseDetails.installDate", legacyField: "installDate", op: "present" }, { evidence: "install_date", stateIn: ["confirmed", "not_applicable"] }],
    completeMode: "any",
  }),
];

export function createEmptyCase() {
  const checklist = Object.fromEntries(CHECKLIST.map((item) => [item.id, false]));
  const workflow = Object.fromEntries(WORKFLOW_STEPS.map((item) => [item.id, false]));
  const id = cryptoRandomId();
  return {
    schemaVersion: SCHEMA_VERSION,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    leadNumber: "",
    customerName: "",
    address: "",
    contactNumber: "",
    customerEmail: "",
    sourceDetails: "",
    status: "not_started",
    nextAction: "review_again",
    caseDetails: {
      quotedPackage: "",
      indoorUnitCount: 1,
      planningStatus: "",
      installDate: "",
    },
    evidenceStates: createDefaultEvidenceStates(),
    answers: {},
    indoorUnits: [createEmptyIndoorUnit()],
    outdoorUnit: createEmptyOutdoorUnit(),
    electrical: {
      spareWay: "",
      visibleEarth: "",
      notes: "",
    },
    timeline: [],
    generatedOutputs: {},
    aiReview: {
      suggestions: [],
    },
    completionStatus: {
      status: "not_started",
      nextAction: "Start intake",
      readyForHandover: false,
    },
    propertyType: "",
    jobStage: JOB_STAGES[0],
    installDate: "",
    planningDate: "",
    checklist,
    workflow,
    outsideUnit: createEmptyOutsideUnit(),
    rooms: [createEmptyRoom()],
    photos: [],
    reviewRounds: [],
    customerReplies: [],
    notes: "",
  };
}

export function createEmptyIndoorUnit() {
  return {
    id: cryptoRandomId(),
    room: "",
    roomSize: "",
    agreedLocation: "",
    wallConstruction: "",
    pipeRoute: "",
    trunkingColour: "",
    trunkingOther: "",
    nearestSocket: "",
    accessDetails: "",
    notes: "",
  };
}

export function createEmptyOutdoorUnit() {
  return {
    location: "",
    mounting: "",
    route: "",
    clearances: "",
    access: "",
    condensateRoute: "",
    notes: "",
  };
}

export function createEmptyReviewRound(round = 1) {
  return {
    id: cryptoRandomId(),
    round,
    sentAt: new Date().toISOString(),
    inputSummary: "",
    aiDecision: "",
    aiOutput: "",
    customerMessage: "",
    outstandingBlockers: "",
  };
}

export function createEmptyCustomerReply() {
  return {
    id: cryptoRandomId(),
    receivedAt: new Date().toISOString(),
    text: "",
    photoIds: [],
    notes: "",
  };
}

export function createEmptyOutsideUnit() {
  return {
    location: "",
    mounting: "",
    clearances: "",
    ladderAccess: "",
    notes: "",
  };
}

export function createEmptyRoom() {
  return {
    id: cryptoRandomId(),
    roomName: "",
    roomSize: "",
    suggestedUnitSize: "",
    internalLocation: "",
    pipeRun: "",
    trunkingColour: "White",
    trunkingOther: "",
    plugLocation: "",
    electricalSupplyNotes: "",
    wifiDongleRequired: false,
  };
}

export function suggestUnitSize(size) {
  const value = Number.parseFloat(size);
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value < 15) return "SMALL";
  if (value <= 25) return "MED";
  if (value <= 45) return "LARGE";
  return "LARGE";
}

export function extractSalesforceLeadDetails(text) {
  const source = clean(text);
  if (!source) return {};

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const joined = lines.join("\n");
  const titleLine = lines.find((line) => /CHI Lead[-:\s]/i.test(line) && /\d{6,}/.test(line)) || "";
  const chiLeadValue = valueAfterLabel(lines, ["CHI Lead Name"]) || valueAfterExactLabel(lines, "CHI Lead");
  const chiLeadSource = titleLine || chiLeadValue || joined;

  const leadNumber = firstMatch(joined, [
    /CHI Lead[-:\s]*(\d{6,})/i,
    /CHI Lead Num\s+(\d{6,})/i,
    /Lead Number\s*(\d{6,})/i,
    /\bLead\s*#?\s*(\d{6,})/i,
  ]) || valueAfterLabel(lines, ["CHI Lead Num", "CHI Lead Number", "Lead Number"]);
  const customerName = cleanName(firstMatch(chiLeadSource, [
    /\d{6,}\s*-\s*([A-Z][^-]+?)\s*-\s*[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i,
  ]) || firstMatch(joined, [
    /\d{6,}\s*-\s*([A-Z][^-]+?)\s*-\s*[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i,
    /Customer Name\s+(.+)/i,
    /Contact Name\s+(.+)/i,
    /Name\s+((?:Mr|Mrs|Miss|Ms|Dr)\.?\s+.+)/i,
  ]) || valueAfterLabel(lines, ["Customer Name", "Contact Name", "Name"]));
  const customerEmail = valueAfterLabel(lines, ["Customer Email Address", "Customer Email", "Comms Email Field", "Email"]) || firstMatch(joined, [
    /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i,
  ]);
  const contactNumber = normalisePhone(valueAfterLabel(lines, ["Customer Mobile Phone", "Mobile Phone", "Home Phone", "Work Phone", "Phone", "Contact Number", "Customer Phone"]) || firstMatch(joined, [
    /(?:Mobile Phone|Phone|Contact Number|Customer Phone)\s+(\+?44\s?\d[\d\s]{8,}|0\d[\d\s]{8,})/i,
    /(\+?44\s?7\d[\d\s]{7,}|07\d[\d\s]{8,})/,
    /(\+?44\s?[123]\d[\d\s]{8,}|0[123]\d[\d\s]{8,})/,
  ]));
  const postcode = (firstMatch(chiLeadSource, [
    /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i,
  ]) || firstMatch(joined, [
    /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i,
  ])).toUpperCase();
  const address = extractAddress(lines, postcode);
  const quoteProducts = extractQuoteProducts(lines);
  const jobElements = extractJobElements(lines);
  const quotedPackage = quoteProducts.quotedPackage || jobElements.quotedPackage;
  const indoorUnitCount = quoteProducts.indoorUnitCount || jobElements.indoorUnitCount;

  return removeEmpty({
    jobNumber: firstMatch(joined, [/\b(JOB-\d+)\b/i]) || valueAfterLabel(lines, ["Job Number"]),
    leadNumber,
    customerName,
    address,
    contactNumber,
    customerEmail,
    postcode,
    quotedPackage,
    indoorUnitCount,
    jobStatus: valueAfterLabel(lines, ["Status"]),
    jobSubStatus: valueAfterLabel(lines, ["Sub Status"]),
    quoteReference: valueAfterLabel(lines, ["Quote"]),
    paymentMethod: valueAfterLabel(lines, ["Payment Method"]),
  });
}

export function generateMissingQuestions(caseData) {
  const questions = [];
  const outsideUnit = caseData.outsideUnit ?? createEmptyOutsideUnit();
  const hasIndoorPhoto = hasPhotoType(caseData, "indoor_location");
  const hasOutdoorPhoto = hasPhotoType(caseData, "outdoor_location");
  const hasAnyPhoto = Boolean(caseData.photos?.length || caseData.checklist?.customerPhotosPresent);

  for (const room of caseData.rooms ?? []) {
    const roomPrefix = room.roomName ? `${room.roomName}: ` : "";
    if (!room.internalLocation?.trim()) {
      questions.push(`${roomPrefix}Can you confirm where you want the indoor unit?`);
    }
    if (!room.trunkingColour || room.trunkingColour === "Other") {
      questions.push(`${roomPrefix}Do you want white or black trunking?`);
    }
    if (!room.plugLocation?.trim()) {
      questions.push(`${roomPrefix}Where is the nearest plug socket?`);
    }
    if (!room.pipeRun?.trim()) {
      questions.push(`${roomPrefix}Can you confirm the preferred pipe route?`);
    }
  }

  if (!outsideUnit.location?.trim()) {
    questions.push("Can you confirm where the outdoor unit can go?");
  }
  if (!outsideUnit.clearances?.trim() && !caseData.checklist?.clearancesChecked) {
    questions.push("Can you confirm there is clear space around the outdoor unit location?");
  }
  if (!outsideUnit.ladderAccess?.trim() && !caseData.checklist?.ladderAccessChecked) {
    questions.push("Can you confirm if ladder access or height safety is needed for the outdoor unit?");
  }

  if (!hasAnyPhoto) {
    questions.push("Can you send clear photos of the proposed indoor and outdoor unit locations?");
  } else {
    if (!hasIndoorPhoto && !caseData.checklist?.internalUnitLocationChecked) {
      questions.push("Can you send a clear photo of the proposed indoor unit location?");
    }
    if (!hasOutdoorPhoto && !caseData.checklist?.externalUnitLocationChecked) {
      questions.push("Can you send clear photos of the proposed outdoor unit location and the space around it?");
    }
  }
  if (!caseData.checklist?.electricMeterPhoto) {
    questions.push("Can you send a clear photo of the electric meter?");
  }
  if (!caseData.checklist?.fuseBoardPhoto) {
    questions.push("Can you send a clear photo of the fuse board / consumer unit?");
  }
  if (!caseData.installDate?.trim()) {
    questions.push("Can you confirm the install date?");
  }
  if (!caseData.planningDate?.trim() && !caseData.checklist?.planningDateConfirmed) {
    questions.push("Can you confirm the planning date?");
  }

  return [...new Set(questions)];
}

export function generateCustomerRequestMessage(caseData) {
  const questions = generateMissingQuestions(caseData);
  const name = clean(caseData.customerName);
  const greeting = name ? `Hi ${firstName(name)},` : "Hi,";

  if (!questions.length) {
    return [
      greeting,
      "",
      "Thanks, we have the triage information we need at the moment.",
    ].join("\n");
  }

  return [
    greeting,
    "",
    "We are checking the air con installation details and need a few points confirmed before handover:",
    "",
    ...questions.map((question) => `- ${question}`),
    "",
    "Please reply with the missing details when convenient.",
    "",
    "Thanks",
  ].join("\n");
}

export function generateCallBrief(caseData) {
  const extracted = extractSalesforceLeadDetails(caseData.sourceDetails);
  const customerQuestions = evaluateQuestions(caseData)
    .filter((question) => !question.complete && ["customer", "customer_photo"].includes(question.resolverType) && question.customerQuestion);
  return {
    schema: "bg.ac_triage.call_brief.v1",
    goal: "Call the customer and complete only the unanswered air-con triage questions.",
    lead: {
      leadNumber: clean(caseData.leadNumber) || extracted.leadNumber || "",
      customerName: clean(caseData.customerName) || extracted.customerName || "",
      contactNumber: clean(caseData.contactNumber) || extracted.contactNumber || "",
      customerEmail: clean(caseData.customerEmail) || extracted.customerEmail || "",
      address: clean(caseData.address) || extracted.address || "",
    },
    callRules: [
      "Ask only the questions listed in unansweredQuestions.",
      "Do not ask the customer for internal admin information.",
      "If photos are needed, ask the customer to send them after the call.",
      "If the customer is unsure, mark the answer as uncertain rather than guessing.",
      "Return JSON only using schema bg.ac_triage.call_result.v1.",
    ],
    unansweredQuestions: customerQuestions.map((question) => ({
      key: question.key,
      question: question.customerQuestion,
      category: question.category,
      resolverType: question.resolverType,
      why: question.why,
    })),
    knownContext: {
      indoorUnits: (caseData.indoorUnits ?? []).map((unit, index) => ({
        id: unit.id || String(index),
        room: clean(unit.room || unit.roomName),
        agreedLocation: clean(unit.agreedLocation || unit.internalLocation),
        pipeRoute: clean(unit.pipeRoute || unit.pipeRun),
        trunkingColour: clean(unit.trunkingColour),
        nearestSocket: clean(unit.nearestSocket || unit.plugLocation),
      })),
      outdoorUnit: {
        location: clean(caseData.outdoorUnit?.location || caseData.outsideUnit?.location),
        route: clean(caseData.outdoorUnit?.route),
        clearances: clean(caseData.outdoorUnit?.clearances || caseData.outsideUnit?.clearances),
        access: clean(caseData.outdoorUnit?.access || caseData.outsideUnit?.ladderAccess),
      },
      evidence: {
        photoCount: caseData.photos?.length ?? 0,
        indoorLocationPhotoPresent: hasPhotoType(caseData, "indoor_location"),
        outdoorLocationPhotoPresent: hasPhotoType(caseData, "outdoor_location"),
        electricMeterPhotoPresent: hasPhotoType(caseData, "electric_meter"),
        fuseBoardPhotoPresent: hasPhotoType(caseData, "fuse_board"),
        evidenceStates: caseData.evidenceStates ?? {},
      },
    },
    expectedResultSchema: {
      schema: "bg.ac_triage.call_result.v1",
      callStatus: "completed | no_answer | voicemail | wrong_number | customer_declined",
      customerReply: "Short factual summary of what the customer said",
      transcript: "Call transcript or detailed call notes",
      answers: {
        questionAnswers: [{
          key: "question key from unansweredQuestions",
          answer: "",
          state: "confirmed | awaiting_customer | awaiting_internal_clarification | not_applicable",
          uncertain: false,
        }],
        indoorUnits: [{
          id: "",
          room: "",
          agreedLocation: "",
          pipeRoute: "",
          trunkingColour: "",
          nearestSocket: "",
          uncertain: false,
        }],
        outdoorUnit: {
          location: "",
          route: "",
          clearances: "",
          access: "",
          uncertain: false,
        },
        requestedPhotos: ["Specific photos the customer agreed to send"],
      },
      blockers: ["Anything still missing after the call"],
      nextAction: "wait_for_reply | review_again | copy_handover_to_salesforce",
    },
  };
}

export function generateCallEPrompt(caseData) {
  return [
    "Use CALL-E to call this customer and complete the air-con triage call.",
    "",
    "Call brief JSON:",
    JSON.stringify(generateCallBrief(caseData), null, 2),
    "",
    "Important:",
    "- Use the phone number in lead.contactNumber.",
    "- Ask only unansweredQuestions.",
    "- Keep the call practical and short.",
    "- Return JSON only using schema bg.ac_triage.call_result.v1 so it can be pasted back into the triage app.",
    "- Do not include markdown fences.",
  ].join("\n");
}

export function generateHandoverNotes(caseData) {
  const rooms = caseData.rooms?.length ? caseData.rooms : [createEmptyRoom()];
  const outsideUnit = caseData.outsideUnit ?? createEmptyOutsideUnit();
  const roomSections = rooms.map((room, index) => {
    const colour = room.trunkingColour === "Other" ? clean(room.trunkingOther) : clean(room.trunkingColour);
    return [
      `ROOM ${index + 1}`,
      `Room name: ${clean(room.roomName)}`,
      `Room size: ${clean(room.roomSize)}${room.roomSize ? "m2" : ""}`,
      `Unit size: ${clean(room.suggestedUnitSize || suggestUnitSize(room.roomSize))}`,
      `Internal location: ${clean(room.internalLocation)}`,
      `Pipe run: ${clean(room.pipeRun)}`,
      `Trunking colour: ${colour}`,
      `Electrical supply: ${clean(room.electricalSupplyNotes)}`,
      `Plug location: ${clean(room.plugLocation)}`,
      `Wi-Fi dongle required: ${room.wifiDongleRequired ? "Yes" : "No"}`,
    ].join("\n");
  });

  const questions = generateMissingQuestions(caseData);
  return [
    "TRIAGE NOTES",
    `Lead: ${clean(caseData.leadNumber)}`,
    `Customer: ${clean(caseData.customerName)}`,
    `Address: ${clean(caseData.address)}`,
    `AC unit/s: ${rooms.length}`,
    `Property type: ${clean(caseData.propertyType)}`,
    "",
    roomSections.join("\n\n"),
    "",
    "OUTSIDE UNIT",
    `Location: ${clean(outsideUnit.location)}`,
    `Mounting: ${clean(outsideUnit.mounting)}`,
    `Clearances: ${clean(outsideUnit.clearances)}`,
    `Ladder access: ${clean(outsideUnit.ladderAccess)}`,
    `Notes: ${clean(outsideUnit.notes)}`,
    "",
    "CHECKS",
    `Photos: ${checkSummary(caseData, ["customerPhotosPresent", "electricMeterPhoto", "fuseBoardPhoto"])}`,
    `Electrics: ${checkSummary(caseData, ["visibleEarthChecked", "spareFuseChecked"])}`,
    `Clearances: ${yesNo(caseData.checklist?.clearancesChecked)}`,
    `Ladder access: ${yesNo(caseData.checklist?.ladderAccessChecked)}`,
    `Install date: ${clean(caseData.installDate) || yesNo(caseData.checklist?.installDateChecked)}`,
    `Planning date: ${clean(caseData.planningDate) || yesNo(caseData.checklist?.planningDateConfirmed)}`,
    `Questions outstanding: ${questions.length ? questions.join(" | ") : "None"}`,
  ].join("\n");
}

export function generateReferenceText() {
  const indoorClearances = REFERENCE_DATA.indoorClearances
    .map((item) => `${item.label}: ${item.value}`)
    .join(" | ");
  const outdoorClearances = REFERENCE_DATA.outdoorClearances
    .map((item) => `${item.label}: ${item.value}`)
    .join(" | ");
  const indoorDimensions = REFERENCE_DATA.indoorDimensions
    .map(formatDimensionRow)
    .join("\n");
  const outdoorDimensions = REFERENCE_DATA.outdoorDimensions
    .map(formatDimensionRow)
    .join("\n");

  return [
    REFERENCE_DATA.title,
    "",
    "INDOOR CLEARANCES",
    indoorClearances,
    "",
    "OUTDOOR CLEARANCES",
    outdoorClearances,
    "",
    "INDOOR DIMENSIONS",
    indoorDimensions,
    "",
    "OUTDOOR DIMENSIONS",
    outdoorDimensions,
  ].join("\n");
}

export function generateAiReviewPack(caseData, options = {}) {
  const includeImages = Boolean(options.includeImages);
  const rooms = caseData.rooms?.length ? caseData.rooms : [createEmptyRoom()];
  const checklist = caseData.checklist ?? {};
  const extracted = extractSalesforceLeadDetails(caseData.sourceDetails);
  return {
    schema: "bg.ac_triage.review_pack.v1",
    timeline: buildCaseTimeline(caseData),
    lead: {
      leadNumber: clean(caseData.leadNumber) || extracted.leadNumber || "",
      customerName: clean(caseData.customerName) || extracted.customerName || "",
      address: clean(caseData.address) || extracted.address || "",
      contactNumber: clean(caseData.contactNumber) || extracted.contactNumber || "",
      customerEmail: clean(caseData.customerEmail) || extracted.customerEmail || "",
      propertyType: clean(caseData.propertyType),
      installDate: clean(caseData.installDate),
      planningDate: clean(caseData.planningDate),
      pastedJobDetails: clean(caseData.sourceDetails),
      extractedFromSalesforceText: extracted,
      status: CASE_STATUSES.includes(caseData.status) ? caseData.status : "draft",
      nextAction: NEXT_ACTIONS.includes(caseData.nextAction) ? caseData.nextAction : "review_again",
    },
    rooms: rooms.map((room) => ({
      roomName: clean(room.roomName),
      roomSizeM2: clean(room.roomSize),
      suggestedUnitSize: clean(room.suggestedUnitSize || suggestUnitSize(room.roomSize)),
      internalLocation: clean(room.internalLocation),
      pipeRun: clean(room.pipeRun),
      trunkingColour: clean(room.trunkingColour),
      plugLocation: clean(room.plugLocation),
      electricalSupplyNotes: clean(room.electricalSupplyNotes),
      wifiDongleRequired: typeof room.wifiDongleRequired === "boolean" ? room.wifiDongleRequired : null,
    })),
    outsideUnit: {
      location: clean(caseData.outsideUnit?.location),
      mounting: clean(caseData.outsideUnit?.mounting),
      clearances: clean(caseData.outsideUnit?.clearances),
      ladderAccess: clean(caseData.outsideUnit?.ladderAccess),
      notes: clean(caseData.outsideUnit?.notes),
    },
    evidence: {
      photosPresent: Boolean(checklist.customerPhotosPresent || caseData.photos?.length),
      electricMeterPhotoPresent: Boolean(checklist.electricMeterPhoto || hasPhotoType(caseData, "electric_meter")),
      fuseBoardPhotoPresent: Boolean(checklist.fuseBoardPhoto || hasPhotoType(caseData, "fuse_board")),
      indoorLocationPhotosPresent: hasPhotoType(caseData, "indoor_location"),
      outdoorLocationPhotosPresent: hasPhotoType(caseData, "outdoor_location"),
      annotatedPhotosPrepared: Boolean(caseData.workflow?.photosPrepared || caseData.photos?.some((photo) => photo.annotatedDataUrl)),
      rightmoveChecked: Boolean(caseData.workflow?.rightmoveChecked),
      floorplanChecked: hasPhotoType(caseData, "floorplan"),
    },
    reviewChecks: {
      visibleEarthChecked: Boolean(checklist.visibleEarthChecked),
      spareFuseChecked: Boolean(checklist.spareFuseChecked),
      clearancesChecked: Boolean(checklist.clearancesChecked),
      ladderAccessChecked: Boolean(checklist.ladderAccessChecked),
      quoteChecked: Boolean(checklist.quoteChecked),
      pipeworkChecked: Boolean(checklist.pipeworkChecked),
      planningOrInstallDateChecked: Boolean(checklist.installDateChecked || checklist.planningDateConfirmed || caseData.installDate || caseData.planningDate),
    },
    photoManifest: (caseData.photos ?? []).map((photo, index) => ({
      id: photo.id || `photo-${index + 1}`,
      fileName: clean(photo.name) || `photo-${index + 1}`,
      label: clean(photo.label),
      type: PHOTO_TYPES.includes(photo.type) ? photo.type : "other",
      notes: clean(photo.notes),
      requestedAnnotation: clean(photo.requestedAnnotation),
      hasAppMarkup: Boolean(photo.marks?.length || photo.annotatedDataUrl),
      ...(includeImages ? {
        mimeType: "image/jpeg",
        dataUrl: photo.annotatedDataUrl || photo.dataUrl || "",
      } : {}),
    })),
    reviewHistory: (caseData.reviewRounds ?? []).map((round, index) => ({
      round: Number(round.round) || index + 1,
      sentAt: clean(round.sentAt),
      inputSummary: clean(round.inputSummary),
      aiDecision: AI_DECISIONS.includes(round.aiDecision) ? round.aiDecision : "",
      aiOutput: clean(round.aiOutput),
      customerMessage: clean(round.customerMessage),
      outstandingBlockers: splitLines(round.outstandingBlockers),
    })),
    customerReplies: (caseData.customerReplies ?? []).map((reply) => ({
      receivedAt: clean(reply.receivedAt),
      text: clean(reply.text),
      photoIds: Array.isArray(reply.photoIds) ? reply.photoIds : [],
      notes: clean(reply.notes),
    })),
    desiredOutput: {
      decision: "ready | missing_info",
      handoverNotes: true,
      customerSmsOrEmail: true,
      photoAnnotations: true,
    },
  };
}

export function buildCaseTimeline(caseData) {
  const items = [];
  if (caseData.createdAt) {
    items.push({
      type: "case_created",
      at: caseData.createdAt,
      summary: "Case created",
    });
  }
  if (clean(caseData.sourceDetails)) {
    const extracted = extractSalesforceLeadDetails(caseData.sourceDetails);
    const extractedParts = [
      extracted.leadNumber && `lead ${extracted.leadNumber}`,
      extracted.customerName,
      extracted.contactNumber,
      extracted.customerEmail,
    ].filter(Boolean);
    items.push({
      type: "salesforce_text",
      at: caseData.updatedAt || caseData.createdAt || "",
      summary: "Salesforce text pasted",
      detail: extractedParts.length ? `Extracted ${extractedParts.join(", ")}` : "Raw Salesforce text included",
    });
  }
  if (caseData.photos?.length) {
    items.push({
      type: "photos_uploaded",
      at: caseData.updatedAt || caseData.createdAt || "",
      summary: `${caseData.photos.length} photo${caseData.photos.length === 1 ? "" : "s"} uploaded`,
      detail: caseData.photos.map((photo) => `${clean(photo.label || photo.name) || "Photo"} (${clean(photo.type) || "other"})`).join(" | "),
    });
  }
  for (const round of caseData.reviewRounds ?? []) {
    items.push({
      type: "ai_review",
      at: clean(round.sentAt),
      summary: `AI review round ${round.round || ""}`.trim(),
      decision: clean(round.aiDecision),
      customerMessage: clean(round.customerMessage),
      blockers: splitLines(round.outstandingBlockers),
    });
  }
  for (const reply of caseData.customerReplies ?? []) {
    items.push({
      type: "customer_reply",
      at: clean(reply.receivedAt),
      summary: "Customer reply added",
      detail: clean(reply.text),
      photoIds: Array.isArray(reply.photoIds) ? reply.photoIds : [],
    });
  }
  if (clean(caseData.notes) || ["ready", "complete"].includes(caseData.status)) {
    items.push({
      type: "handover_ready",
      at: caseData.updatedAt || "",
      summary: caseData.status === "complete" ? "Handover complete" : "Handover ready",
    });
  }
  return items;
}

export function migrateCaseToCurrent(caseData) {
  if (!caseData || typeof caseData !== "object") return createEmptyCase();
  if (caseData.schemaVersion === SCHEMA_VERSION) {
    return normalizeCurrentCase(caseData);
  }

  const migrated = normalizeCurrentCase({
    ...createEmptyCase(),
    ...caseData,
    schemaVersion: SCHEMA_VERSION,
    status: mapLegacyStatus(caseData.status),
    caseDetails: {
      quotedPackage: caseData.caseDetails?.quotedPackage || caseData.quotedPackage || "",
      indoorUnitCount: Number(caseData.caseDetails?.indoorUnitCount || caseData.rooms?.length || 1),
      planningStatus: caseData.caseDetails?.planningStatus || caseData.planningDate || "",
      installDate: caseData.caseDetails?.installDate || caseData.installDate || "",
    },
    evidenceStates: migrateEvidenceStates(caseData),
    answers: caseData.answers ?? {},
    indoorUnits: migrateIndoorUnits(caseData),
    outdoorUnit: migrateOutdoorUnit(caseData),
    electrical: {
      spareWay: caseData.electrical?.spareWay || (caseData.checklist?.spareFuseChecked ? "Checked" : ""),
      visibleEarth: caseData.electrical?.visibleEarth || (caseData.checklist?.visibleEarthChecked ? "Checked" : ""),
      notes: caseData.electrical?.notes || "",
    },
    timeline: Array.isArray(caseData.timeline) && caseData.timeline.length ? caseData.timeline : buildCaseTimeline(caseData),
    generatedOutputs: caseData.generatedOutputs ?? {},
    aiReview: {
      suggestions: caseData.aiReview?.suggestions ?? [],
    },
    legacy: {
      schemaVersion: caseData.schemaVersion ?? 1,
      status: caseData.status ?? "",
      nextAction: caseData.nextAction ?? "",
      originalWorkflowShape: "round_trip_v1",
    },
  });
  migrated.completionStatus = calculateCompletionStatus(migrated);
  migrated.status = migrated.completionStatus.status;
  return migrated;
}

export function evaluateQuestions(caseData) {
  const current = normalizeCurrentCase(caseData);
  const evaluated = [];

  for (const definition of QUESTION_DEFINITIONS) {
    if (definition.scope === "indoorUnit") {
      const units = current.indoorUnits?.length ? current.indoorUnits : migrateIndoorUnits(current);
      for (const [index, unit] of units.entries()) {
        const scoped = {
          ...definition,
          key: `${definition.id}:${unit.id || index}`,
          scopeId: unit.id || String(index),
          scopeIndex: index,
          internalLabel: `${definition.internalLabel} - ${unit.room || unit.roomName || `Indoor unit ${index + 1}`}`,
        };
        evaluated.push(evaluateQuestion(scoped, current, unit));
      }
      continue;
    }
    evaluated.push(evaluateQuestion({ ...definition, key: definition.id }, current));
  }

  return evaluated.filter((question) => question.relevant);
}

export function outstandingItems(caseData) {
  const questions = evaluateQuestions(caseData).filter((question) => !question.complete);
  const groups = {
    customerQuestions: [],
    customerPhotosRequired: [],
    internalTechnicalClarification: [],
    bgAdminIssue: [],
    surveyorReview: [],
    complete: [],
  };

  for (const question of questions) {
    if (question.resolverType === "customer") groups.customerQuestions.push(question);
    else if (question.resolverType === "customer_photo") groups.customerPhotosRequired.push(question);
    else if (question.resolverType === "internal") groups.internalTechnicalClarification.push(question);
    else if (question.resolverType === "admin") groups.bgAdminIssue.push(question);
    else if (question.resolverType === "surveyor") groups.surveyorReview.push(question);
  }

  if (!questions.length) {
    groups.complete.push({
      id: "complete",
      internalLabel: "Ready for Salesforce handover",
      resolverType: "complete",
    });
  }

  return groups;
}

export function calculateCompletionStatus(caseData) {
  const current = normalizeCurrentCase(caseData);
  const groups = outstandingItems(current);
  const customerCount = groups.customerQuestions.length + groups.customerPhotosRequired.length;
  const internalCount = groups.internalTechnicalClarification.length + groups.bgAdminIssue.length + groups.surveyorReview.length;
  const hasIntake = Boolean(clean(current.leadNumber) || clean(current.customerName) || clean(current.sourceDetails));

  if (current.status === "completed") {
    return { status: "completed", nextAction: "Case completed", readyForHandover: true };
  }
  if (!hasIntake) {
    return { status: "not_started", nextAction: "Paste Salesforce text or enter case details", readyForHandover: false };
  }
  if (customerCount > 0) {
    return {
      status: "customer_contact_required",
      nextAction: groups.customerPhotosRequired.length ? "Request missing customer photos" : "Ask customer outstanding questions",
      readyForHandover: false,
    };
  }
  if (internalCount > 0) {
    return {
      status: "internal_clarification_required",
      nextAction: groups.bgAdminIssue.length ? "Resolve BG/admin items" : "Resolve internal technical clarification",
      readyForHandover: false,
    };
  }
  return { status: "ready_for_handover", nextAction: "Copy Salesforce handover note", readyForHandover: true };
}

export function generateGuidedCustomerMessage(caseData) {
  const current = normalizeCurrentCase(caseData);
  const groups = outstandingItems(current);
  const customerQuestions = [...groups.customerQuestions, ...groups.customerPhotosRequired]
    .map((question) => question.customerQuestion)
    .filter(Boolean);
  const uniqueQuestions = [...new Set(customerQuestions)];
  const greeting = clean(current.customerName) ? `Hi ${firstName(current.customerName)},` : "Hi,";

  if (!uniqueQuestions.length) {
    return [greeting, "", "Thanks, we have the triage information we need from you at the moment."].join("\n");
  }

  return [
    greeting,
    "",
    "We are checking the air con installation details and need the following from you:",
    "",
    ...uniqueQuestions.map((question) => `- ${question}`),
    "",
    "Thanks",
  ].join("\n");
}

export function generateSalesforceHandover(caseData) {
  const current = normalizeCurrentCase(caseData);
  const sections = [];
  pushLineSection(sections, "Lead", [lineValue("Lead", current.leadNumber)]);
  pushLineSection(sections, "Customer", [
    lineValue("Customer", current.customerName),
    lineValue("Phone", current.contactNumber),
    lineValue("Email", current.customerEmail),
  ]);
  pushLineSection(sections, "Property", [lineValue("Property", current.address), lineValue("Property type", current.propertyType)]);
  pushLineSection(sections, "Quoted system", [lineValue("Quoted system", current.caseDetails?.quotedPackage || current.quotedPackage)]);

  const indoorBlocks = (current.indoorUnits ?? []).map((unit, index) => compactLines([
    lineValue("room", unit.room || unit.roomName || `Indoor unit ${index + 1}`),
    lineValue("agreed location", unit.agreedLocation || unit.internalLocation),
    lineValue("wall/construction", unit.wallConstruction),
    lineValue("pipe route", unit.pipeRoute || unit.pipeRun),
    lineValue("nearest socket", unit.nearestSocket || unit.plugLocation),
    lineValue("relevant access details", unit.accessDetails),
  ])).filter(Boolean);
  if (indoorBlocks.length) sections.push(`Indoor units:\n${indoorBlocks.map((block) => `- ${block.replace(/\n/g, "\n  ")}`).join("\n")}`);

  pushLineSection(sections, "Outdoor unit", [
    lineValue("position", current.outdoorUnit?.location || current.outsideUnit?.location),
    lineValue("mounting", current.outdoorUnit?.mounting || current.outsideUnit?.mounting),
    lineValue("route", current.outdoorUnit?.route),
    lineValue("clearances/access", [current.outdoorUnit?.clearances || current.outsideUnit?.clearances, current.outdoorUnit?.access || current.outsideUnit?.ladderAccess].filter(Boolean).join("; ")),
    lineValue("condensate", current.outdoorUnit?.condensateRoute),
  ]);
  pushLineSection(sections, "Electrical", [
    lineValue("consumer-unit evidence", evidenceLabel(current, "consumer_unit_photo")),
    lineValue("spare way", current.electrical?.spareWay),
    lineValue("visible earth", current.electrical?.visibleEarth),
    lineValue("relevant socket/location evidence", socketSummary(current)),
  ]);
  pushLineSection(sections, "Customer preferences", [lineValue("Customer preferences", preferencesSummary(current))]);
  pushLineSection(sections, "Planning", [lineValue("Planning", current.caseDetails?.planningStatus || current.planningDate)]);
  pushLineSection(sections, "Install date", [lineValue("Install date", current.caseDetails?.installDate || current.installDate)]);

  const unresolved = Object.values(outstandingItems(current))
    .flat()
    .filter((item) => item.id !== "complete")
    .map((item) => item.internalLabel);
  pushLineSection(sections, "Outstanding items", unresolved.map((item) => `- ${item}`));

  return sections.join("\n\n");
}

export function generateManagerCompletionMessage(caseData) {
  const current = normalizeCurrentCase(caseData);
  const lead = clean(current.leadNumber) || "case";
  return `Lead ${lead} triage completed and updated in Salesforce.`;
}

export function generateOutputs(caseData) {
  return {
    salesforceHandover: generateSalesforceHandover(caseData),
    customerFollowUp: generateGuidedCustomerMessage(caseData),
    internalQuestions: formatInternalQuestions(caseData),
    managerCompletion: generateManagerCompletionMessage(caseData),
  };
}

export function exportPortableCase(caseData, options = {}) {
  const current = migrateCaseToCurrent(caseData);
  const includeImages = Boolean(options.includeImages);
  const outputs = generateOutputs(current);
  return {
    schema: "bg.ac_triage.case.v2",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    caseDetails: current.caseDetails,
    lead: {
      id: current.id,
      leadNumber: current.leadNumber,
      customerName: current.customerName,
      address: current.address,
      contactNumber: current.contactNumber,
      customerEmail: current.customerEmail,
      sourceDetails: current.sourceDetails,
      propertyType: current.propertyType,
    },
    answers: current.answers ?? {},
    evidenceStates: current.evidenceStates ?? createDefaultEvidenceStates(),
    indoorUnits: current.indoorUnits ?? [],
    outdoorUnit: current.outdoorUnit ?? createEmptyOutdoorUnit(),
    electrical: current.electrical ?? {},
    customerReplies: current.customerReplies ?? [],
    timeline: current.timeline?.length ? current.timeline : buildCaseTimeline(current),
    generatedOutputs: outputs,
    timestamps: {
      createdAt: current.createdAt,
      updatedAt: current.updatedAt,
    },
    completionStatus: calculateCompletionStatus(current),
    photoMetadata: (current.photos ?? []).map((photo) => ({
      id: photo.id,
      name: photo.name,
      label: photo.label,
      type: photo.type,
      notes: photo.notes,
      requestedAnnotation: photo.requestedAnnotation,
      hasOriginal: Boolean(photo.dataUrl),
      hasAnnotated: Boolean(photo.annotatedDataUrl),
      marks: photo.marks ?? [],
      ...(includeImages ? {
        dataUrl: photo.dataUrl || "",
        thumbDataUrl: photo.thumbDataUrl || "",
        annotatedDataUrl: photo.annotatedDataUrl || "",
        annotatedThumbDataUrl: photo.annotatedThumbDataUrl || "",
      } : {}),
    })),
    status: current.status,
    legacy: current.legacy,
  };
}

export function importPortableCase(portable) {
  if (!portable || typeof portable !== "object") {
    throw new Error("Import file is not a valid case JSON object");
  }
  if (portable.schema === "bg.ac_triage.case.v2" || portable.schemaVersion === SCHEMA_VERSION) {
    const lead = portable.lead ?? {};
    return migrateCaseToCurrent({
      id: lead.id || cryptoRandomId(),
      schemaVersion: SCHEMA_VERSION,
      createdAt: portable.timestamps?.createdAt || new Date().toISOString(),
      updatedAt: portable.timestamps?.updatedAt || new Date().toISOString(),
      leadNumber: lead.leadNumber || "",
      customerName: lead.customerName || "",
      address: lead.address || "",
      contactNumber: lead.contactNumber || "",
      customerEmail: lead.customerEmail || "",
      sourceDetails: lead.sourceDetails || "",
      propertyType: lead.propertyType || "",
      caseDetails: portable.caseDetails ?? {},
      answers: portable.answers ?? {},
      evidenceStates: portable.evidenceStates ?? {},
      indoorUnits: portable.indoorUnits ?? [],
      outdoorUnit: portable.outdoorUnit ?? {},
      electrical: portable.electrical ?? {},
      customerReplies: portable.customerReplies ?? [],
      timeline: portable.timeline ?? [],
      generatedOutputs: portable.generatedOutputs ?? {},
      photos: (portable.photoMetadata ?? []).map((photo) => ({ ...photo })),
      status: portable.status,
      legacy: portable.legacy,
    });
  }
  if (portable.schema === "bg.ac_triage.review_pack.v1" || portable.lead || portable.rooms || portable.outsideUnit) {
    return migrateCaseToCurrent(importLegacyReviewPack(portable));
  }
  return migrateCaseToCurrent(portable);
}

export function caseExportFileName(caseData, extension = "json") {
  const current = normalizeCurrentCase(caseData);
  const lead = safeNamePart(current.leadNumber || "case");
  const surname = safeNamePart(clean(current.customerName).split(/\s+/).at(-1) || "customer");
  return `AC-${lead}-${surname}-triage.${extension}`;
}

export function prepareAiSuggestions(caseData, aiResult) {
  const current = normalizeCurrentCase(caseData);
  const suggestions = [];
  collectSuggestion(suggestions, current, "leadNumber", aiResult?.lead?.leadNumber);
  collectSuggestion(suggestions, current, "customerName", aiResult?.lead?.customerName);
  collectSuggestion(suggestions, current, "address", aiResult?.lead?.address);
  collectSuggestion(suggestions, current, "contactNumber", aiResult?.lead?.contactNumber);
  collectSuggestion(suggestions, current, "customerEmail", aiResult?.lead?.customerEmail);
  collectSuggestion(suggestions, current, "propertyType", aiResult?.lead?.propertyType);
  collectSuggestion(suggestions, current, "caseDetails.installDate", aiResult?.lead?.installDate);
  return suggestions;
}

export function generateAiReviewPackJson(caseData, options = {}) {
  return JSON.stringify(generateAiReviewPack(caseData, options), null, 2);
}

export function generateAiReviewPrompt() {
  return [
    "Act as an air-con triage reviewer for a JSON round-trip workflow.",
    "",
    "Review the JSON review pack and any separately uploaded photos. Return JSON only. Do not return prose outside JSON.",
    "This pasted JSON is the review pack. Do not ask for the JSON review pack again.",
    "The pastedJobDetails field may be copied from a Classic Salesforce CHI Lead page. Useful sections include CHI Lead Details, Contact Information, Payment Information, Portal Details, Source Information, System Information, Photos, Appointments, Notes & Attachments, Jobs, BigMachines Quotes, Finance Applications, Activity History, and CHI Lead Field History.",
    "Extract factual values from those sections where present, especially lead number, customer name, address, phone/email, lead status, job status, portal/photo status, quote/package rows, appointment/install dates, notes/activity, and field-history status changes.",
    "Use the timeline array to understand previous AI reviews, customer replies, uploaded photos, and whether the case is waiting, ready, or complete.",
    "",
    "Required response schema:",
    JSON.stringify({
      schema: "bg.ac_triage.ai_result.v1",
      decision: "ready | missing_info",
      status: "awaiting_customer | ready | complete | ai_review_needed",
      nextAction: "send_customer_message | wait_for_reply | review_again | copy_handover_to_salesforce",
      lead: {
        leadNumber: "",
        customerName: "",
        address: "",
        contactNumber: "",
        customerEmail: "",
        propertyType: "",
        installDate: "",
        planningDate: "",
      },
      rooms: [{
        roomName: "",
        roomSizeM2: "",
        suggestedUnitSize: "SMALL | MED | LARGE",
        internalLocation: "",
        pipeRun: "",
        trunkingColour: "white | black | other",
        plugLocation: "",
        electricalSupplyNotes: "",
        wifiDongleRequired: true,
      }],
      outsideUnit: {
        location: "",
        mounting: "",
        clearances: "",
        ladderAccess: "",
        notes: "",
      },
      missingBlockers: ["Only blockers that stop handover"],
      internalIssues: ["BG/admin tasks not for the customer"],
      customerMessage: "Short SMS/email text asking only customer-solvable questions",
      handoverNotes: "Salesforce-ready notes when decision is ready, otherwise empty",
      photoAnnotations: [{
        photoId: "photo id from manifest",
        annotations: [
          {
            type: "line",
            label: "Pipe route",
            colour: "#ffcf33",
            points: [{ x: 0.1, y: 0.2 }, { x: 0.4, y: 0.5 }],
          },
          {
            type: "box",
            label: "Indoor unit",
            colour: "#35d07f",
            rect: { x: 0.2, y: 0.2, width: 0.3, height: 0.1 },
          },
          {
            type: "label",
            label: "Core hole",
            colour: "#153047",
            point: { x: 0.5, y: 0.5 },
          },
        ],
        instructions: "Use this only if exact coordinates cannot be provided",
      }],
    }, null, 2),
    "",
    "Rules:",
    "- Do not invent missing information.",
    "- Keep output short and factual.",
    "- If not ready, prioritise blockers over general observations.",
    "- Customer questions must be plain English, suitable for SMS/email, and only ask for information or photos the customer can provide.",
    "- Tailor customer photo requests to the missing evidence. For example, if outdoor location photos are missing, ask specifically for clear photos of the proposed outdoor unit location and surrounding space.",
    "- Use normalised photo coordinates from 0 to 1 for photoAnnotations so the app can mark images automatically.",
    "- If exact photo coordinates are not possible, put clear text in photoAnnotations[].instructions and leave annotations empty.",
    "- Include previous AI decision and customer replies from the review pack when deciding the next action.",
  ].join("\n");
}

export function sampleCase() {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "BG-AC-1042";
  triageCase.customerName = "Sample Customer";
  triageCase.address = "12 Example Road, Bristol";
  triageCase.contactNumber = "07123 456789";
  triageCase.customerEmail = "sample@example.com";
  triageCase.propertyType = "Semi-detached house";
  triageCase.jobStage = "Needs customer call";
  triageCase.installDate = "To confirm";
  triageCase.planningDate = "To confirm";
  triageCase.checklist.salesforceLeadChecked = true;
  triageCase.checklist.customerPhotosPresent = true;
  triageCase.checklist.internalUnitLocationChecked = true;
  triageCase.outsideUnit = {
    location: "",
    mounting: "Wall bracket or floor mount to confirm",
    clearances: "",
    ladderAccess: "",
    notes: "Confirm final outdoor unit position with customer",
  };
  triageCase.rooms[0] = {
    ...triageCase.rooms[0],
    roomName: "Bedroom",
    roomSize: "18",
    suggestedUnitSize: "MED",
    internalLocation: "Above wardrobe on outside wall",
    pipeRun: "Straight out through wall, then down to condenser",
    trunkingColour: "White",
    plugLocation: "",
    electricalSupplyNotes: "Fuse board photo needed",
    wifiDongleRequired: true,
  };
  return triageCase;
}

function questionDefinition(definition) {
  return {
    rationaleConfidence: "confirmed",
    requiredWhen: [],
    completeWhen: [],
    completeMode: "all",
    scope: "case",
    ...definition,
  };
}

function createDefaultEvidenceStates() {
  return Object.fromEntries(EVIDENCE_ITEMS.map((item) => [item.id, {
    state: "missing",
    notes: "",
    updatedAt: "",
  }]));
}

function normalizeCurrentCase(caseData) {
  const base = {
    ...createEmptyCase(),
    ...caseData,
    schemaVersion: SCHEMA_VERSION,
  };
  base.caseDetails = {
    quotedPackage: "",
    indoorUnitCount: Math.max(1, Number(base.rooms?.length || 1)),
    planningStatus: "",
    installDate: "",
    ...(base.caseDetails ?? {}),
  };
  base.evidenceStates = {
    ...createDefaultEvidenceStates(),
    ...(base.evidenceStates ?? {}),
  };
  base.answers = base.answers ?? {};
  base.indoorUnits = Array.isArray(base.indoorUnits) && base.indoorUnits.length ? base.indoorUnits : migrateIndoorUnits(base);
  base.outdoorUnit = { ...createEmptyOutdoorUnit(), ...(base.outdoorUnit ?? migrateOutdoorUnit(base)) };
  base.electrical = { spareWay: "", visibleEarth: "", notes: "", ...(base.electrical ?? {}) };
  base.photos = Array.isArray(base.photos) ? base.photos : [];
  base.reviewRounds = Array.isArray(base.reviewRounds) ? base.reviewRounds : [];
  base.customerReplies = Array.isArray(base.customerReplies) ? base.customerReplies : [];
  base.timeline = Array.isArray(base.timeline) ? base.timeline : [];
  base.aiReview = { suggestions: [], ...(base.aiReview ?? {}) };
  base.generatedOutputs = base.generatedOutputs ?? {};
  return base;
}

function migrateIndoorUnits(caseData) {
  const rooms = Array.isArray(caseData.rooms) && caseData.rooms.length ? caseData.rooms : [createEmptyRoom()];
  return rooms.map((room) => ({
    ...createEmptyIndoorUnit(),
    id: room.id || cryptoRandomId(),
    room: room.roomName || room.room || "",
    roomSize: room.roomSize || "",
    agreedLocation: room.internalLocation || room.agreedLocation || "",
    pipeRoute: room.pipeRun || room.pipeRoute || "",
    trunkingColour: room.trunkingColour || "White",
    trunkingOther: room.trunkingOther || "",
    nearestSocket: room.plugLocation || room.nearestSocket || "",
    notes: room.electricalSupplyNotes || room.notes || "",
  }));
}

function migrateOutdoorUnit(caseData) {
  const outside = caseData.outsideUnit ?? {};
  return {
    ...createEmptyOutdoorUnit(),
    ...(caseData.outdoorUnit ?? {}),
    location: caseData.outdoorUnit?.location || outside.location || "",
    mounting: caseData.outdoorUnit?.mounting || outside.mounting || "",
    clearances: caseData.outdoorUnit?.clearances || outside.clearances || "",
    access: caseData.outdoorUnit?.access || outside.ladderAccess || "",
    notes: caseData.outdoorUnit?.notes || outside.notes || "",
  };
}

function migrateEvidenceStates(caseData) {
  const states = createDefaultEvidenceStates();
  const checklist = caseData.checklist ?? {};
  setEvidenceState(states, "lead_customer_details", clean(caseData.leadNumber) || clean(caseData.customerName) ? "confirmed" : "missing");
  setEvidenceState(states, "quote_package", clean(caseData.quotedPackage || caseData.caseDetails?.quotedPackage) || checklist.quoteChecked ? "confirmed" : "missing");
  setEvidenceState(states, "indoor_unit_locations", checklist.internalUnitLocationChecked || caseData.rooms?.some((room) => clean(room.internalLocation)) ? "confirmed" : "missing");
  setEvidenceState(states, "indoor_unit_wall_photos", checklist.internalUnitLocationChecked || hasPhotoType(caseData, "indoor_location") ? "confirmed" : "missing");
  setEvidenceState(states, "outdoor_unit_location", checklist.externalUnitLocationChecked || clean(caseData.outsideUnit?.location) ? "confirmed" : "missing");
  setEvidenceState(states, "outdoor_unit_photos", checklist.externalUnitLocationChecked || hasPhotoType(caseData, "outdoor_location") ? "confirmed" : "missing");
  setEvidenceState(states, "pipe_route", checklist.pipeworkChecked || caseData.rooms?.some((room) => clean(room.pipeRun)) ? "confirmed" : "missing");
  setEvidenceState(states, "consumer_unit_photo", checklist.fuseBoardPhoto || hasPhotoType(caseData, "fuse_board") ? "confirmed" : "missing");
  setEvidenceState(states, "electrical_evidence", checklist.visibleEarthChecked || checklist.spareFuseChecked ? "confirmed" : "missing");
  setEvidenceState(states, "nearest_internal_socket", caseData.rooms?.some((room) => clean(room.plugLocation)) ? "confirmed" : "missing");
  setEvidenceState(states, "access_ladder_requirements", clean(caseData.outsideUnit?.ladderAccess) || checklist.ladderAccessChecked ? "confirmed" : "missing");
  setEvidenceState(states, "planning_status", clean(caseData.planningDate) || checklist.planningDateConfirmed ? "confirmed" : "missing");
  setEvidenceState(states, "install_date", clean(caseData.installDate) || checklist.installDateChecked ? "confirmed" : "missing");
  return { ...states, ...(caseData.evidenceStates ?? {}) };
}

function setEvidenceState(states, id, state) {
  if (!states[id]) return;
  states[id] = { ...states[id], state, updatedAt: states[id].updatedAt || "" };
}

function mapLegacyStatus(status) {
  return ({
    draft: "evidence_review",
    ai_review_needed: "evidence_review",
    awaiting_customer: "awaiting_customer",
    ready: "ready_for_handover",
    complete: "completed",
  })[status] || (CASE_STATUSES.includes(status) ? status : "not_started");
}

function evaluateQuestion(definition, caseData, scopeData = caseData) {
  const relevant = definition.requiredWhen.length
    ? conditionsPass(definition.requiredWhen, caseData, scopeData, "all")
    : true;
  const answerState = caseData.answers?.[definition.key]?.state;
  const answeredComplete = ["confirmed", "not_applicable"].includes(answerState);
  const complete = relevant && answeredComplete
    ? true
    : relevant
    ? conditionsPass(definition.completeWhen, caseData, scopeData, definition.completeMode)
    : false;
  return {
    ...definition,
    relevant,
    complete,
  };
}

function conditionsPass(conditions, caseData, scopeData, mode = "all") {
  if (!conditions.length) return true;
  const results = conditions.map((condition) => conditionPass(condition, caseData, scopeData));
  return mode === "any" ? results.some(Boolean) : results.every(Boolean);
}

function conditionPass(condition, caseData, scopeData) {
  if (condition.evidence) {
    const state = caseData.evidenceStates?.[condition.evidence]?.state;
    return condition.stateIn?.includes(state);
  }
  const value = valueAt(scopeData, condition.field);
  const legacyValue = condition.legacyField ? valueAt(caseData, condition.legacyField) || valueAt(scopeData, condition.legacyField) : "";
  const present = Boolean(clean(value) || clean(legacyValue));
  if (condition.op === "present") return present;
  if (condition.op === "missing") return !present;
  if (condition.equals !== undefined) return value === condition.equals;
  return false;
}

function valueAt(object, path) {
  if (!path) return "";
  return path.split(".").reduce((current, key) => current?.[key], object);
}

function pushLineSection(sections, title, lines) {
  const body = compactLines(lines);
  if (body) sections.push(`${title}:\n${body}`);
}

function compactLines(lines) {
  return lines.filter((line) => clean(line)).join("\n");
}

function lineValue(label, value) {
  const text = clean(value);
  return text ? `${label}: ${text}` : "";
}

function evidenceLabel(caseData, id) {
  const state = caseData.evidenceStates?.[id]?.state;
  if (!state || state === "missing") return "";
  return state.replace(/_/g, " ");
}

function socketSummary(caseData) {
  return (caseData.indoorUnits ?? [])
    .map((unit) => {
      const socket = clean(unit.nearestSocket || unit.plugLocation);
      if (!socket) return "";
      return [unit.room, socket].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join("; ");
}

function preferencesSummary(caseData) {
  return (caseData.indoorUnits ?? [])
    .map((unit) => {
      const colour = clean(unit.trunkingColour === "Other" ? unit.trunkingOther : unit.trunkingColour);
      if (!colour) return "";
      return [unit.room, colour].filter(Boolean).join(": trunking ");
    })
    .filter(Boolean)
    .join("; ");
}

function formatInternalQuestions(caseData) {
  const groups = outstandingItems(caseData);
  return [
    ...groups.internalTechnicalClarification,
    ...groups.bgAdminIssue,
    ...groups.surveyorReview,
  ].map((question) => `- ${question.internalLabel}: ${question.why}`).join("\n");
}

function importLegacyReviewPack(pack) {
  return {
    ...createEmptyCase(),
    leadNumber: pack.lead?.leadNumber || "",
    customerName: pack.lead?.customerName || "",
    address: pack.lead?.address || "",
    contactNumber: pack.lead?.contactNumber || "",
    customerEmail: pack.lead?.customerEmail || "",
    sourceDetails: pack.lead?.pastedJobDetails || "",
    propertyType: pack.lead?.propertyType || "",
    installDate: pack.lead?.installDate || "",
    planningDate: pack.lead?.planningDate || "",
    rooms: (pack.rooms ?? []).map((room) => ({
      ...createEmptyRoom(),
      roomName: room.roomName || "",
      roomSize: room.roomSizeM2 || "",
      suggestedUnitSize: room.suggestedUnitSize || "",
      internalLocation: room.internalLocation || "",
      pipeRun: room.pipeRun || "",
      trunkingColour: room.trunkingColour || "White",
      plugLocation: room.plugLocation || "",
      electricalSupplyNotes: room.electricalSupplyNotes || "",
      wifiDongleRequired: Boolean(room.wifiDongleRequired),
    })),
    outsideUnit: pack.outsideUnit ?? createEmptyOutsideUnit(),
    photos: (pack.photoManifest ?? []).map((photo) => ({
      id: photo.id || cryptoRandomId(),
      name: photo.fileName || "",
      label: photo.label || "",
      type: photo.type || "other",
      notes: photo.notes || "",
      requestedAnnotation: photo.requestedAnnotation || "",
      marks: [],
    })),
    customerReplies: pack.customerReplies ?? [],
  };
}

function collectSuggestion(suggestions, caseData, path, proposedValue) {
  const value = clean(proposedValue);
  if (!value) return;
  const current = clean(valueAt(caseData, path));
  if (current && current !== value) {
    suggestions.push({
      id: cryptoRandomId(),
      path,
      currentValue: current,
      proposedValue: value,
      status: "pending",
      requiresAcceptance: true,
    });
  }
}

function safeNamePart(value) {
  return clean(value).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "case";
}

function hasPhotoType(caseData, type) {
  return Boolean(caseData.photos?.some((photo) => photo.type === type));
}

function clean(value) {
  return String(value ?? "").trim();
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }
  return "";
}

function cleanName(value) {
  return clean(value)
    .replace(/^(Mr|Mrs|Miss|Ms|Dr)\.?\s+/i, "")
    .replace(/\s+(Owner|Customer|Tenant|Contact)$/i, "")
    .trim();
}

function normalisePhone(value) {
  const phone = clean(value).replace(/[^\d+]/g, "");
  if (!phone) return "";
  if (phone.startsWith("+44")) return `0${phone.slice(3)}`;
  if (phone.startsWith("44")) return `0${phone.slice(2)}`;
  return phone;
}

function valueAfterLabel(lines, labels) {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const label of labels) {
      const pattern = new RegExp(`^${escapeRegExp(label)}(?:\\s*[:#-])?\\s*(.*)$`, "i");
      const match = line.match(pattern);
      if (!match) continue;
      const inline = clean(match[1]);
      if (inline && !looksLikeFieldLabel(inline)) return inline;
      const next = clean(lines[index + 1]);
      if (next && !looksLikeFieldLabel(next)) return next;
    }
  }
  return "";
}

function valueAfterExactLabel(lines, label) {
  for (let index = 0; index < lines.length; index += 1) {
    if (clean(lines[index]).toLowerCase() !== label.toLowerCase()) continue;
    const next = clean(lines[index + 1]);
    if (next && !looksLikeFieldLabel(next)) return next;
  }
  return "";
}

function extractAddress(lines, postcode) {
  const structured = structuredInstallAddress(lines);
  if (structured) return structured;

  const block = addressBlockAfterLabel(lines, ["Customer Address", "Installation Address", "Install Address", "Site Address", "Address"]);
  if (block) return block;

  const labelled = firstMatch(lines.join("\n"), [
    /(?:Customer Address|Installation Address|Install Address|Site Address|Address)\s+(.+)/i,
  ]);
  if (labelled && !looksLikeNameOrEmail(labelled)) return labelled;

  if (!postcode) return "";
  const postcodeLine = lines.find((line) => line.toUpperCase().includes(postcode));
  if (!postcodeLine) return postcode;

  const cleaned = postcodeLine
    .replace(/^Customer Address\s+/i, "")
    .replace(/^Address\s+/i, "")
    .trim();
  return cleaned || postcode;
}

function structuredInstallAddress(lines) {
  const street = valueAfterLabel(lines, ["Install Address Street", "Address Street", "Street"]);
  const city = valueAfterLabel(lines, ["Install Address City", "Address City", "City"]);
  const postcode = valueAfterLabel(lines, ["Install Postcode", "Postcode", "Zip"]);
  return [street, city, postcode].map(clean).filter(Boolean).join(", ");
}

function extractQuoteProducts(lines) {
  const products = lines
    .map((line) => line.match(/^Edit\s+\S+\s+(.+?)\s+\D?[\d,]+\.\d{2}\s+\D?[\d,]+\.\d{2}\s+\D?[\d,]+\.\d{2}\s+(\d+)\b/i))
    .filter(Boolean)
    .map((match) => ({
      description: clean(match[1]),
      quantity: Number.parseInt(match[2], 10) || 0,
    }))
    .filter((item) => item.description && item.quantity > 0);

  const indoorUnitCount = products
    .filter((item) => /indoor\s+ac\s+unit/i.test(item.description))
    .reduce((sum, item) => sum + item.quantity, 0);
  const quotedPackage = products
    .map((item) => `${item.description} x${item.quantity}`)
    .join("\n");

  return {
    quotedPackage,
    indoorUnitCount: indoorUnitCount || "",
  };
}

function extractJobElements(lines) {
  const counts = new Map();
  for (const line of lines) {
    const match = line.match(/^Edit\s+JE-\d+\s+(.+?)\s+(?:C[A-Z0-9]+|P\d+)\s+Work\b/i);
    if (!match) continue;
    const description = clean(match[1]);
    if (!description) continue;
    counts.set(description, (counts.get(description) || 0) + 1);
  }

  const products = [...counts.entries()].map(([description, quantity]) => ({ description, quantity }));
  const indoorUnitCount = products
    .filter((item) => /indoor\s+unit/i.test(item.description))
    .reduce((sum, item) => sum + item.quantity, 0);
  const quotedPackage = products
    .map((item) => `${item.description} x${item.quantity}`)
    .join("\n");

  return {
    quotedPackage,
    indoorUnitCount: indoorUnitCount || "",
  };
}

function addressBlockAfterLabel(lines, labels) {
  for (let index = 0; index < lines.length; index += 1) {
    for (const label of labels) {
      const pattern = new RegExp(`^${escapeRegExp(label)}(?:\\s*[:#-])?\\s*(.*)$`, "i");
      const match = lines[index].match(pattern);
      if (!match) continue;
      const parts = [];
      const inline = clean(match[1]);
      if (inline && !looksLikeFieldLabel(inline)) parts.push(inline);
      for (let nextIndex = index + 1; nextIndex < Math.min(lines.length, index + 5); nextIndex += 1) {
        const next = clean(lines[nextIndex]);
        if (!next || looksLikeFieldLabel(next)) break;
        parts.push(next);
      }
      const value = parts.join(", ");
      if (value && !looksLikeNameOrEmail(value)) return value;
    }
  }
  return "";
}

function looksLikeNameOrEmail(value) {
  return /@/.test(value) || /^(Mr|Mrs|Miss|Ms|Dr)\.?\s+/i.test(value);
}

function looksLikeFieldLabel(value) {
  return /^(CHI Lead|CHI Lead Num|Customer Name|Contact Name|Customer Address|Installation Address|Install Address|Site Address|Mobile Phone|Home Phone|Work Phone|Phone|Customer Mobile Phone|Customer Email Address|Customer Email|Email|Status|Sub Status|Stage|Owner|Created|Updated|Lead Source|Quote|Payment Method|District|Region|HSA Name|CDM Name)\b/i.test(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeEmpty(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => clean(value)));
}

function firstName(name) {
  return name.split(/\s+/)[0] || name;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function checkSummary(caseData, ids) {
  const done = ids.filter((id) => caseData.checklist?.[id]).length;
  return `${done}/${ids.length} checked`;
}

function formatDimensionRow(item) {
  return `${item.output}: H ${item.height}mm, W ${item.width}mm, D ${item.depth}mm, ${item.weight}kg`;
}

function splitLines(value) {
  return clean(value).split(/\n+/).map((item) => item.trim()).filter(Boolean);
}

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
