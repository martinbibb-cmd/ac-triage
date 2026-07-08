import {
  CHECKLIST,
  AI_DECISIONS,
  CASE_STATUSES,
  JOB_STAGES,
  NEXT_ACTIONS,
  PHOTO_TYPES,
  REFERENCE_DATA,
  TRUNKING_COLOURS,
  WORKFLOW_STEPS,
  createEmptyCase,
  createEmptyCustomerReply,
  createEmptyReviewRound,
  createEmptyRoom,
  generateCustomerRequestMessage,
  generateAiReviewPackJson,
  generateAiReviewPrompt,
  generateHandoverNotes,
  generateMissingQuestions,
  generateReferenceText,
  suggestUnitSize,
} from "./domain.js";
import { deleteCase, loadCases, saveCase } from "./storage.js";

const app = document.querySelector("#app");
const PHOTO_MAX_EDGE = 1600;
const THUMB_MAX_EDGE = 420;
const PHOTO_QUALITY = 0.82;

const state = {
  cases: [],
  selectedId: null,
  markup: {
    photoId: null,
    tool: "line",
    points: [],
    labelText: "Label",
  },
};

init();

async function init() {
  app.innerHTML = `<div class="empty"><h2>Loading cases</h2><p>Checking local photo storage...</p></div>`;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
  }
  state.cases = await loadCases();
  state.cases = await compactCasePhotos(state.cases);
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
        <p class="eyebrow">AI review pack builder</p>
        <h1>Air Con Triage Pack Builder</h1>
      </div>
      <button class="primary" data-action="new-case">New Case</button>
    </header>
    <section class="layout">
      <aside class="case-list">
        <div class="section-title">Cases</div>
        ${state.cases.map(caseCard).join("") || `<p class="muted">No cases yet.</p>`}
      </aside>
      <section class="workspace">
        ${active ? caseEditor(active) : emptyState()}
      </section>
    </section>
  `;
  bindEvents();
}

function caseCard(item) {
  const selected = item.id === state.selectedId ? "selected" : "";
  return `
    <button class="case-card ${selected}" data-action="select-case" data-id="${item.id}">
      <strong>${escapeHtml(item.leadNumber || "New lead")}</strong>
      <span>${escapeHtml(item.customerName || "No customer name")}</span>
      <small>${escapeHtml(item.jobStage)}</small>
    </button>
  `;
}

function emptyState() {
  return `
    <div class="empty">
      <h2>Start a triage case</h2>
      <p>Create a case, fill the handover fields, annotate evidence, then copy Salesforce-ready notes.</p>
      <button class="primary" data-action="new-case">New Case</button>
    </div>
  `;
}

function caseEditor(item) {
  return `
    <div class="toolbar">
      <button class="primary" data-action="copy-ai-pack">Copy AI review pack</button>
      <button data-action="copy-ai-prompt">Copy AI review prompt</button>
      <button data-action="copy-notes">Copy handover notes</button>
      <button data-action="copy-form">Copy completed form</button>
      <button data-action="share-case">Share / export</button>
      <button class="danger" data-action="delete-case">Delete</button>
    </div>

    <section class="panel next-action-panel">
      <div>
        <p class="eyebrow">Next action</p>
        <h2>${escapeHtml(nextActionLabel(item.nextAction))}</h2>
      </div>
      <div class="grid two">
        <label>Status
          <select data-field="status">${options(CASE_STATUSES, item.status || "draft")}</select>
        </label>
        <label>Next action
          <select data-field="nextAction">${options(NEXT_ACTIONS, item.nextAction || "review_again")}</select>
        </label>
      </div>
    </section>

    <div class="grid two">
      <section class="panel">
        <h2>Case details</h2>
        <label>Lead number<input data-field="leadNumber" value="${attr(item.leadNumber)}"></label>
        <label>Customer name<input data-field="customerName" value="${attr(item.customerName)}"></label>
        <label>Address<textarea data-field="address">${escapeHtml(item.address)}</textarea></label>
        <label>Contact number<input data-field="contactNumber" value="${attr(item.contactNumber)}"></label>
        <label>Customer email<input type="email" data-field="customerEmail" value="${attr(item.customerEmail)}"></label>
        <label>Property type<input data-field="propertyType" value="${attr(item.propertyType)}"></label>
        <label>Job stage
          <select data-field="jobStage">${options(JOB_STAGES, item.jobStage)}</select>
        </label>
        <label>Install date<input data-field="installDate" value="${attr(item.installDate)}"></label>
        <label>Planning date<input data-field="planningDate" value="${attr(item.planningDate)}"></label>
        <label class="span-two">Pasted job / Salesforce details<textarea data-field="sourceDetails" placeholder="Paste raw Salesforce/job notes here">${escapeHtml(item.sourceDetails)}</textarea></label>
      </section>

      <section class="panel">
        <h2>Customer request</h2>
        <div class="questions">
          ${questionList(item)}
        </div>
        <div class="action-row">
          <button data-action="sms-customer">Text customer</button>
          <button data-action="email-customer">Email customer</button>
          <button data-action="copy-request">Copy request</button>
        </div>
        <pre class="message-preview">${escapeHtml(generateCustomerRequestMessage(item))}</pre>
      </section>
    </div>

    <section class="panel">
      <div class="panel-head">
        <h2>AI review pack</h2>
        <div class="action-row">
          <button class="primary" data-action="copy-ai-pack">Copy AI review pack</button>
          <button data-action="copy-ai-prompt">Copy AI review prompt</button>
        </div>
      </div>
      <p class="hint">Copy the JSON, upload the photos separately into GPT/Gemini, then paste the prompt. Image data is not embedded in the JSON.</p>
      <pre class="notes-preview compact-preview">${escapeHtml(generateAiReviewPackJson(item))}</pre>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Review rounds</h2>
        <button data-action="add-review-round">Add review round</button>
      </div>
      <div class="stack">
        ${(item.reviewRounds ?? []).map(reviewRoundEditor).join("") || `<p class="muted">No AI review pasted yet.</p>`}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Customer replies</h2>
        <button data-action="add-customer-reply">Add customer reply</button>
      </div>
      <div class="stack">
        ${(item.customerReplies ?? []).map(customerReplyEditor).join("") || `<p class="muted">No customer replies added yet.</p>`}
      </div>
    </section>

    <section class="panel">
      <h2>Fast workflow</h2>
      <div class="check-grid">
        ${WORKFLOW_STEPS.map((step) => `
          <label class="check-tile">
            <input type="checkbox" data-workflow="${step.id}" ${item.workflow?.[step.id] ? "checked" : ""}>
            <span>${escapeHtml(step.label)}</span>
          </label>
        `).join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Guided checklist</h2>
      <div class="check-grid">
        ${CHECKLIST.map((check) => `
          <label class="check-tile">
            <input type="checkbox" data-check="${check.id}" ${item.checklist?.[check.id] ? "checked" : ""}>
            <span>${escapeHtml(check.label)}</span>
          </label>
        `).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Rooms / units</h2>
        <button data-action="add-room">Add room</button>
      </div>
      <div class="rooms">
        ${item.rooms.map((room, index) => roomEditor(room, index)).join("")}
      </div>
    </section>

    <section class="panel">
      <h2>Outside unit</h2>
      ${outsideUnitEditor(item.outsideUnit || {})}
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Reference</h2>
        <button data-action="copy-reference">Copy reference</button>
      </div>
      ${referencePanel()}
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Photos and markup</h2>
        <label class="file-button">
          Upload photos
          <input type="file" accept="image/*" multiple data-action="add-photos">
        </label>
      </div>
      <p class="hint">Tap points to draw pipe route lines. Use boxes for indoor units, outdoor units, or room outlines. Annotated images can be downloaded to Photos.</p>
      <div class="photo-grid">
        ${item.photos.map(photoCard).join("") || `<p class="muted">No photos added yet.</p>`}
      </div>
      ${markupEditor(item)}
    </section>

    <section class="panel">
      <h2>Handover preview</h2>
      <pre class="notes-preview">${escapeHtml(generateHandoverNotes(item))}</pre>
    </section>
  `;
}

function roomEditor(room, index) {
  const size = room.suggestedUnitSize || suggestUnitSize(room.roomSize);
  return `
    <article class="room-card" data-room="${room.id}">
      <div class="panel-head">
        <h3>Room ${index + 1}</h3>
        ${index > 0 ? `<button class="danger" data-action="remove-room" data-room="${room.id}">Remove</button>` : ""}
      </div>
      <div class="grid three">
        <label>Room name<input data-room-field="roomName" data-room="${room.id}" value="${attr(room.roomName)}"></label>
        <label>Room size m2<input inputmode="decimal" data-room-field="roomSize" data-room="${room.id}" value="${attr(room.roomSize)}"></label>
        <label>Suggested unit size
          <select data-room-field="suggestedUnitSize" data-room="${room.id}">
            ${options(["", "SMALL", "MED", "LARGE"], size)}
          </select>
        </label>
      </div>
      <div class="grid two">
        <label>Internal unit location<textarea data-room-field="internalLocation" data-room="${room.id}">${escapeHtml(room.internalLocation)}</textarea></label>
        <label>Pipe run<textarea data-room-field="pipeRun" data-room="${room.id}">${escapeHtml(room.pipeRun)}</textarea></label>
        <label>Electrical supply notes<textarea data-room-field="electricalSupplyNotes" data-room="${room.id}">${escapeHtml(room.electricalSupplyNotes)}</textarea></label>
      </div>
      <div class="grid three">
        <label>Trunking colour
          <select data-room-field="trunkingColour" data-room="${room.id}">
            ${options(TRUNKING_COLOURS, room.trunkingColour)}
          </select>
        </label>
        <label>Other colour<input data-room-field="trunkingOther" data-room="${room.id}" value="${attr(room.trunkingOther)}"></label>
        <label>Plug location<input data-room-field="plugLocation" data-room="${room.id}" value="${attr(room.plugLocation)}"></label>
      </div>
      <label class="check-tile inline">
        <input type="checkbox" data-room-field="wifiDongleRequired" data-room="${room.id}" ${room.wifiDongleRequired ? "checked" : ""}>
        <span>Wi-Fi dongle required</span>
      </label>
    </article>
  `;
}

function outsideUnitEditor(outsideUnit) {
  return `
    <div class="grid two">
      <label>Outdoor unit location<textarea data-outside-field="location">${escapeHtml(outsideUnit.location)}</textarea></label>
      <label>Mounting / base<textarea data-outside-field="mounting">${escapeHtml(outsideUnit.mounting)}</textarea></label>
      <label>Clearances<textarea data-outside-field="clearances">${escapeHtml(outsideUnit.clearances)}</textarea></label>
      <label>Ladder access / height safety<textarea data-outside-field="ladderAccess">${escapeHtml(outsideUnit.ladderAccess)}</textarea></label>
      <label class="span-two">Outside unit notes<textarea data-outside-field="notes">${escapeHtml(outsideUnit.notes)}</textarea></label>
    </div>
  `;
}

function referencePanel() {
  return `
    <div class="reference-grid">
      <article class="reference-card">
        <h3>Indoor clearances</h3>
        ${referenceList(REFERENCE_DATA.indoorClearances)}
      </article>
      <article class="reference-card">
        <h3>Outdoor clearances</h3>
        ${referenceList(REFERENCE_DATA.outdoorClearances)}
      </article>
    </div>
    <div class="reference-grid">
      <article class="reference-card">
        <h3>Indoor unit dimensions</h3>
        ${dimensionTable(REFERENCE_DATA.indoorDimensions)}
      </article>
      <article class="reference-card">
        <h3>Outdoor unit dimensions</h3>
        ${dimensionTable(REFERENCE_DATA.outdoorDimensions)}
      </article>
    </div>
    <p class="hint">Reference from supplied Climate 3200i triage brief images. Confirm against current install instructions when required.</p>
  `;
}

function referenceList(items) {
  return `
    <dl class="reference-list">
      ${items.map((item) => `
        <div>
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function dimensionTable(items) {
  return `
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Output</th>
            <th>H</th>
            <th>W</th>
            <th>D</th>
            <th>Kg</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <th>${escapeHtml(item.output)}</th>
              <td>${item.height}</td>
              <td>${item.width}</td>
              <td>${item.depth}</td>
              <td>${item.weight}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function photoCard(photo) {
  const source = photo.annotatedThumbDataUrl || photo.thumbDataUrl || photo.annotatedDataUrl || photo.dataUrl;
  return `
    <article class="photo-card">
      <img src="${attr(source)}" alt="${attr(photo.name)}" loading="lazy" decoding="async">
      <div class="photo-meta">
        <label>Label<input data-photo-field="label" data-photo="${photo.id}" value="${attr(photo.label || "")}"></label>
        <label>Type
          <select data-photo-field="type" data-photo="${photo.id}">
            ${options(PHOTO_TYPES, photo.type || "other")}
          </select>
        </label>
        <label>Notes<textarea data-photo-field="notes" data-photo="${photo.id}">${escapeHtml(photo.notes || "")}</textarea></label>
        <label>Requested annotation<textarea data-photo-field="requestedAnnotation" data-photo="${photo.id}">${escapeHtml(photo.requestedAnnotation || "")}</textarea></label>
      </div>
      <div class="photo-actions">
        <button data-action="edit-photo" data-photo="${photo.id}">Markup</button>
        <button data-action="save-gallery" data-photo="${photo.id}">Save to gallery</button>
        <button class="danger" data-action="remove-photo" data-photo="${photo.id}">Remove</button>
      </div>
    </article>
  `;
}

function reviewRoundEditor(round) {
  return `
    <article class="sub-card">
      <div class="grid three">
        <label>Round<input inputmode="numeric" data-review-field="round" data-review="${round.id}" value="${attr(round.round)}"></label>
        <label>Sent at<input data-review-field="sentAt" data-review="${round.id}" value="${attr(round.sentAt || "")}"></label>
        <label>AI decision
          <select data-review-field="aiDecision" data-review="${round.id}">
            ${options(AI_DECISIONS, round.aiDecision || "")}
          </select>
        </label>
      </div>
      <label>Input summary<textarea data-review-field="inputSummary" data-review="${round.id}">${escapeHtml(round.inputSummary || "")}</textarea></label>
      <label>AI output<textarea data-review-field="aiOutput" data-review="${round.id}">${escapeHtml(round.aiOutput || "")}</textarea></label>
      <label>Customer message from AI<textarea data-review-field="customerMessage" data-review="${round.id}">${escapeHtml(round.customerMessage || "")}</textarea></label>
      <label>Outstanding blockers<textarea data-review-field="outstandingBlockers" data-review="${round.id}" placeholder="One blocker per line">${escapeHtml(round.outstandingBlockers || "")}</textarea></label>
    </article>
  `;
}

function customerReplyEditor(reply) {
  return `
    <article class="sub-card">
      <label>Received at<input data-reply-field="receivedAt" data-reply="${reply.id}" value="${attr(reply.receivedAt || "")}"></label>
      <label>Customer reply<textarea data-reply-field="text" data-reply="${reply.id}">${escapeHtml(reply.text || "")}</textarea></label>
      <label>Photo IDs supplied<textarea data-reply-field="photoIds" data-reply="${reply.id}" placeholder="photo id per line">${escapeHtml((reply.photoIds || []).join("\n"))}</textarea></label>
      <label>Notes<textarea data-reply-field="notes" data-reply="${reply.id}">${escapeHtml(reply.notes || "")}</textarea></label>
    </article>
  `;
}

function markupEditor(item) {
  const photo = item.photos.find((entry) => entry.id === state.markup.photoId);
  if (!photo) return "";
  return `
    <div class="markup-panel">
      <div class="markup-tools">
        <strong>Markup: ${escapeHtml(photo.name)}</strong>
        ${toolButton("line", "Pipe route line")}
        ${toolButton("internal", "Indoor unit box")}
        ${toolButton("external", "Outdoor unit box")}
        ${toolButton("room", "Room box")}
        ${toolButton("label", "Text label")}
        <input class="label-input" data-action="label-text" value="${attr(state.markup.labelText)}" aria-label="Label text">
        <button data-action="undo-markup">Undo</button>
        <button class="primary" data-action="save-markup">Save annotated copy</button>
        <button data-action="close-markup">Close</button>
      </div>
      <canvas id="markupCanvas" class="markup-canvas" aria-label="Photo markup canvas"></canvas>
    </div>
  `;
}

function toolButton(tool, label) {
  const active = state.markup.tool === tool ? "active" : "";
  return `<button class="${active}" data-action="tool" data-tool="${tool}">${label}</button>`;
}

function questionList(item) {
  const questions = generateMissingQuestions(item);
  if (!questions.length) return `<p class="ok">No missing customer questions.</p>`;
  return `<ol>${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol>`;
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
    if (element.dataset.action === "add-photos") {
      element.addEventListener("change", handlePhotoUpload);
    }
  });

  app.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", updateCaseField);
    field.addEventListener("change", updateCaseField);
  });
  app.querySelectorAll("[data-check]").forEach((field) => {
    field.addEventListener("change", updateChecklistField);
  });
  app.querySelectorAll("[data-workflow]").forEach((field) => {
    field.addEventListener("change", updateWorkflowField);
  });
  app.querySelectorAll("[data-room-field]").forEach((field) => {
    field.addEventListener("input", updateRoomField);
    field.addEventListener("change", updateRoomField);
  });
  app.querySelectorAll("[data-outside-field]").forEach((field) => {
    field.addEventListener("input", updateOutsideUnitField);
    field.addEventListener("change", updateOutsideUnitField);
  });
  app.querySelectorAll("[data-photo-field]").forEach((field) => {
    field.addEventListener("input", updatePhotoField);
    field.addEventListener("change", updatePhotoField);
  });
  app.querySelectorAll("[data-review-field]").forEach((field) => {
    field.addEventListener("input", updateReviewRoundField);
    field.addEventListener("change", updateReviewRoundField);
  });
  app.querySelectorAll("[data-reply-field]").forEach((field) => {
    field.addEventListener("input", updateCustomerReplyField);
    field.addEventListener("change", updateCustomerReplyField);
  });

  const labelInput = app.querySelector("[data-action='label-text']");
  if (labelInput) {
    labelInput.addEventListener("input", (event) => {
      state.markup.labelText = event.target.value;
    });
  }

  drawMarkupCanvas();
}

