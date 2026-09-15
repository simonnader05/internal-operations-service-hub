# Week 3 Full-Stack Delivery

## Goal

Week 3 focused on replacing manual verification with automated confidence.

The existing request-status slice was kept unchanged:

- NestJS backend

- SQLite persistence

- role-based boundary protection

- request status transition rules

No new product feature was added.

## Automated Tests

### 1. Business Rule Test

File:

`backend/src/requests/requests.service.spec.ts`

Rule tested:

A Closed request cannot be changed to In Progress.

Expected:

- the update is rejected

- no database save occurs

Result:

Passed.

Command:

```bash

npm test -- requests.service.spec.ts