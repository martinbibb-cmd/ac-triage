import {
  CASE_STATUSES,
  EVIDENCE_ITEMS,
  EVIDENCE_STATES,
  PHOTO_TYPES,
  QUESTION_DEFINITIONS,
  buildCaseTimeline,
  calculateCompletionStatus,
  caseExportFileName,
  createEmptyCase,
  createEmptyIndoorUnit,
  evaluateQuestions,
  exportPortableCase,
  extractSalesforceLeadDetails,
  generateAiReviewPackJson,
  generateAiReviewPrompt,
  generateOutputs,
  importPortableCase,
  migrateCaseToCurrent,
  outstandingItems,
  prepareAiSuggestions,
} from "./domain.js";
import { deleteCase, loadCases, saveCase } from "./storage.js";

const app = document.querySelector("#app");
const PHOTO_MAX_EDGE = 1600;
const THUMB_MAX_EDGE = 420;
const PHOTO_QUALITY = 0.82;
const SCREENS = ["intake", "evidence", "call", "outstanding", "handover", "advanced"];

const state = {
  cases: [],
  selectedId: null,
  screen: "intake",
};

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target || !app.contains(target) || target.matches("input[type='file']")) return;
  event.preventDefault();
  handleAction({ currentTarget: target });
});

init();

async function init() {
  app.innerHTML = `<div class="empty"><h2>Loading cases</h2><p>Checking local storage...</p></div>`;
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
  state.cases = (await loadCases()).map(migrateCaseToCurrent);
  state.selectedId = state.cases[0]?.id ?? null;
  render();
}

function selectedCase() {
  return state.cases.find((item) => item.id === state.selectedId) ?? null;
}

function render() {
  const active = selectedCase();
  app.innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">Local-first guided workflow</p>
        <h1>Air Con Triage</h1>
      </div>
      <div class="top-actions">
        <label class="file-button">
          Import case
          <input type="file" accept="application/json,.json" data-action="import-case">
        </label>
        <button class="primary" data-action="new-case">New Case</button>
      </div>
    </header>
    <section class="layout">
      <aside class="case-list">
        <div class="section-title">Cases</div>
        ${state.cases.map(caseCard).join("") || `<p class="muted">No cases yet.</p>`}
      </aside>
      <section class="workspace">
        ${active ? caseWorkspace(active) : emptyState()}
      </section>
    </section>
  `;
  bindEvents();
}

function caseCard(item) {
  const completion = calculateCompletionStatus(item);
  const selected = item.id === state.selectedId ? "selected" : "";
  return `
    <button class="case-card ${selected}" data-action="select-case" data-id="${item.id}">
      <strong>${escapeHtml(item.leadNumber || "New lead")}</strong>
      <span>${escapeHtml(item.customerName || "No customer name")}</span>
      <small>${escapeHtml(statusLabel(completion.status))}</small>
    </button>
  `;
}

function emptyState() {
  return `
    <div class="empty">
      <h2>Start a triage case</h2>
      <p>Create a case or import a portable triage JSON file.</p>
      <button class="primary" data-action="new-case">New Case</button>
    </div>
  `;
}

function caseWorkspace(active) {
  const completion = calculateCompletionStatus(active);
  active.completionStatus = completion;
  const outputs = generateOutputs(active);
  return `
    <section class="status-strip">
      <div>
        <p class="eyebrow">Current status</p>
        <h2>${escapeHtml(statusLabel(completion.status))}</h2>
      </div>
      <div>
        <p class="eyebrow">Next action</p>
        <h2>${escapeHtml(completion.nextAction)}</h2>
      </div>
      <progress value="${completedQuestionCount(active)}" max="${Math.max(1, evaluateQuestions(active).length)}"></progress>
    </section>
    <nav class="screen-tabs" aria-label="Triage screens">
      ${SCREENS.map((screen) => `
        <button class="${screen === state.screen ? "active" : ""}" data-action="screen" data-screen="${screen}">
          ${escapeHtml(screenLabel(screen))}
        </button>
      `).join("")}
    </nav>
    ${screenView(active, outputs)}
  `;
}

function screenView(active, outputs) {
  if (state.screen === "evidence") return evidenceScreen(active);
  if (state.screen === "call") return callScreen(active);
  if (state.screen === "outstanding") return outstandingScreen(active);
  if (state.screen === "handover") return handoverScreen(active, outputs);
  if (state.screen === "advanced") return advancedScreen(active);
  return intakeScreen(active);
}

function intakeScreen(active) {
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Case intake</p>
          <h2>Salesforce details and starting evidence</h2>
        </div>
        <button data-action="extract-salesforce">Extract from Salesforce text</button>
      </div>
      <label>Salesforce text
        <textarea class="large-input" data-field="sourceDetails" placeholder="Paste copied Salesforce lead text.">${escapeHtml(active.sourceDetails || "")}</textarea>
      </label>
      <div class="grid two">
        <label>Lead number<input data-field="leadNumber" value="${attr(active.leadNumber)}"></label>
        <label>Customer name<input data-field="customerName" value="${attr(active.customerName)}"></label>
        <label>Phone<input data-field="contactNumber" value="${attr(active.contactNumber)}"></label>
        <label>Email<input type="email" data-field="customerEmail" value="${attr(active.customerEmail)}"></label>
        <label class="span-two">Address<textarea data-field="address">${escapeHtml(active.address || "")}</textarea></label>
        <label>Quoted package<textarea data-case-detail="quotedPackage">${escapeHtml(active.caseDetails?.quotedPackage || "")}</textarea></label>
        <label>Number of indoor units<input inputmode="numeric" data-case-detail="indoorUnitCount" value="${attr(active.caseDetails?.indoorUnitCount || active.indoorUnits?.length || 1)}"></label>
        <label>Planning status<input data-case-detail="planningStatus" value="${attr(active.caseDetails?.planningStatus || "")}"></label>
        <label>Install date<input data-case-detail="installDate" value="${attr(active.caseDetails?.installDate || "")}"></label>
        <label>Job number<input data-case-detail="jobNumber" value="${attr(active.caseDetails?.jobNumber || "")}"></label>
        <label>Job status<input data-case-detail="jobStatus" value="${attr(active.caseDetails?.jobStatus || "")}"></label>
        <label>Job sub status<input data-case-detail="jobSubStatus" value="${attr(active.caseDetails?.jobSubStatus || "")}"></label>
        <label>Quote reference<input data-case-detail="quoteReference" value="${attr(active.caseDetails?.quoteReference || "")}"></label>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head">
        <h2>Existing photos</h2>
        <label class="file-button upload-button">
          Upload photos
          <input type="file" accept="image/*" multiple data-action="add-photos">
        </label>
      </div>
      <div class="photo-grid">
        ${(active.photos ?? []).map(photoCard).join("") || `<p class="muted">No photos added yet.</p>`}
      </div>
    </section>
  `;
}

