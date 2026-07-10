# Question Catalogue

Question definitions live in `src/domain.js` as `QUESTION_DEFINITIONS`. They are plain serialisable objects so the rule engine remains deterministic and testable.

Each definition contains:

- `id`
- `category`
- `customerQuestion`
- `internalLabel`
- `why`
- `whoUsesAnswer`
- `requiredWhen`
- `completeWhen`
- `resolverType`
- `rationaleConfidence`

Rationale confidence values:

- `confirmed`
- `suspected`
- `unknown`

When the technical reason is not known, the reason is exactly:

`Reason not yet confirmed`

## Initial Catalogue Notes

| Question | Reason | Confidence |
| --- | --- | --- |
| Room size | Supports equipment suitability review. | confirmed |
| Outdoor location | Supports mounting, access and clearance review. | confirmed |
| Pipe route | Supports installation route, materials and appearance review. | confirmed |
| Trunking colour | Customer preference. | confirmed |
| Nearest internal socket | Reason not yet confirmed | unknown |
| Spare RCD/RCBO way | Reason not yet confirmed | unknown |
| Visible earth | Reason not yet confirmed | unknown |

Unknown rationale must remain unknown until a confirmed process or technical source is added.

## Branching Rules

The rule engine evaluates `requiredWhen` and `completeWhen` arrays. Conditions refer to case fields or evidence states.

Examples:

- Indoor pipe-route questions require an indoor-unit location.
- Indoor wall-photo requests require an indoor-unit location.
- Outdoor photo and clearance questions require an outdoor-unit location.
- Multi-split jobs evaluate indoor-unit scoped questions separately while keeping one shared outdoor-unit record.
- Missing required photos produce photo requests instead of repeated technical questions that cannot be answered.

The engine does not call an LLM and does not use free-form model output to decide completeness.
