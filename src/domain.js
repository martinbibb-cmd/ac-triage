export const JOB_STAGES = [
  "Not checked",
  "Photos missing",
  "Needs customer call",
  "Ready for install date",
  "Complete",
];

export const TRUNKING_COLOURS = ["White", "Black", "Other"];

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

export function createEmptyCase() {
  const checklist = Object.fromEntries(CHECKLIST.map((item) => [item.id, false]));
  return {
    id: cryptoRandomId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    leadNumber: "",
    customerName: "",
    address: "",
    contactNumber: "",
    propertyType: "",
    jobStage: JOB_STAGES[0],
    installDate: "",
    planningDate: "",
    checklist,
    outsideUnit: createEmptyOutsideUnit(),
    rooms: [createEmptyRoom()],
    photos: [],
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

export function generateMissingQuestions(caseData) {
  const questions = [];
  const outsideUnit = caseData.outsideUnit ?? createEmptyOutsideUnit();

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
  if (!caseData.checklist?.customerPhotosPresent) {
    questions.push("Can you send clear photos of the proposed indoor and outdoor unit locations?");
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

export function sampleCase() {
  const triageCase = createEmptyCase();
  triageCase.leadNumber = "BG-AC-1042";
  triageCase.customerName = "Sample Customer";
  triageCase.address = "12 Example Road, Bristol";
  triageCase.contactNumber = "07123 456789";
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

function clean(value) {
  return String(value ?? "").trim();
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

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