function evidenceScreen(active) {
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Evidence inventory</p>
          <h2>What do we already have?</h2>
        </div>
      </div>
      <div class="evidence-grid">
        ${EVIDENCE_ITEMS.map((item) => evidenceItem(active, item)).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-head">
        <h2>Indoor units</h2>
        <button data-action="add-indoor-unit">Add indoor unit</button>
      </div>
      <div class="stack">${(active.indoorUnits ?? []).map(indoorUnitEditor).join("")}</div>
    </section>
    <section class="panel">
      <h2>Outdoor unit</h2>
      <div class="grid two">
        ${textArea("outdoor", "location", "Position", active.outdoorUnit?.location)}
        ${textArea("outdoor", "mounting", "Mounting", active.outdoorUnit?.mounting)}
        ${textArea("outdoor", "route", "Route", active.outdoorUnit?.route)}
        ${textArea("outdoor", "clearances", "Clearances/access", active.outdoorUnit?.clearances)}
        ${textArea("outdoor", "condensateRoute", "Condensate", active.outdoorUnit?.condensateRoute)}
        ${textArea("outdoor", "notes", "Notes", active.outdoorUnit?.notes)}
      </div>
    </section>
    <section class="panel questions-panel">
      <h2>Relevant questions now</h2>
      ${questionList(active, evaluateQuestions(active))}
    </section>
  `;
}

function callScreen(active) {
  const questions = evaluateQuestions(active)
    .filter((question) => !question.complete && ["customer", "customer_photo"].includes(question.resolverType) && question.customerQuestion);
  return `
    <section class="panel call-panel">
      <div>
        <p class="eyebrow">Customer call</p>
        <h2>${questions.length ? `${questions.length} customer item${questions.length === 1 ? "" : "s"}` : "No customer questions outstanding"}</h2>
      </div>
      <div class="stack">
        ${questions.map(callQuestion).join("") || `<p class="ok">Customer-solvable items are complete.</p>`}
      </div>
    </section>
  `;
}

function outstandingScreen(active) {
  const groups = outstandingItems(active);
  return `
    <section class="panel">
      <p class="eyebrow">Outstanding items</p>
      <h2>Who can resolve what remains?</h2>
      <div class="outstanding-grid">
        ${outstandingGroup("Customer questions", groups.customerQuestions)}
        ${outstandingGroup("Customer photos required", groups.customerPhotosRequired)}
        ${outstandingGroup("Internal technical clarification", groups.internalTechnicalClarification)}
        ${outstandingGroup("BG/admin issue", groups.bgAdminIssue)}
        ${outstandingGroup("Surveyor review", groups.surveyorReview)}
        ${outstandingGroup("Complete", groups.complete)}
      </div>
    </section>
  `;
}

function handoverScreen(active, outputs) {
  return `
    <section class="panel output-screen">
      <p class="eyebrow">Output</p>
      <h2>Copy-ready handover text</h2>
      ${copyBox("Salesforce handover note", "salesforce", outputs.salesforceHandover)}
      ${copyBox("Customer follow-up message", "customer", outputs.customerFollowUp)}
      ${copyBox("Internal questions", "internal", outputs.internalQuestions)}
      ${copyBox("Manager completion message", "manager", outputs.managerCompletion)}
      <div class="primary-actions">
        <button data-action="download-json">Export lightweight JSON</button>
        <button data-action="download-zip">Export complete ZIP</button>
        <button data-action="mark-completed">Mark completed</button>
      </div>
    </section>
  `;
}

function advancedScreen(active) {
  const suggestions = active.aiReview?.suggestions ?? [];
  return `
    <section class="panel">
      <p class="eyebrow">Advanced / AI review</p>
      <h2>Optional AI support</h2>
      <p class="hint">The app remains usable without AI. AI suggestions do not determine workflow state and do not overwrite confirmed values automatically.</p>
      <div class="primary-actions">
        <button data-action="copy-ai-prompt">Copy AI review prompt</button>
        <button data-action="copy-ai-pack">Copy AI review JSON</button>
        <button data-action="download-ai-pack">Download AI review pack ZIP</button>
      </div>
      <label>Paste AI JSON result
        <textarea class="large-input ai-result-input" placeholder='{"schema":"bg.ac_triage.ai_result.v1",...}'></textarea>
      </label>
      <button class="primary" data-action="import-ai-result">Import as suggestions</button>
    </section>
    <section class="panel">
      <h2>Pending AI suggestions</h2>
      <div class="stack">
        ${suggestions.map(aiSuggestion).join("") || `<p class="muted">No pending AI suggestions.</p>`}
      </div>
    </section>
    <section class="panel">
      <h2>Timeline</h2>
      ${timelineView(active)}
    </section>
  `;
}

function evidenceItem(active, item) {
  const evidence = active.evidenceStates?.[item.id] ?? { state: "missing", notes: "" };
  return `
    <article class="evidence-card">
      <label>${escapeHtml(item.label)}
        <select data-evidence="${item.id}">
          ${options(EVIDENCE_STATES, evidence.state || "missing")}
        </select>
      </label>
      <textarea data-evidence-notes="${item.id}" placeholder="Notes">${escapeHtml(evidence.notes || "")}</textarea>
    </article>
  `;
}

function indoorUnitEditor(unit, index) {
  return `
    <article class="sub-card" data-unit="${unit.id}">
      <div class="panel-head">
        <h3>Indoor unit ${index + 1}</h3>
        ${index > 0 ? `<button class="danger" data-action="remove-indoor-unit" data-unit="${unit.id}">Remove</button>` : ""}
      </div>
      <div class="grid two">
        ${input("indoor", unit.id, "room", "Room", unit.room)}
        ${input("indoor", unit.id, "roomSize", "Room size", unit.roomSize)}
        ${textArea("indoor", "agreedLocation", "Agreed location", unit.agreedLocation, unit.id)}
        ${textArea("indoor", "wallConstruction", "Wall/construction", unit.wallConstruction, unit.id)}
        ${textArea("indoor", "pipeRoute", "Pipe route", unit.pipeRoute, unit.id)}
        ${input("indoor", unit.id, "nearestSocket", "Nearest socket", unit.nearestSocket)}
        ${input("indoor", unit.id, "trunkingColour", "Trunking colour", unit.trunkingColour)}
        ${textArea("indoor", "accessDetails", "Access details", unit.accessDetails, unit.id)}
      </div>
    </article>
  `;
}

function questionList(active, questions) {
  const visible = questions.filter((question) => question.relevant);
  if (!visible.length) return `<p class="muted">No relevant questions yet.</p>`;
  return `
    <div class="question-list">
      ${visible.map((question) => `
        <article class="question-card ${question.complete ? "complete" : ""}">
          <div>
            <strong>${escapeHtml(question.internalLabel)}</strong>
            <p>${escapeHtml(question.customerQuestion || question.why)}</p>
            <small>${escapeHtml(question.why)} · ${escapeHtml(question.rationaleConfidence)}</small>
          </div>
          <span>${question.complete ? "complete" : resolverLabel(question.resolverType)}</span>
        </article>
      `).join("")}
    </div>
  `;
}

function callQuestion(question) {
  return `
    <article class="call-question">
      <h3>${escapeHtml(question.customerQuestion)}</h3>
      <small>${escapeHtml(question.internalLabel)}</small>
      <textarea data-call-note="${attr(question.key)}" placeholder="Short note"></textarea>
      <div class="call-actions">
        <button data-action="call-answer" data-question="${attr(question.key)}" data-result="answered">Answered</button>
        <button data-action="call-answer" data-question="${attr(question.key)}" data-result="unsure">Customer unsure</button>
        <button data-action="call-answer" data-question="${attr(question.key)}" data-result="photo">Photo required</button>
        <button data-action="call-answer" data-question="${attr(question.key)}" data-result="na">Not applicable</button>
        <button data-action="call-answer" data-question="${attr(question.key)}" data-result="internal">Follow up internally</button>
      </div>
    </article>
  `;
}

function outstandingGroup(title, items) {
  return `
    <article class="outstanding-card">
      <h3>${escapeHtml(title)}</h3>
      ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item.internalLabel)}${item.customerQuestion ? `<small>${escapeHtml(item.customerQuestion)}</small>` : ""}</li>`).join("")}</ul>` : `<p class="muted">None</p>`}
    </article>
  `;
}

function copyBox(title, key, value) {
  return `
    <article class="copy-box">
      <div class="panel-head">
        <h3>${escapeHtml(title)}</h3>
        <button data-action="copy-output" data-output="${key}">Copy</button>
      </div>
      <textarea readonly data-output-box="${key}">${escapeHtml(value || "")}</textarea>
    </article>
  `;
}

function photoCard(photo) {
  const source = photo.annotatedThumbDataUrl || photo.thumbDataUrl || photo.annotatedDataUrl || photo.dataUrl || "";
  return `
    <article class="photo-card">
      ${source ? `<img src="${attr(source)}" alt="${attr(photo.name || "Photo")}" loading="lazy" decoding="async">` : ""}
      <div class="photo-meta">
        <label>Label<input data-photo-field="label" data-photo="${photo.id}" value="${attr(photo.label || "")}"></label>
        <label>Type<select data-photo-field="type" data-photo="${photo.id}">${options(PHOTO_TYPES, photo.type || "other")}</select></label>
        <label>Notes<textarea data-photo-field="notes" data-photo="${photo.id}">${escapeHtml(photo.notes || "")}</textarea></label>
      </div>
      <button class="danger" data-action="remove-photo" data-photo="${photo.id}">Remove</button>
    </article>
  `;
}

function aiSuggestion(suggestion) {
  return `
    <article class="sub-card">
      <strong>${escapeHtml(suggestion.path)}</strong>
      <p><b>Current:</b> ${escapeHtml(suggestion.currentValue)}</p>
      <p><b>Suggested:</b> ${escapeHtml(suggestion.proposedValue)}</p>
      <div class="action-row">
        <button data-action="accept-ai-suggestion" data-suggestion="${suggestion.id}">Accept</button>
        <button data-action="reject-ai-suggestion" data-suggestion="${suggestion.id}">Reject</button>
      </div>
    </article>
  `;
}

function timelineView(active) {
  const timeline = active.timeline?.length ? active.timeline : buildCaseTimeline(active);
  if (!timeline.length) return `<p class="muted">No timeline events yet.</p>`;
  return `<ol class="timeline-list">${timeline.map((event) => `
    <li>
      <strong>${escapeHtml(event.summary || event.type)}</strong>
      ${event.at ? `<small>${escapeHtml(formatDateTime(event.at))}</small>` : ""}
      ${event.detail ? `<p>${escapeHtml(event.detail)}</p>` : ""}
    </li>
  `).join("")}</ol>`;
}

function input(kind, id, field, label, value) {
  return `<label>${escapeHtml(label)}<input data-${kind}-field="${field}" data-unit="${id}" value="${attr(value || "")}"></label>`;
}

function textArea(kind, field, label, value, id = "") {
  const unit = id ? ` data-unit="${id}"` : "";
  return `<label>${escapeHtml(label)}<textarea data-${kind}-field="${field}"${unit}>${escapeHtml(value || "")}</textarea></label>`;
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    if (element.type === "file") {
      element.addEventListener("change", handleFileAction);
    }
  });
  app.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", updateCaseField);
    field.addEventListener("change", updateCaseField);
  });
  app.querySelectorAll("[data-case-detail]").forEach((field) => {
    field.addEventListener("input", updateCaseDetail);
    field.addEventListener("change", updateCaseDetail);
  });
  app.querySelectorAll("[data-evidence]").forEach((field) => field.addEventListener("change", updateEvidenceState));
  app.querySelectorAll("[data-evidence-notes]").forEach((field) => field.addEventListener("input", updateEvidenceNotes));
  app.querySelectorAll("[data-indoor-field]").forEach((field) => {
    field.addEventListener("input", updateIndoorUnit);
    field.addEventListener("change", updateIndoorUnit);
  });
  app.querySelectorAll("[data-outdoor-field]").forEach((field) => {
    field.addEventListener("input", updateOutdoorUnit);
    field.addEventListener("change", updateOutdoorUnit);
  });
  app.querySelectorAll("[data-photo-field]").forEach((field) => {
    field.addEventListener("input", updatePhoto);
    field.addEventListener("change", updatePhoto);
  });
}

async function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const active = selectedCase();

  if (action === "new-case") {
    const next = await saveCase(createEmptyCase());
    state.cases = [next, ...state.cases];
    state.selectedId = next.id;
    state.screen = "intake";
    render();
    return;
  }
  if (action === "select-case") {
    state.selectedId = event.currentTarget.dataset.id;
    render();
    return;
  }
  if (action === "screen") {
    state.screen = event.currentTarget.dataset.screen;
    render();
    return;
  }
  if (!active) return;

  if (action === "extract-salesforce") {
    const extracted = extractSalesforceLeadDetails(active.sourceDetails);
    Object.assign(active, {
      leadNumber: extracted.leadNumber || active.leadNumber,
      customerName: extracted.customerName || active.customerName,
      address: extracted.address || active.address,
      contactNumber: extracted.contactNumber || active.contactNumber,
      customerEmail: extracted.customerEmail || active.customerEmail,
    });
    active.caseDetails ||= {};
    if (extracted.quotedPackage) active.caseDetails.quotedPackage = extracted.quotedPackage;
    if (extracted.jobNumber) active.caseDetails.jobNumber = extracted.jobNumber;
    if (extracted.jobStatus) active.caseDetails.jobStatus = extracted.jobStatus;
    if (extracted.jobSubStatus) active.caseDetails.jobSubStatus = extracted.jobSubStatus;
    if (extracted.quoteReference) active.caseDetails.quoteReference = extracted.quoteReference;
    if (extracted.paymentMethod) active.caseDetails.paymentMethod = extracted.paymentMethod;
    if (extracted.indoorUnitCount) {
      active.caseDetails.indoorUnitCount = extracted.indoorUnitCount;
      syncIndoorUnitCount(active, extracted.indoorUnitCount);
    }
    await persistActive(active);
    return;
  }
  if (action === "add-indoor-unit") {
    active.indoorUnits.push(createEmptyIndoorUnit());
    active.caseDetails.indoorUnitCount = active.indoorUnits.length;
    await persistActive(active);
    return;
  }
  if (action === "remove-indoor-unit") {
    active.indoorUnits = active.indoorUnits.filter((unit) => unit.id !== event.currentTarget.dataset.unit);
    active.caseDetails.indoorUnitCount = active.indoorUnits.length;
    await persistActive(active);
    return;
  }
  if (action === "remove-photo") {
    active.photos = active.photos.filter((photo) => photo.id !== event.currentTarget.dataset.photo);
    await persistActive(active);
    return;
  }
  if (action === "copy-output") {
    const box = app.querySelector(`[data-output-box="${event.currentTarget.dataset.output}"]`);
    await copyText(box?.value || "");
    return;
  }
  if (action === "download-json") {
    downloadPortableJson(active);
    return;
  }
  if (action === "download-zip") {
    await downloadPortableZip(active);
    return;
  }
  if (action === "mark-completed") {
    active.status = "completed";
    await persistActive(active);
    return;
  }
  if (action === "copy-ai-prompt") {
    await copyText(generateAiReviewPrompt());
    return;
  }
  if (action === "copy-ai-pack") {
    await copyText(generateAiReviewPackJson(active));
    return;
  }
  if (action === "download-ai-pack") {
    await downloadAiReviewPack(active);
    return;
  }
  if (action === "import-ai-result") {
    await importAiResult(active);
    return;
  }
  if (action === "accept-ai-suggestion") {
    await resolveAiSuggestion(active, event.currentTarget.dataset.suggestion, true);
    return;
  }
  if (action === "reject-ai-suggestion") {
    await resolveAiSuggestion(active, event.currentTarget.dataset.suggestion, false);
    return;
  }
  if (action === "call-answer") {
    await applyCallAnswer(active, event.currentTarget);
    return;
  }
}

async function handleFileAction(event) {
  const action = event.currentTarget.dataset.action;
  if (action === "add-photos") {
    const active = selectedCase();
    if (!active) return;
    const files = [...event.currentTarget.files];
    active.photos ||= [];
    active.photos.push(...await Promise.all(files.map(readPhotoFile)));
    if (files.length) {
      active.evidenceStates.indoor_unit_wall_photos.state = active.photos.some((photo) => photo.type === "indoor_location") ? "confirmed" : active.evidenceStates.indoor_unit_wall_photos.state;
      active.evidenceStates.outdoor_unit_photos.state = active.photos.some((photo) => photo.type === "outdoor_location") ? "confirmed" : active.evidenceStates.outdoor_unit_photos.state;
      active.evidenceStates.consumer_unit_photo.state = active.photos.some((photo) => photo.type === "fuse_board") ? "confirmed" : active.evidenceStates.consumer_unit_photo.state;
    }
    await persistActive(active);
  }
  if (action === "import-case") {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      const imported = importPortableCase(JSON.parse(await file.text()));
      imported.id ||= crypto.randomUUID();
      const saved = await saveCase(imported);
      state.cases = [saved, ...state.cases.filter((item) => item.id !== saved.id)];
      state.selectedId = saved.id;
      state.screen = "intake";
      render();
    } catch (error) {
      toast(error.message || "Could not import case");
    }
  }
}

async function updateCaseField(event) {
  const active = selectedCase();
  if (!active) return;
  active[event.target.dataset.field] = event.target.value;
  await persistActive(active, event.type === "change");
  if (event.type === "input") renderLiveGuidance(active);
}

async function updateCaseDetail(event) {
  const active = selectedCase();
  if (!active) return;
  active.caseDetails ||= {};
  const field = event.target.dataset.caseDetail;
  const value = field === "indoorUnitCount" ? Math.max(1, Number(event.target.value) || 1) : event.target.value;
  active.caseDetails[field] = value;
  if (field === "indoorUnitCount") syncIndoorUnitCount(active, value);
  await persistActive(active, field === "indoorUnitCount" || event.type === "change");
  if (event.type === "input" && field !== "indoorUnitCount") renderLiveGuidance(active);
}

async function updateEvidenceState(event) {
  const active = selectedCase();
  if (!active) return;
  const id = event.target.dataset.evidence;
  active.evidenceStates[id] = { ...(active.evidenceStates[id] ?? {}), state: event.target.value, updatedAt: new Date().toISOString() };
  await persistActive(active);
}

async function updateEvidenceNotes(event) {
  const active = selectedCase();
  if (!active) return;
  const id = event.target.dataset.evidenceNotes;
  active.evidenceStates[id] = { ...(active.evidenceStates[id] ?? {}), notes: event.target.value, updatedAt: new Date().toISOString() };
  await persistActive(active, false);
}

async function updateIndoorUnit(event) {
  const active = selectedCase();
  if (!active) return;
  const unit = active.indoorUnits.find((item) => item.id === event.target.dataset.unit);
  if (!unit) return;
  unit[event.target.dataset.indoorField] = event.target.value;
  await persistActive(active, event.type === "change");
  if (event.type === "input") renderLiveGuidance(active);
}

async function updateOutdoorUnit(event) {
  const active = selectedCase();
  if (!active) return;
  active.outdoorUnit ||= {};
  active.outdoorUnit[event.target.dataset.outdoorField] = event.target.value;
  await persistActive(active, event.type === "change");
  if (event.type === "input") renderLiveGuidance(active);
}

async function updatePhoto(event) {
  const active = selectedCase();
  if (!active) return;
  const photo = active.photos.find((item) => item.id === event.target.dataset.photo);
  if (!photo) return;
  photo[event.target.dataset.photoField] = event.target.value;
  await persistActive(active, false);
}

async function applyCallAnswer(active, target) {
  const key = target.dataset.question;
  const result = target.dataset.result;
  const note = app.querySelector(`[data-call-note="${cssEscape(key)}"]`)?.value || "";
  active.answers[key] = {
    value: note,
    state: result === "answered" ? "confirmed" : result === "na" ? "not_applicable" : result === "internal" ? "awaiting_internal_clarification" : "awaiting_customer",
    notes: note,
    source: "customer_call",
    updatedAt: new Date().toISOString(),
  };
  const question = evaluateQuestions(active).find((item) => item.key === key);
  if (question?.category && active.evidenceStates[question.category]) {
    active.evidenceStates[question.category].state = active.answers[key].state;
    active.evidenceStates[question.category].notes = note;
    active.evidenceStates[question.category].updatedAt = new Date().toISOString();
  }
  await persistActive(active);
}

async function importAiResult(active) {
  const input = app.querySelector(".ai-result-input");
  const raw = input?.value?.trim();
  if (!raw) {
    toast("Paste AI JSON first");
    return;
  }
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    toast("Invalid JSON");
    return;
  }

  active.reviewRounds ||= [];
  active.reviewRounds.push({
    id: crypto.randomUUID(),
    round: active.reviewRounds.length + 1,
    sentAt: new Date().toISOString(),
    inputSummary: "Imported optional AI JSON result",
    aiDecision: result.decision || "",
    aiOutput: JSON.stringify(result, null, 2),
    customerMessage: result.customerMessage || "",
    outstandingBlockers: Array.isArray(result.missingBlockers) ? result.missingBlockers.join("\n") : "",
  });
  active.aiReview ||= { suggestions: [] };
  active.aiReview.suggestions.push(...prepareAiSuggestions(active, result));
  active.timeline = buildCaseTimeline(active);
  await persistActive(active);
  toast("AI suggestions imported");
}

async function resolveAiSuggestion(active, id, accept) {
  const suggestion = active.aiReview?.suggestions?.find((item) => item.id === id);
  if (!suggestion) return;
  if (accept) setValueAt(active, suggestion.path, suggestion.proposedValue);
  active.aiReview.suggestions = active.aiReview.suggestions.filter((item) => item.id !== id);
  await persistActive(active);
}

async function persistActive(active, rerender = true) {
  active.completionStatus = calculateCompletionStatus(active);
  active.status = active.status === "completed" ? "completed" : active.completionStatus.status;
  active.generatedOutputs = generateOutputs(active);
  const saved = await saveCase(active);
  state.cases = state.cases.map((item) => item.id === saved.id ? saved : item);
  if (rerender) render();
}

function renderLiveGuidance(active) {
  active.completionStatus = calculateCompletionStatus(active);
  const status = app.querySelector(".status-strip");
  if (status) {
    status.innerHTML = `
      <div>
        <p class="eyebrow">Current status</p>
        <h2>${escapeHtml(statusLabel(active.completionStatus.status))}</h2>
      </div>
      <div>
        <p class="eyebrow">Next action</p>
        <h2>${escapeHtml(active.completionStatus.nextAction)}</h2>
      </div>
      <progress value="${completedQuestionCount(active)}" max="${Math.max(1, evaluateQuestions(active).length)}"></progress>
    `;
  }
  const questions = app.querySelector(".questions-panel");
  if (questions) {
    questions.innerHTML = `
      <h2>Relevant questions now</h2>
      ${questionList(active, evaluateQuestions(active))}
    `;
  }
}

function syncIndoorUnitCount(active, count) {
  active.indoorUnits ||= [];
  while (active.indoorUnits.length < count) active.indoorUnits.push(createEmptyIndoorUnit());
  while (active.indoorUnits.length > count && active.indoorUnits.length > 1) active.indoorUnits.pop();
}

async function readPhotoFile(file) {
  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);
  const resized = drawImageToDataUrl(image, PHOTO_MAX_EDGE);
  const thumb = drawImageToDataUrl(image, THUMB_MAX_EDGE);
  return {
    id: crypto.randomUUID(),
    name: file.name,
    label: file.name.replace(/\.[^.]+$/, ""),
    type: inferPhotoType(file.name),
    notes: "",
    requestedAnnotation: "",
    dataUrl: resized.dataUrl,
    thumbDataUrl: thumb.dataUrl,
    marks: [],
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = source;
  });
}

function drawImageToDataUrl(image, maxEdge) {
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  context.drawImage(image, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/jpeg", PHOTO_QUALITY), width, height };
}

function downloadPortableJson(active) {
  const json = JSON.stringify(exportPortableCase(active), null, 2);
  downloadBlob(new Blob([json], { type: "application/json" }), caseExportFileName(active, "json"));
}

async function downloadPortableZip(active) {
  const portable = exportPortableCase(active);
  const files = [{ name: "case.json", bytes: new TextEncoder().encode(JSON.stringify(portable, null, 2)) }];
  await addPhotoFiles(files, active);
  downloadBlob(createZipBlob(files), caseExportFileName(active, "zip"));
}

async function downloadAiReviewPack(active) {
  const files = [{ name: "review-pack.json", bytes: new TextEncoder().encode(generateAiReviewPackJson(active)) }];
  await addPhotoFiles(files, active);
  downloadBlob(createZipBlob(files), `${safeFileName(active.leadNumber || active.customerName || "review-pack")}.zip`);
}

async function addPhotoFiles(files, active) {
  for (const [index, photo] of (active.photos ?? []).entries()) {
    if (photo.dataUrl) {
      const blob = await dataUrlToBlob(photo.dataUrl);
      files.push({ name: `photos/original/${photoFileName(photo, index)}`, bytes: new Uint8Array(await blob.arrayBuffer()) });
    }
    if (photo.annotatedDataUrl) {
      const blob = await dataUrlToBlob(photo.annotatedDataUrl);
      files.push({ name: `photos/annotated/${photoFileName(photo, index)}`, bytes: new Uint8Array(await blob.arrayBuffer()) });
    }
  }
}

function photoFileName(photo, index) {
  return `${String(index + 1).padStart(2, "0")}-${safeFileName(photo.label || photo.name || `photo-${index + 1}`)}.jpg`;
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function downloadBlob(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function createZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = file.bytes;
    const crc = crc32(data);
    const localHeader = zipLocalHeader(nameBytes, data.length, crc);
    localParts.push(localHeader, data);
    centralParts.push(zipCentralHeader(nameBytes, data.length, crc, offset));
    offset += localHeader.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  return new Blob([...localParts, ...centralParts, zipEndRecord(files.length, centralSize, offset)], { type: "application/zip" });
}

function zipLocalHeader(nameBytes, size, crc) {
  const header = new Uint8Array(30 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(8, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, nameBytes.length, true);
  header.set(nameBytes, 30);
  return header;
}

function zipCentralHeader(nameBytes, size, crc, offset) {
  const header = new Uint8Array(46 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, offset, true);
  header.set(nameBytes, 46);
  return header;
}

function zipEndRecord(count, centralSize, centralOffset) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, count, true);
  view.setUint16(10, count, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  return header;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});

function setValueAt(object, path, value) {
  const parts = path.split(".");
  let target = object;
  for (const part of parts.slice(0, -1)) {
    target[part] ||= {};
    target = target[part];
  }
  target[parts[parts.length - 1]] = value;
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  toast("Copied");
}

function completedQuestionCount(active) {
  return evaluateQuestions(active).filter((question) => question.complete).length;
}

function inferPhotoType(name) {
  const value = name.toLowerCase();
  if (value.includes("fuse") || value.includes("consumer")) return "fuse_board";
  if (value.includes("meter")) return "electric_meter";
  if (value.includes("outdoor") || value.includes("outside")) return "outdoor_location";
  if (value.includes("indoor") || value.includes("room")) return "indoor_location";
  if (value.includes("floor")) return "floorplan";
  return "other";
}

function screenLabel(screen) {
  return ({
    intake: "Intake",
    evidence: "Evidence",
    call: "Customer call",
    outstanding: "Outstanding",
    handover: "Handover",
    advanced: "Advanced / AI review",
  })[screen] || screen;
}

function statusLabel(status) {
  return String(status || "").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolverLabel(type) {
  return ({
    customer: "customer",
    customer_photo: "photo",
    internal: "internal",
    admin: "BG/admin",
    surveyor: "surveyor",
  })[type] || type;
}

function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function options(values, selected) {
  return values.map((value) => `<option value="${attr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(statusLabel(value))}</option>`).join("");
}

function cssEscape(value) {
  if (globalThis.CSS?.escape) return CSS.escape(value);
  return String(value).replace(/"/g, "\\\"");
}

function toast(message) {
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 1600);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[char]);
}

function attr(value) {
  return escapeHtml(value);
}

function safeFileName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "file";
}
