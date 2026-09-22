# Week 4 Release Readiness

## Goal

This document prepares the Internal Operations Service Hub for release by identifying the commands, configuration, secrets, automated checks, release evidence, and local assumptions that could affect whether the same code works correctly in another environment.

No CI/CD pipeline, cloud deployment, or infrastructure redesign is required for this task.

## 1. Build and Run Commands

### Backend

Install dependencies:

```powershell

cd backend

npm.cmd install

```

Run in development mode:

```powershell

npm.cmd run start:dev

```

Build:

```powershell

npm.cmd run build

```

Run all backend tests:

```powershell

npm.cmd test

```

Run the AI evaluation suite:

```powershell

npm.cmd run eval:ai

```

### Frontend

Install dependencies:

```powershell

cd frontend

npm.cmd install

```

Run in development mode:

```powershell

npm.cmd run dev

```

Build:

```powershell

npm.cmd run build

```

Preview the production build locally:

```powershell

npm.cmd run preview

```

## 2. Environment-Specific Values

The application currently depends on several values that can change between environments.

### Backend Port

The NestJS backend normally runs on:

```text

3000

```

The backend also supports a runtime `PORT` environment variable.

Example:

```powershell

$env:PORT="3300"

npm.cmd run start:dev

```

If the backend port changes, anything calling the backend must use the same port.

### Frontend API URL

The frontend currently calls the backend using:

```text

[http://localhost:3000](http://localhost:3000)

```

This is an environment-specific value.

If the backend is started on another port, for example:

```text

3301

```

while the frontend still expects:

```text

3000

```

the application can fail even though the source code and backend build are unchanged.

Possible symptoms include:

```text

Failed to fetch

Connection refused

```

This is a configuration failure, not necessarily a product-code failure.

### Frontend Development Port

The frontend normally runs on:

```text

[http://localhost:5173](http://localhost:5173)

```

The backend CORS configuration currently allows this frontend origin.

If the frontend origin changes, the backend CORS configuration may also need to change.

### AI Provider Selection

The AI-assisted Request Intake can use OpenRouter when:

```text

AI_PROVIDER=openrouter

```

is configured.

If this value is not present, the application uses the local deterministic provider.

## 3. Possible Secrets

The main secret used by the application is:

```text

OPENROUTER_API_KEY

```

Example configuration:

```powershell

$env:OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"

```

The actual value must never be:

- committed to GitHub

- hardcoded in TypeScript

- stored in README files

- stored in test files

- shared in screenshots

- printed in logs

Only the environment variable name should appear in source control.

Before release, verify that no real API key exists in the Git history or tracked files.

## 4. Existing Automated Checks

The project already contains automated checks that can be used before creating a release candidate.

### Backend Test Suite

Run:

```powershell

npm.cmd test

```

Current verified result:

```text

13 tests passed

```

The suite protects:

- request status business rules

- authorization

- SQLite persistence

- backend/database integration

- end-to-end API behavior

- AI-assisted request intake behavior

### AI Evaluation Suite

Run:

```powershell

npm.cmd run eval:ai

```

Current verified result:

```text

6 tests passed

```

The AI evaluation covers:

- clear IT request

- clear HR request

- thin input

- ambiguous input

- invalid empty input

- bounded product-owned output

### Backend Build

Run:

```powershell

npm.cmd run build

```

The backend build must complete successfully.

### Frontend Build

From the frontend folder:

```powershell

npm.cmd run build

```

The frontend build must also complete successfully.

## 5. Evidence Needed for a Release Candidate

A release candidate should not be considered ready only because the application starts once.

The following evidence should be collected.

### Source Control Evidence

Confirm:

```powershell

git status

```

shows:

```text

nothing to commit, working tree clean

```

Confirm the correct branch is synchronized with GitHub.

### Backend Evidence

Confirm:

- dependencies install successfully

- backend build passes

- all backend tests pass

- AI evaluation passes

- backend starts successfully

### Frontend Evidence

Confirm:

- dependencies install successfully

- frontend build passes

- frontend starts successfully

- frontend can load requests from the backend

### Functional Smoke Check

Verify at least one real user-facing flow.

For example:

1. Start the backend.

2. Start the frontend.

3. Load the requests list.

4. Change a request through a valid status transition.

5. Confirm the result is persisted.

6. Test the Request Intake suggestion endpoint.

7. Confirm an invalid role is still rejected.

### Configuration Evidence

Record the configuration used during verification, including:

- backend port

- frontend origin

- frontend API URL

- AI provider selection

Do not record secret values.

### Failure Evidence

Confirm that expected failures remain controlled.

Examples:

- invalid status transition is rejected

- unauthorized role receives 403

- empty request-intake input receives 400

- AI provider failure receives 503

- frontend displays an understandable error when the backend cannot be reached

## 6. Hardcoded Local Assumptions

The current project contains some assumptions that work locally but must be reviewed before release.

### Backend URL in Frontend

The frontend currently assumes:

```text

[http://localhost:3000](http://localhost:3000)

```

for the backend.

This means a backend running on another hostname or port will not automatically be discovered.

### CORS Origin

The backend currently allows:

```text

[http://localhost:5173](http://localhost:5173)

```

as the frontend origin.

This is appropriate for the current local development environment but is environment-specific.

### SQLite Database Path

The backend uses a local SQLite database:

```text

data/service-hub.db

```

This assumes the application can write to a local filesystem.

The database file is intentionally excluded from Git.

### Local AI Fallback

If OpenRouter configuration is not present, the application uses the deterministic local intake provider.

This is useful for development and repeatable tests, but a release using the real AI path must explicitly configure:

```text

AI_PROVIDER=openrouter

OPENROUTER_API_KEY

```

### [Localhost](http://Localhost) Assumption

The frontend and backend are currently designed around local development using:

```text

[localhost](http://localhost)

```

A non-local environment would need the API URL and allowed frontend origin to be configured appropriately.

## Release Configuration Example

A backend can be started on a different port without modifying product source code.

Example:

```powershell

$env:PORT="3300"

npm.cmd run start:dev

```

If the frontend still calls:

```text

[http://localhost:3000](http://localhost:3000)

```

the frontend will fail to connect.

The correct response is to restore or update the environment configuration, not to change unrelated product logic.

## Configuration Failure Proof

A controlled environment mismatch was tested.

The backend was started on:

```text

[http://localhost:3301](http://localhost:3301)

```

while the frontend continued calling:

```text

[http://localhost:3000](http://localhost:3000)

```

Result:

- frontend started successfully

- backend started successfully

- frontend could not reach the backend

- the user-facing flow failed because of configuration mismatch

The backend was then restored to:

```text

[http://localhost:3000](http://localhost:3000)

```

After refreshing the frontend, the application worked again.

This proves that:

```text

same code + wrong environment configuration = failed release

```

and:

```text

restored configuration = recovered application

```

No product logic change was required.

## Release Readiness Principle

A successful startup or one successful smoke test is not enough to prove that a system remains healthy.

Release readiness requires evidence across:

- build

- configuration

- secrets

- tests

- user-facing behavior

- expected failure behavior

A failure caused by environment configuration should be diagnosed at the configuration layer instead of immediately changing application code.

The same code can succeed or fail depending on the environment in which it runs.

