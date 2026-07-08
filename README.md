# Air Con Triage

A simple browser app for building structured air con triage review packs.

It is designed for iPad/iPhone use through Safari and can be published directly with GitHub Pages. There is no login, cloud sync, Salesforce integration, or backend in v1. Cases and photos are stored locally in the browser using IndexedDB for convenience, but offline mode is not a product requirement.

## Features

- Create local triage cases
- Paste raw Salesforce/job details
- Copy a clean JSON AI review pack
- Copy full JSON with embedded compressed images
- Download review pack ZIP with `review-pack.json` and photo files
- Paste AI JSON result back into the lead
- Copy an AI review prompt for GPT/Gemini
- Preserve multiple AI review rounds per lead
- Preserve customer replies and newly supplied photo references
- Show the next action: send customer message, wait for reply, review again, or copy handover to Salesforce
- Upload photos separately into GPT/Gemini using the generated photo manifest
- Capture lead/customer/address/contact details
- Track the job stage with simple dropdowns
- Guided install checklist
- Room/unit form with automatic SMALL / MED / LARGE unit suggestion
- Separate outside unit section
- Built-in Climate 3200i reference for clearances and unit dimensions
- Customer call questions generated only from missing information
- One-tap customer SMS/email draft for missing data requests
- Fast workflow checklist for the triage process
- Copy short Salesforce-ready handover notes
- Upload/import photos
- Photos are resized locally before storage to reduce iPad Safari memory pressure
- Mark up photos with:
  - point-to-point pipe route lines
  - indoor unit boxes
  - outdoor unit boxes
  - room outline boxes
  - text labels
- Save annotated images
- Share/export case text
- Works offline after first load

## Run locally

```sh
npm run serve
```

Then open `http://localhost:4173`.

## Test

```sh
npm test
```

## Publish with GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, open **Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)`.
5. Save.

The app is static, so no build step is required.
