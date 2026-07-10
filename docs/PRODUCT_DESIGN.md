# Product Design

## Purpose

Air Con Triage is a local-first guided evidence workflow for air-conditioning installation triage. It is intended for iPad/iPhone Safari use during intake, evidence review, customer calls, and Salesforce handover.

The product direction is form-first. AI review is optional support, not the main workflow.

## Core Questions

The app should always make these visible:

- What do we already know?
- What remains unknown?
- Who can resolve each unknown?
- What is the next action?
- Is the case ready for Salesforce handover?

## Top-Level Screens

- **Cases**: local case list.
- **Intake**: Salesforce text, extracted details, quoted package, indoor-unit count, install/planning details, and photo upload.
- **Evidence**: evidence-state inventory, indoor/outdoor records, and currently relevant deterministic questions.
- **Customer call**: only customer-solvable outstanding items, with large quick actions.
- **Outstanding**: grouped unresolved items by resolver.
- **Handover**: copy-only output boxes for Salesforce, customer, internal, and manager messages.
- **Advanced / AI review**: optional AI prompt, review pack, ZIP export, and explicit suggestions.

## Statuses

- `not_started`
- `evidence_review`
- `customer_contact_required`
- `awaiting_customer`
- `internal_clarification_required`
- `ready_for_handover`
- `completed`

Status and next action are calculated deterministically from the current case and evidence state. AI output does not set core workflow state.

## Evidence States

Every evidence item supports:

- `confirmed`
- `missing`
- `unclear`
- `not_applicable`
- `awaiting_customer`
- `awaiting_internal_clarification`

## Resolver Groups

Outstanding items are separated into:

- Customer questions
- Customer photos required
- Internal technical clarification
- BG/admin issue
- Surveyor review
- Complete

Internal technical uncertainty is not included in the customer follow-up message.

## AI Boundaries

AI may:

- review completed evidence packs
- identify possible missing evidence
- propose customer wording
- propose photo annotations

AI must not:

- overwrite confirmed answers silently
- determine core workflow state
- invent facts
- replace deterministic question evaluation

Changes proposed by AI are imported as explicit suggestions when they alter existing case data.