async function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const active = selectedCase();

  if (action === "new-case") {
    const next = await saveCase(createEmptyCase());
    state.cases = [next, ...state.cases];
    state.selectedId = next.id;
    render();
  }
  if (action === "select-case") {
    state.selectedId = event.currentTarget.dataset.id;
    state.markup.photoId = null;
    render();
  }
  if (!active) return;

  if (action === "delete-case" && confirm("Delete this triage case?")) {
    await deleteCase(active.id);
    state.cases = state.cases.filter((item) => item.id !== active.id);
    state.selectedId = state.cases[0]?.id ?? null;
    render();
  }
  if (action === "add-room") {
    active.rooms.push(createEmptyRoom());
    await persistActive(active);
  }
  if (action === "remove-room") {
    active.rooms = active.rooms.filter((room) => room.id !== event.currentTarget.dataset.room);
    await persistActive(active);
  }
  if (action === "add-review-round") {
    active.reviewRounds ||= [];
    active.reviewRounds.push(createEmptyReviewRound(active.reviewRounds.length + 1));
    await persistActive(active);
  }
  if (action === "add-customer-reply") {
    active.customerReplies ||= [];
    active.customerReplies.push(createEmptyCustomerReply());
    await persistActive(active);
  }
  if (action === "copy-notes" || action === "copy-form") {
    await copyText(generateHandoverNotes(active));
  }
  if (action === "copy-ai-pack") {
    await copyText(generateAiReviewPackJson(active));
  }
  if (action === "copy-ai-prompt") {
    await copyText(generateAiReviewPrompt());
  }
  if (action === "copy-questions") {
    await copyText(generateMissingQuestions(active).join("\n") || "No missing customer questions.");
  }
  if (action === "copy-request") {
    await copyText(generateCustomerRequestMessage(active));
  }
  if (action === "sms-customer") {
    sendCustomerSms(active);
  }
  if (action === "email-customer") {
    sendCustomerEmail(active);
  }
  if (action === "copy-reference") {
    await copyText(generateReferenceText());
  }
  if (action === "share-case") {
    await shareCase(active);
  }
  if (action === "edit-photo") {
    state.markup.photoId = event.currentTarget.dataset.photo;
    state.markup.points = [];
    render();
  }
  if (action === "remove-photo") {
    active.photos = active.photos.filter((photo) => photo.id !== event.currentTarget.dataset.photo);
    await persistActive(active);
  }
  if (action === "save-gallery") {
    const photo = active.photos.find((entry) => entry.id === event.currentTarget.dataset.photo);
    await saveImageFile(photo.annotatedDataUrl || photo.dataUrl, `${safeFileName(active.leadNumber || "ac-triage")}-${safeFileName(photo.name)}.png`);
  }
  if (action === "tool") {
    state.markup.tool = event.currentTarget.dataset.tool;
    state.markup.points = [];
    render();
  }
  if (action === "undo-markup") {
    const photo = active.photos.find((entry) => entry.id === state.markup.photoId);
    photo?.marks.pop();
    await persistActive(active, false);
    render();
  }
  if (action === "save-markup") {
    await saveAnnotatedPhoto(active);
  }
  if (action === "close-markup") {
    state.markup.photoId = null;
    render();
  }
}

