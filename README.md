# Air Con Triage

A simple offline-first PWA for air con installation triage and handover notes.

It is designed for iPad/iPhone use through Safari and can be published directly with GitHub Pages. There is no login, cloud sync, or backend in v1. Cases and photos are stored locally in the browser using IndexedDB.

## Features

- Create local triage cases
- Capture lead/customer/address/contact details
- Track the job stage with simple dropdowns
- Guided install checklist
- Room/unit form with automatic SMALL / MED / LARGE unit suggestion
- Separate outside unit section
- Built-in Climate 3200i reference for clearances and unit dimensions
- Customer call questions generated only from missing information
- Copy short Salesforce-ready handover notes
- Upload/import photos
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
