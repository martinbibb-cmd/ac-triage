# Air Con Triage

Air Con Triage is a local-first guided workflow for air-conditioning case intake, evidence review, customer calls, and Salesforce handover notes.

The form is the primary intelligence. The app asks what evidence is already available, narrows the remaining questions deterministically, and keeps AI review as an optional support action under **Advanced / AI review**.

## Workflow

1. Create a case or import a portable case JSON.
2. Paste Salesforce text and extract lead/customer details where possible.
3. Correct case details manually and record quoted package, indoor-unit count, install/planning details, and photos.
4. Use **Evidence** to mark each evidence category as confirmed, missing, unclear, not applicable, awaiting customer, or awaiting internal clarification.
5. Use **Customer call** during a live call. It shows only customer-solvable outstanding questions with large quick-action controls.
   You can also copy a plain-text CALL-E prompt from this screen for an ad hoc connector call using the same unanswered questions.
6. Use **Outstanding** to separate customer questions, customer photos, internal technical clarification, BG/admin issues, and surveyor review.
7. Use **Handover** to copy the Salesforce handover note, customer follow-up message, internal questions, and manager completion message.

The app always surfaces the current status and next action at the top of an open case.

## Local Storage

Cases autosave to IndexedDB in the browser. Photos are resized locally before storage to reduce Safari memory pressure. There is no backend, login, or cloud sync.

IndexedDB data is local to the browser profile and device. iPad/iPhone Safari may remove local site data under storage pressure, so use portable export for important cases.

## Export And Import

The default JSON export is lightweight and versioned:

- schema version
- case details
- answers
- evidence states
- indoor and outdoor unit records
- customer replies
- timeline
- generated outputs
- timestamps
- completion status
- photo metadata

Full image data is not embedded in the default JSON export.

The ZIP export contains `case.json` plus original photos and annotated photos where present. File names follow the pattern:

- `AC-50773906-Smith-triage.json`
- `AC-50773906-Smith-triage.zip`

Imported cases are validated through the schema migration path. Older round-trip style cases and review packs are migrated where practical.

CALL-E call result JSON can be pasted into the Advanced import box. The app stores the call summary/transcript, applies structured answers where possible, and re-runs the deterministic outstanding-question logic.

## Optional AI Review

AI review is optional. The app remains fully usable without AI.

AI can review the evidence pack, identify possible missing evidence, propose customer wording, and propose photo annotations. AI suggestions that would alter existing confirmed data are stored as pending suggestions and require explicit acceptance.

AI does not determine workflow state, replace the deterministic question engine, or silently overwrite confirmed values.

## Supported Browsers

The app is a static browser app designed for current iPad/iPhone Safari and desktop browsers that support ES modules, IndexedDB, service workers, file inputs, canvas image resizing, and Blob downloads.

Known iPad limitations:

- Local browser storage is not a durable backup.
- Large photo sets can still hit memory limits despite resizing.
- Service worker caches may need a browser refresh after deployment.
- File download/import behavior depends on Safari and iOS file handling.

## Run Locally

```sh
npm run serve
```

Then open `http://localhost:4173`.

If PowerShell blocks `npm.ps1`, run the static server directly with an available local HTTP server.

## Test

```sh
node --test tests/*.test.js
```

The project uses plain ES modules and Node's built-in test runner. There is no framework or build step.

## Publish With GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, open **Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)`.
5. Save.
