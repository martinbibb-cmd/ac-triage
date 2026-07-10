# Case Schema

Current schema version: `2`

Portable case export schema: `bg.ac_triage.case.v2`

## Top-Level Shape

```json
{
  "schema": "bg.ac_triage.case.v2",
  "schemaVersion": 2,
  "exportedAt": "2026-07-10T00:00:00.000Z",
  "caseDetails": {},
  "lead": {},
  "answers": {},
  "evidenceStates": {},
  "indoorUnits": [],
  "outdoorUnit": {},
  "electrical": {},
  "customerReplies": [],
  "timeline": [],
  "generatedOutputs": {},
  "timestamps": {},
  "completionStatus": {},
  "photoMetadata": [],
  "status": "customer_contact_required",
  "legacy": {}
}
```

## Local Case Data

Local IndexedDB cases use the same core schema but may additionally include browser-local image fields:

- `photos[].dataUrl`
- `photos[].thumbDataUrl`
- `photos[].annotatedDataUrl`
- `photos[].annotatedThumbDataUrl`

These fields are deliberately omitted from lightweight JSON export.

## Case Details

`caseDetails` contains:

- `quotedPackage`
- `indoorUnitCount`
- `planningStatus`
- `installDate`

Lead/customer fields are stored under `lead` in portable export and as top-level fields locally for compatibility with the original app.

## Evidence States

`evidenceStates` is a map keyed by evidence item ID:

```json
{
  "consumer_unit_photo": {
    "state": "missing",
    "notes": "",
    "updatedAt": ""
  }
}
```

Allowed states:

- `confirmed`
- `missing`
- `unclear`
- `not_applicable`
- `awaiting_customer`
- `awaiting_internal_clarification`

## Indoor Units

Each indoor unit has a stable `id` and fields for:

- `room`
- `roomSize`
- `agreedLocation`
- `wallConstruction`
- `pipeRoute`
- `trunkingColour`
- `trunkingOther`
- `nearestSocket`
- `accessDetails`
- `notes`

Multi-split cases use multiple indoor-unit records and one shared outdoor-unit record.

## Outdoor Unit

The shared outdoor-unit record contains:

- `location`
- `mounting`
- `route`
- `clearances`
- `access`
- `condensateRoute`
- `notes`

## Migration

Legacy round-trip cases are migrated by `migrateCaseToCurrent()`.

Migration preserves:

- original lead/customer fields
- pasted Salesforce text
- room data
- outside-unit data
- photos and photo metadata
- AI review rounds
- customer replies
- generated timeline data where possible
- legacy status metadata

Legacy review packs using `bg.ac_triage.review_pack.v1` can be imported into schema version 2 where practical.

Older or unknown imports should fail visibly or be migrated through the conservative fallback path. They must not silently disappear.

## AI Suggestions

AI result imports are not treated as authoritative case data. If an AI value conflicts with an existing value, the app creates a pending suggestion:

```json
{
  "path": "leadNumber",
  "currentValue": "50773906",
  "proposedValue": "99999999",
  "status": "pending",
  "requiresAcceptance": true
}
```

The user must explicitly accept or reject the suggestion.
