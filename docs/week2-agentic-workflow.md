# Week 2 Agentic Workflow

## Understand

Week 2 was scoped from the Week 1 documents.

Sources used:

- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/data-model.md`

The bounded behavior selected was request status transitions.

### Request States

- Pending
- In Progress
- Resolved
- Rejected
- Closed

### Valid Transitions

- Pending → In Progress
- Pending → Rejected
- In Progress → Resolved
- In Progress → Rejected
- Resolved → Closed

### Invariant

A Closed request cannot be modified.

The implementation is located in:

`backend/src/requests/`

The backend was first implemented with in-memory data and was later changed to use SQLite persistence.

## Direct

The existing Week 1 documentation and NestJS request module were inspected before implementation.

A bounded plan was created before code changes.

The implementation added:

- `GET /requests`
- `GET /requests/:id`
- `PATCH /requests/:id/status`
- validation of request status transitions
- HTTP 400 for invalid transitions
- HTTP 404 for missing requests

The plan was reviewed before implementation.

Later, SQLite was introduced to persist request state instead of keeping it only in memory.

The status update endpoint was also protected with a role-based guard.

## Prove



### Valid Transition

A valid request status transition was tested.

Example:

`Pending → In Progress`

Expected:

- request accepted
- HTTP 200
- status saved

Actual:

- request accepted
- status changed successfully
- status was stored in SQLite



### Persistence Verification

The backend was stopped and restarted after changing a request status.

Expected:

The updated status should remain after restarting the application.

Actual:

The updated status remained after restart.

SQLite persistence was successfully verified.

### Invalid Transition

An invalid status transition was tested.

Expected:

- HTTP 400
- request status should not change

Actual:

- HTTP 400 returned
- stored status remained unchanged



### Closed Request Invariant

A Closed request was used to test:

`Closed → In Progress`

Expected:

- HTTP 400
- Closed request must not change

Actual:

- request was rejected
- status remained Closed



## Boundary Protection Verification

The `PATCH /requests/:id/status` endpoint was protected with a role-based guard.

The caller provides a role using the `x-user-role` request header.

### Allowed Actor

An HR actor performed an allowed request status update.

Expected:

- request allowed
- status validation executed
- valid change saved

Actual:

- request succeeded



### Denied Actor

An Employee actor attempted to change a request status.

Expected:

`403 Forbidden`

Actual:

`403 Forbidden`

The stored request status did not change.

### Missing Actor

A request was sent without the `x-user-role` header.

Expected:

`403 Forbidden`

Actual:

`403 Forbidden`

### Unknown Actor

A request was sent with an unknown role.

Expected:

`403 Forbidden`

Actual:

`403 Forbidden`

### Authorized Actor With Invalid Transition

An authorized actor attempted an invalid status transition.

Expected:

`400 Bad Request`

Actual:

`400 Bad Request`

The stored request status did not change.

## Result

The implementation now proves that:

- valid request transitions succeed
- invalid request transitions are rejected
- Closed requests cannot be modified
- request state is persisted using SQLite
- authorized actors can update request status
- unauthorized, missing, and unknown actors are rejected
- failed requests do not modify persistent state

