export const JOB_STAGES = [
  "Not checked",
  "Photos missing",
  "Needs customer call",
  "Ready for install date",
  "Complete",
];

export const TRUNKING_COLOURS = ["White", "Black", "Other"];

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
    rooms: [createEmptyRoom()],
    photos: [],
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
    externalLocation: "",
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
  for (const room of caseData.rooms ?? []) {
    const roomPrefix = room.roomName ? `${room.roomName}: ` : "";
    if (!room.internalLocation?.trim()) {
      questions.push(`${roomPrefix}Can you confirm where you want the indoor unit?`);
    }
    if (!room.externalLocation?.trim()) {
      questions.push(`${roomPrefix}Can you confirm where the outdoor unit can go?`);
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
  const roomSections = rooms.map((room, index) => {
    const colour = room.trunkingColour === "Other" ? clean(room.trunkingOther) : clean(room.trunkingColour);
    return [
      `ROOM ${index + 1}`,
      `Room name: ${clean(room.roomName)}`,
      `Room size: ${clean(room.roomSize)}${room.roomSize ? "m2" : ""}`,
      `Unit size: ${clean(room.suggestedUnitSize || suggestUnitSize(room.roomSize))}`,
      `Internal location: ${clean(room.internalLocation)}`,
      `External location: ${clean(room.externalLocation)}`,
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
  triageCase.rooms[0] = {
    ...triageCase.rooms[0],
    roomName: "Bedroom",
    roomSize: "18",
    suggestedUnitSize: "MED",
    internalLocation: "Above wardrobe on outside wall",
    externalLocation: "",
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

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
