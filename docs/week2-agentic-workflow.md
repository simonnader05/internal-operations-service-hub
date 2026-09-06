# Week 2 Agentic Workflow

## Understand

Week 2 was scoped from the Week 1 documents, not from a new product discussion.

Week 1 sources used:

- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/data-model.md`

Those files already define request tracking and a status list. The bounded behavior chosen for this week is **request status transitions** only.

States:

- Pending
- In Progress
- Resolved
- Rejected
- Closed

Valid transitions:

- Pending → In Progress
- Pending → Rejected
- In Progress → Resolved
- In Progress → Rejected
- Resolved → Closed

Invariant: a Closed request cannot be modified.

Implementation area: the existing NestJS `requests` module (`backend/src/requests/`), using in-memory data.

Non-goals for this week: frontend, database, authentication, AI agent, notifications, and any extra HR or IT features.

## Direct

The existing docs and request-module files were inspected first. No code was changed during that step.

A short implementation plan was written next: GET endpoints to view requests, PATCH to change status, HTTP 400 for invalid transitions, HTTP 404 when a request does not exist.

That plan was reviewed and approved before any implementation. After approval, only the agreed status-transition behavior was added.

## Prove

Checks use the in-memory seed data:

| ID | Starting status |
| --- | --- |
| `1` | Pending |
| `2` | In Progress |
| `4` | Rejected |
| `5` | Closed |
| `999` | does not exist |

These HTTP checks were not executed in this write-up. Fill in **Actual** after running them against a running backend.

### Valid transitions

**Pending → In Progress**

- Request: `PATCH /requests/1/status` with `{ "status": "In Progress" }`
- Expected: HTTP 200; request `1` status is `In Progress`
- Actual: _not run_

**In Progress → Resolved**

- Request: `PATCH /requests/2/status` with `{ "status": "Resolved" }`
- Expected: HTTP 200; request `2` status is `Resolved`
- Actual: _not run_

### Invalid transitions

**Pending → Closed**

- Request: `PATCH /requests/1/status` with `{ "status": "Closed" }` (while request `1` is still Pending)
- Expected: HTTP 400; status stays `Pending`
- Actual: _not run_

**Rejected → Resolved**

- Request: `PATCH /requests/4/status` with `{ "status": "Resolved" }`
- Expected: HTTP 400; status stays `Rejected`
- Actual: _not run_

### Missing request

- Request: `GET /requests/999` or `PATCH /requests/999/status`
- Expected: HTTP 404
- Actual: _not run_

### Invariant verification

A Closed request cannot be modified.

- Request: `PATCH /requests/5/status` with `{ "status": "In Progress" }`
- Expected: HTTP 400 with a closed-request error; `GET /requests/5` still returns `Closed`
- Actual: _not run_
