import {
  CHECKLIST,
  JOB_STAGES,
  TRUNKING_COLOURS,
  createEmptyCase,
  createEmptyRoom,
  generateHandoverNotes,
  generateMissingQuestions,
  suggestUnitSize,
} from "./domain.js";
import { deleteCase, loadCases, saveCase } from "./storage.js";

const app = document.querySelector("#app");

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
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
  }
  state.cases = await loadCases();
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
        <p class="eyebrow">Offline PWA</p>
        <h1>Air Con Triage</h1>
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
      <button class="primary" data-action="copy-notes">Copy handover notes</button>
      <button data-action="copy-form">Copy completed form</button>
      <button data-action="share-case">Share / export</button>
      <button class="danger" data-action="delete-case">Delete</button>
    </div>

    <div class="grid two">
      <section class="panel">
        <h2>Case details</h2>
        <label>Lead number<input data-field="leadNumber" value="${attr(item.leadNumber)}"></label>
        <label>Customer name<input data-field="customerName" value="${attr(item.customerName)}"></label>
        <label>Address<textarea data-field="address">${escapeHtml(item.address)}</textarea></label>
        <label>Contact number<input data-field="contactNumber" value="${attr(item.contactNumber)}"></label>
        <label>Property type<input data-field="propertyType" value="${attr(item.propertyType)}"></label>
        <label>Job stage
          <select data-field="jobStage">${options(JOB_STAGES, item.jobStage)}</select>
        </label>
        <label>Install date<input data-field="installDate" value="${attr(item.installDate)}"></label>
        <label>Planning date<input data-field="planningDate" value="${attr(item.planningDate)}"></label>
      </section>

      <section class="panel">
        <h2>Customer call questions</h2>
        <div class="questions">
          ${questionList(item)}
        </div>
        <button data-action="copy-questions">Copy questions</button>
      </section>
    </div>

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
      <div class="panel-head">
        <h2>Photos and markup</h2>
        <label class="file-button">
          Add photos
          <input type="file" accept="image/*" capture="environment" multiple data-action="add-photos">
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
        <label>External unit location<textarea data-room-field="externalLocation" data-room="${room.id}">${escapeHtml(room.externalLocation)}</textarea></label>
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

function photoCard(photo) {
  return `
    <article class="photo-card">
      <img src="${attr(photo.annotatedDataUrl || photo.dataUrl)}" alt="${attr(photo.name)}">
      <div class="photo-actions">
        <button data-action="edit-photo" data-photo="${photo.id}">Markup</button>
        <button data-action="save-gallery" data-photo="${photo.id}">Save to gallery</button>
        <button class="danger" data-action="remove-photo" data-photo="${photo.id}">Remove</button>
      </div>
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
  app.querySelectorAll("[data-room-field]").forEach((field) => {
    field.addEventListener("input", updateRoomField);
    field.addEventListener("change", updateRoomField);
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
  if (action === "copy-notes" || action === "copy-form") {
    await copyText(generateHandoverNotes(active));
  }
  if (action === "copy-questions") {
    await copyText(generateMissingQuestions(active).join("\n") || "No missing customer questions.");
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

async function handlePhotoUpload(event) {
  const active = selectedCase();
  const files = [...event.target.files];
  const photos = await Promise.all(files.map(readPhotoFile));
  active.photos.push(...photos);
  await persistActive(active);
}

async function readPhotoFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      id: crypto.randomUUID(),
      name: file.name,
      dataUrl: reader.result,
      annotatedDataUrl: "",
      marks: [],
    });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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
  photo.annotatedDataUrl = canvas.toDataURL("image/png");
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

function renderSoft() {
  const preview = app.querySelector(".notes-preview");
  const questions = app.querySelector(".questions");
  const active = selectedCase();
  if (preview && active) preview.textContent = generateHandoverNotes(active);
  if (questions && active) questions.innerHTML = questionList(active);
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
  return values.map((value) => `<option value="${attr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value || "Auto")}</option>`).join("");
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