async function updateCaseField(event) {
  const active = selectedCase();
  active[event.target.dataset.field] = event.target.value;
  await persistActive(active, false);
  renderSoft();
}

async function updateChecklistField(event) {
  const active = selectedCase();
  active.checklist[event.target.dataset.check] = event.target.checked;
  await persistActive(active);
}

async function updateWorkflowField(event) {
  const active = selectedCase();
  active.workflow ||= {};
  active.workflow[event.target.dataset.workflow] = event.target.checked;
  await persistActive(active);
}

async function updateRoomField(event) {
  const active = selectedCase();
  const room = active.rooms.find((entry) => entry.id === event.target.dataset.room);
  const field = event.target.dataset.roomField;
  room[field] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
  if (field === "roomSize" && !room.suggestedUnitSize) {
    room.suggestedUnitSize = suggestUnitSize(room.roomSize);
  }
  await persistActive(active, false);
  renderSoft();
}

async function updateOutsideUnitField(event) {
  const active = selectedCase();
  active.outsideUnit ||= {};
  active.outsideUnit[event.target.dataset.outsideField] = event.target.value;
  await persistActive(active, false);
  renderSoft();
}

async function updatePhotoField(event) {
  const active = selectedCase();
  const photo = active.photos.find((entry) => entry.id === event.target.dataset.photo);
  if (!photo) return;
  photo[event.target.dataset.photoField] = event.target.value;
  await persistActive(active, false);
  renderSoft();
}

