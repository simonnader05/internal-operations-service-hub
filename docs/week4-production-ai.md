# Week 4 Production AI

## Goal

Week 4 adds one bounded AI-assisted capability to the existing Internal Operations Service Hub.

The AI-assisted capability helps interpret an employee's free-text request and suggests:

- service area
- category
- title

The AI does not create requests, update request status, approve requests, or write directly to SQLite.

## AI Boundary

### Context Sent to the AI

Only the employee's free-text request is used.

Example:

```json

{

  "requestText": "My laptop will not start"

}
```

