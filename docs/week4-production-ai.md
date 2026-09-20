# Week 4 Production AI

## Goal

Week 4 adds one bounded AI-assisted capability to the existing Internal Operations Service Hub.

The capability helps interpret an employee's free-text request and suggests:

- service area
- category
- title

The AI does not create requests, update request status, approve requests, or write directly to SQLite.

## Capability

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

## AI Provider

The project contains a real OpenRouter AI provider.

The OpenRouter provider is used when:

```text

AI_PROVIDER=openrouter

```

and:

```text

OPENROUTER_API_KEY

```

is configured.

The configured OpenRouter model route is:

```text

openrouter/free

```

For deterministic local development and automated testing, the system also contains a local provider.

The local provider is a fallback and testing mechanism.

The real AI path uses OpenRouter.

## AI Boundary

### Context Sent to the AI

The AI receives the employee's free-text request.

Example:

```json

{

  "requestText": "I cannot access my email account"

}

```

The provider prompt also contains product-owned allowed service areas and categories so the AI can return a bounded structured candidate.

### Context Not Sent

The AI does not receive:

- database records
- internal request IDs
- authorization state
- workflow history
- approval state
- SQLite contents
- unrelated employee data

This keeps the AI context small and bounded.

## Product-Owned Values

Allowed service areas:

- HR
- IT

Allowed HR categories:

- Annual Leave
- Payroll Inquiry
- Employment Certificate
- Overtime
- HR Inquiry

Allowed IT categories:

- Hardware Issue
- Software Installation
- Access Request
- Password/Account Issue
- Email Issue

The AI may suggest values, but the backend owns the allowed values.

## Validation

AI output is treated as untrusted input.

The backend validates:

- service area
- category
- title

If the AI returns an unsupported service area, the backend rejects it.

If the AI returns an unsupported category, the backend rejects it.

If the AI returns an empty title, the backend rejects it.

The final API response is reconstructed by the backend from validated fields.

## Authority

The AI is advisory only.

It cannot:

- create a Service Request
- update a Service Request
- change request status
- approve a request
- reject a request
- close a request
- write directly to SQLite

Only product-owned backend logic can perform persistent state changes.

## Failure Handling

### Empty Input

Example:

```json

{

  "requestText": ""

}

```

Expected result:

```text

400 Bad Request

```

The backend rejects empty employee input.

### Invalid AI Output

If the provider returns an invalid product value, the backend rejects it.

Example invalid candidate:

```json

{

  "serviceArea": "Finance",

  "category": "Investment Request",

  "title": "Buy shares"

}

```

Expected result:

```text

400 Bad Request

```

### Provider Failure

If OpenRouter or another provider fails, the backend returns:

```text

503 Service Unavailable

```

with the stable message:

```text

Request suggestion is temporarily unavailable

```

The failure does not create or modify a Service Request.

## AI Evaluation Cases

The AI evaluation suite contains six representative cases.

### Case 1 - Clear IT Request

Input:

```text

My laptop will not start

```

Expected bounded result:

```text

IT / Hardware Issue

```

### Case 2 - Clear HR Request

Input:

```text

I need an employment certificate

```

Expected bounded result:

```text

HR / Employment Certificate

```

### Case 3 - Thin Input

Input:

```text

Password

```

Expected bounded result:

```text

IT / Password/Account Issue

```

### Case 4 - Ambiguous Input

Input:

```text

I need help with my account

```

Expected behavior:

The application returns a bounded service area, valid category, and valid title.

### Case 5 - Invalid Empty Input

Input:

```text

(empty)

```

Expected result:

```text

400 Bad Request

```

### Case 6 - Product-Owned Output

Input:

```text

Please install software on my laptop

```

Expected output contains only:

- `serviceArea`
- `category`
- `title`

## Repeatable AI Evaluation Command

From the backend folder:

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

## Deterministic Tests

The original Operations Hub tests remain green.

Run:

```bash

npm test

```

On Windows PowerShell:

```powershell

npm.cmd test

```

The backend test suite covers:

- request status business rules
- SQLite persistence
- authorization boundaries
- end-to-end API behavior
- request intake behavior
- AI evaluation cases

Current verification:

```text

13 tests passed

```

## Build Verification

Run:

```bash

npm run build

```

On Windows PowerShell:

```powershell

npm.cmd run build

```

The backend builds successfully.

## Real AI Verification

To run the real OpenRouter path in Windows PowerShell:

```powershell

$env:AI_PROVIDER="openrouter"

$env:OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"

npm.cmd run start:dev

```

Then, from another PowerShell window:

```powershell

Invoke-RestMethod -Uri "http://localhost:3000/request-intake/suggest" -Method POST -ContentType "application/json" -Body '{"requestText":"My laptop keeps crashing and I cannot work"}'
```

A successful response returns a validated structured suggestion from the real AI provider.

The API key must never be committed to the repository.

## Result

Week 4 adds one bounded AI-assisted capability to the same Internal Operations Service Hub repository.

The implementation demonstrates:

- real AI provider integration
- minimum necessary AI context
- structured AI output
- backend validation
- stable provider failure handling
- deterministic automated testing
- repeatable AI evaluation
- unchanged software authority over persistence and workflow

AI is advisory. Software and human authority remain final.