async function updateReviewRoundField(event) {
  const active = selectedCase();
  const round = active.reviewRounds?.find((entry) => entry.id === event.target.dataset.review);
  if (!round) return;
  const field = event.target.dataset.reviewField;
  round[field] = field === "round" ? Number(event.target.value) || "" : event.target.value;
  await persistActive(active, false);
  renderSoft();
}

async function updateCustomerReplyField(event) {
  const active = selectedCase();
  const reply = active.customerReplies?.find((entry) => entry.id === event.target.dataset.reply);
  if (!reply) return;
  const field = event.target.dataset.replyField;
  reply[field] = field === "photoIds"
    ? event.target.value.split(/\n+/).map((item) => item.trim()).filter(Boolean)
    : event.target.value;
  await persistActive(active, false);
  renderSoft();
}

async function handlePhotoUpload(event) {
  const active = selectedCase();
  const files = [...event.target.files];
  const photos = await Promise.all(files.map(readPhotoFile));
  active.photos.push(...photos);
  await persistActive(active);
}

async function readPhotoFile(file) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const resized = drawImageToDataUrl(image, PHOTO_MAX_EDGE);
    const thumb = drawImageToDataUrl(image, THUMB_MAX_EDGE);
    return {
      id: crypto.randomUUID(),
      name: file.name,
      label: file.name,
      type: "other",
      notes: "",
      requestedAnnotation: "",
      dataUrl: resized.dataUrl,
      thumbDataUrl: thumb.dataUrl,
      annotatedDataUrl: "",
      annotatedThumbDataUrl: "",
      marks: [],
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function drawMarkupCanvas() {
  const canvas = document.querySelector("#markupCanvas");
  const active = selectedCase();
  const photo = active?.photos.find((entry) => entry.id === state.markup.photoId);
  if (!canvas || !photo) return;

  const image = new Image();
  image.onload = () => {
    const maxWidth = Math.min(canvas.parentElement.clientWidth, 1100);
    const scale = maxWidth / image.naturalWidth;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${image.naturalHeight * scale}px`;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    drawMarks(context, photo.marks);
  };
  image.src = photo.dataUrl;

  canvas.addEventListener("pointerdown", async (event) => {
    const point = canvasPoint(canvas, event);
    await addMarkPoint(active, photo, point);
  });
}

async function addMarkPoint(active, photo, point) {
  const tool = state.markup.tool;
  if (tool === "label") {
    photo.marks.push({ type: "label", point, text: state.markup.labelText || "Label" });
    await persistActive(active);
    return;
  }

  state.markup.points.push(point);
  if (state.markup.points.length < 2) return;

  const [start, end] = state.markup.points;
  if (tool === "line") photo.marks.push({ type: "line", start, end });
  if (tool === "internal") photo.marks.push({ type: "box", kind: "internal", start, end });
  if (tool === "external") photo.marks.push({ type: "box", kind: "external", start, end });
  if (tool === "room") photo.marks.push({ type: "box", kind: "room", start, end });
  state.markup.points = [];
  await persistActive(active);
}

function drawMarks(context, marks) {
  context.lineWidth = Math.max(8, context.canvas.width * 0.006);
  context.font = `${Math.max(28, context.canvas.width * 0.032)}px system-ui`;
  context.textBaseline = "top";

  for (const mark of marks ?? []) {
    if (mark.type === "line") {
      context.strokeStyle = "#ffcf33";
      context.beginPath();
      context.moveTo(mark.start.x, mark.start.y);
      context.lineTo(mark.end.x, mark.end.y);
      context.stroke();
      drawPoint(context, mark.start);
      drawPoint(context, mark.end);
    }
    if (mark.type === "box") {
      context.strokeStyle = mark.kind === "internal" ? "#35d07f" : mark.kind === "external" ? "#4aa3ff" : "#ff7a45";
      context.strokeRect(mark.start.x, mark.start.y, mark.end.x - mark.start.x, mark.end.y - mark.start.y);
      drawLabel(context, mark.start, mark.kind === "internal" ? "Indoor unit" : mark.kind === "external" ? "Outdoor unit" : "Room");
    }
    if (mark.type === "label") {
      drawLabel(context, mark.point, mark.text);
    }
  }
}

function drawPoint(context, point) {
  context.fillStyle = "#ffcf33";
  context.beginPath();
  context.arc(point.x, point.y, Math.max(10, context.canvas.width * 0.008), 0, Math.PI * 2);
  context.fill();
}

function drawLabel(context, point, text) {
  const padding = 10;
  const metrics = context.measureText(text);
  context.fillStyle = "rgba(21, 48, 71, 0.88)";
  context.fillRect(point.x, point.y, metrics.width + padding * 2, 44 + padding);
  context.fillStyle = "#ffffff";
  context.fillText(text, point.x + padding, point.y + padding);
}

async function saveAnnotatedPhoto(active) {
  const canvas = document.querySelector("#markupCanvas");
  const photo = active.photos.find((entry) => entry.id === state.markup.photoId);
  if (!canvas || !photo) return;
  photo.annotatedDataUrl = canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
  photo.annotatedThumbDataUrl = drawCanvasToDataUrl(canvas, THUMB_MAX_EDGE).dataUrl;
  await persistActive(active);
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(((event.clientX - rect.left) / rect.width) * canvas.width),
    y: Math.round(((event.clientY - rect.top) / rect.height) * canvas.height),
  };
}

async function persistActive(active, rerender = true) {
  const saved = await saveCase(active);
  state.cases = state.cases.map((item) => item.id === saved.id ? saved : item);
  if (rerender) render();
}

async function compactCasePhotos(cases) {
  let changed = false;
  const compacted = [];

  for (const caseData of cases) {
    const photos = [];
    for (const photo of caseData.photos ?? []) {
      const compactedPhoto = await compactPhoto(photo).catch(() => photo);
      if (compactedPhoto !== photo) changed = true;
      photos.push(compactedPhoto);
    }
    compacted.push({ ...caseData, photos });
  }

  if (changed) {
    for (const caseData of compacted) {
      await saveCase(caseData);
    }
  }

  return compacted;
}

async function compactPhoto(photo) {
  if (!photo?.dataUrl) return photo;

  const image = await loadImage(photo.dataUrl);
  const resized = drawImageToDataUrl(image, PHOTO_MAX_EDGE);
  const thumb = drawImageToDataUrl(image, THUMB_MAX_EDGE);
  const shouldReplaceData = image.naturalWidth !== resized.width || image.naturalHeight !== resized.height;
  const next = { ...photo };

  if (shouldReplaceData) {
    const scaleX = resized.width / image.naturalWidth;
    const scaleY = resized.height / image.naturalHeight;
    next.dataUrl = resized.dataUrl;
    next.marks = scaleMarks(photo.marks ?? [], scaleX, scaleY);
    next.annotatedDataUrl = "";
    next.annotatedThumbDataUrl = "";
  }

  if (!next.thumbDataUrl || shouldReplaceData) {
    next.thumbDataUrl = thumb.dataUrl;
  }

  if (next.annotatedDataUrl && !next.annotatedThumbDataUrl) {
    const annotatedImage = await loadImage(next.annotatedDataUrl);
    next.annotatedDataUrl = drawImageToDataUrl(annotatedImage, PHOTO_MAX_EDGE).dataUrl;
    next.annotatedThumbDataUrl = drawImageToDataUrl(annotatedImage, THUMB_MAX_EDGE).dataUrl;
  }

  return next.dataUrl !== photo.dataUrl ||
    next.thumbDataUrl !== photo.thumbDataUrl ||
    next.annotatedDataUrl !== photo.annotatedDataUrl ||
    next.annotatedThumbDataUrl !== photo.annotatedThumbDataUrl ||
    next.marks !== photo.marks
    ? next
    : photo;
}

function scaleMarks(marks, scaleX, scaleY) {
  return marks.map((mark) => {
    if (mark.type === "line" || mark.type === "box") {
      return {
        ...mark,
        start: scalePoint(mark.start, scaleX, scaleY),
        end: scalePoint(mark.end, scaleX, scaleY),
      };
    }
    if (mark.type === "label") {
      return { ...mark, point: scalePoint(mark.point, scaleX, scaleY) };
    }
    return mark;
  });
}

function scalePoint(point, scaleX, scaleY) {
  return {
    x: Math.round((point?.x ?? 0) * scaleX),
    y: Math.round((point?.y ?? 0) * scaleY),
  };
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

function drawCanvasToDataUrl(sourceCanvas, maxEdge) {
  const scale = Math.min(1, maxEdge / Math.max(sourceCanvas.width, sourceCanvas.height));
  const width = Math.max(1, Math.round(sourceCanvas.width * scale));
  const height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  context.drawImage(sourceCanvas, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/jpeg", PHOTO_QUALITY), width, height };
}

function renderSoft() {
  const preview = app.querySelector(".notes-preview");
  const questions = app.querySelector(".questions");
  const message = app.querySelector(".message-preview");
  const active = selectedCase();
  if (preview && active) preview.textContent = generateHandoverNotes(active);
  if (questions && active) questions.innerHTML = questionList(active);
  if (message && active) message.textContent = generateCustomerRequestMessage(active);
  const aiPack = app.querySelector(".compact-preview");
  if (aiPack && active) aiPack.textContent = generateAiReviewPackJson(active);
  const nextAction = app.querySelector(".next-action-panel h2");
  if (nextAction && active) nextAction.textContent = nextActionLabel(active.nextAction);
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  toast("Copied");
}

async function shareCase(active) {
  const text = generateHandoverNotes(active);
  if (navigator.share) {
    await navigator.share({ title: `AC triage ${active.leadNumber || active.customerName}`, text });
  } else {
    await copyText(text);
  }
}

function sendCustomerSms(active) {
  const number = String(active.contactNumber ?? "").replace(/[^\d+]/g, "");
  if (!number) {
    toast("No phone number");
    return;
  }
  window.location.href = `sms:${number}&body=${encodeURIComponent(generateCustomerRequestMessage(active))}`;
}

function sendCustomerEmail(active) {
  const email = String(active.customerEmail ?? "").trim();
  if (!email) {
    toast("No customer email");
    return;
  }
  const subject = `Air con triage details${active.leadNumber ? ` - ${active.leadNumber}` : ""}`;
  const body = generateCustomerRequestMessage(active);
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function saveImageFile(dataUrl, fileName) {
  const file = await dataUrlToFile(dataUrl, fileName);
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: fileName });
    return;
  }
  downloadDataUrl(dataUrl, fileName);
}

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || "image/png" });
}

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

function toast(message) {
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 1600);
}

function options(values, selected) {
  return values.map((value) => `<option value="${attr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(optionLabel(value))}</option>`).join("");
}

function nextActionLabel(value) {
  return ({
    send_customer_message: "Send customer message",
    wait_for_reply: "Wait for reply",
    review_again: "Review again",
    copy_handover_to_salesforce: "Copy handover to Salesforce",
  })[value] || "Review again";
}

function optionLabel(value) {
  if (!value) return "Auto";
  return nextActionLabel(value) === "Review again" && value !== "review_again"
    ? String(value).replace(/_/g, " ")
    : nextActionLabel(value);
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
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo";
}
