# Internal Operations Service Hub

A full-stack internal operations application built for AI Academy 2026.

The project demonstrates:

- React frontend
- NestJS backend
- TypeORM
- SQLite persistence
- Automated testing with Vitest
- AI-assisted request intake using OpenRouter

## Project Structure

```text

internal-operations-service-hub/

├── backend/

├── frontend/

├── decisions/

├── docs/

└── [README.md](http://README.md)

```

## Core Request Workflow

Service Requests use the following statuses:

- Pending
- In Progress
- Resolved
- Rejected
- Closed

Valid transitions:

- Pending -> In Progress
- Pending -> Rejected
- In Progress -> Resolved
- In Progress -> Rejected
- Resolved -> Closed

Closed requests cannot be modified.

## Backend

The backend is built with NestJS and TypeORM.

SQLite is used for local persistence.

Backend folder:

```text

backend/

```

Install dependencies:

```bash

cd backend

npm install

```

On Windows PowerShell:

```powershell

cd backend

npm.cmd install

```

Start the backend:

```bash

npm run start:dev

```

On Windows PowerShell:

```powershell

npm.cmd run start:dev

```

The backend runs on:

```text

[http://localhost:3000](http://localhost:3000)

```

## Frontend

The frontend is built with React and Vite.

Frontend folder:

```text

frontend/

```

Install dependencies:

```bash

cd frontend

npm install

```

On Windows PowerShell:

```powershell

cd frontend

npm.cmd install

```

Start the frontend:

```bash

npm run dev

```

On Windows PowerShell:

```powershell

npm.cmd run dev

```

The frontend runs on:

```text

[http://localhost:5173](http://localhost:5173)

```

## Request API

### Get all requests

```http

GET /requests

```

### Get one request

```http

GET /requests/:id

```

### Update request status

```http

PATCH /requests/:id/status

```

The status endpoint uses the `x-user-role` header.

Allowed roles:

- HR
- IT
- Manager

Employee, missing, or unknown roles are rejected.

## Week 4 AI-Assisted Request Intake

Week 4 adds one bounded AI-assisted Request Intake capability to the existing Operations Hub.

The capability receives employee free text and returns a structured suggestion containing:

- `serviceArea`
- `category`
- `title`

Endpoint:

```http

POST /request-intake/suggest

```

Example request:

```json

{

  "requestText": "My laptop will not start"

}

```

Example response:

```json

{

  "serviceArea": "IT",

  "category": "Hardware Issue",

  "title": "Laptop will not start"

}

```

The AI is advisory only.

It cannot:

- create requests
- update request status
- approve requests
- reject requests
- write directly to SQLite
- bypass backend business rules

The backend validates the AI candidate before returning the final result.

## AI Provider

The project supports OpenRouter as the real AI provider.

The real AI path is enabled when these environment variables are set:

```text

AI_PROVIDER=openrouter

OPENROUTER_API_KEY=<your key>

```

Example for Windows PowerShell:

```powershell

$env:AI_PROVIDER="openrouter"

$env:OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"

npm.cmd run start:dev

```

Do not commit API keys to GitHub.

When OpenRouter is not configured, the application uses the local deterministic provider so local development and automated tests remain repeatable.

## AI Evaluation

The Week 4 evaluation suite covers:

- clear IT input
- clear HR input
- thin input
- ambiguous input
- invalid input
- bounded product-owned output

Run the AI evaluation from the backend folder:

```bash

npm run eval:ai

```

On Windows PowerShell:

```powershell

npm.cmd run eval:ai

```

Expected result:

```text

6 tests passed

```

## Automated Tests

Run all backend tests:

```bash

npm test

```

On Windows PowerShell:

```powershell

npm.cmd test

```

The tests cover:

- business rules
- request status transitions
- SQLite integration
- authorization
- end-to-end API behavior
- request intake
- AI evaluation cases

Current verification:

```text

13 tests passed

```

## Build

Build the backend with:

```bash

npm run build

```

On Windows PowerShell:

```powershell

npm.cmd run build

```

## Week 3 Evidence

```text

docs/[week3-full-stack-delivery.md](http://week3-full-stack-delivery.md)

```

## Week 4 Evidence

```text

docs/[week4-production-ai.md](http://week4-production-ai.md)

```

## Architecture Principle

The application keeps authority inside the software.

The AI may suggest structured values, but the backend remains responsible for:

- validation
- authorization
- persistence
- workflow rules
- state changes

AI is advisory. Software and human authority remain final.