# Air Con Triage

A simple browser app for round-tripping air con triage packs through GPT/Gemini.

It is designed for iPad/iPhone use through Safari and can be published directly with GitHub Pages. There is no login, cloud sync, Salesforce integration, or backend in v1. Cases and photos are stored locally in the browser using IndexedDB for convenience, but offline mode is not a product requirement.

## Features

- Paste raw Salesforce/job/customer details first
- Add Salesforce photos before creating the AI pack
- Send the AI prompt plus JSON/photos to GPT/Gemini
- Paste the AI JSON response back into the app
- Send the customer message only after the AI response asks for one
- Add the customer reply and any new photos, then create the next AI pack
- Copy a clean compact JSON AI review pack
- Copy full JSON with embedded compressed images when needed
- Download review pack ZIP with `review-pack.json` and photo files
- Copy a strict AI review prompt for GPT/Gemini
- Populate extracted lead, room, outside unit, customer message, and handover fields from AI JSON
- Apply structured AI photo annotations when the AI returns normalized coordinates
- Preserve multiple AI review rounds per lead
- Preserve customer replies and newly supplied photo references
- Show the next action: send customer message, wait for reply, review again, or copy handover to Salesforce
- Add a customer reply and export the next JSON review pack
- Keep manual lead/room/outside-unit fields available under advanced edits
- One-tap customer SMS/email draft for missing data requests
- Copy short Salesforce-ready handover notes
- Photos are resized locally before storage to reduce iPad Safari memory pressure
- Manual photo markup remains available for:
  - point-to-point pipe route lines
  - indoor unit boxes
  - outdoor unit boxes
  - room outline boxes
  - text labels
- Save annotated images
- Share/export case text

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
