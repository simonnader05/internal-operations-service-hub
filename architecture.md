# Architecture Draft

## Internal Operations Service Hub

### 1. Purpose and Scope

The Internal Operations Service Hub provides one central place for employees to submit and track HR and IT requests.

The architecture must support:

- HR and IT request submission.
- Request routing to the correct team.
- Request assignment and status tracking.
- Approval for requests that require it.
- HR information such as leave balance, when available.
- Secure access to sensitive information.
- Audit tracking for important actions.

---

## 2. System Boundary

### Inside the Service Hub

The system is responsible for:

- Receiving employee questions and requests.
- Identifying whether a request belongs to HR or IT.
- Creating and tracking requests.
- Routing requests to the correct team.
- Supporting comments and additional information.
- Sending requests for approval when required.
- Showing request status to the employee.
- Recording important changes and decisions.

### Outside the Service Hub

The system may depend on external company services such as:

- Company identity / Single Sign-On.
- Existing HR system for leave balances or employee information.
- Email  for notifications.
- Other internal systems needed to complete specific requests.

---

## 3. Actors and Responsibilities

### Employee

The employee can:

- Submit HR or IT requests.
- Track request status.
- Add information when requested.
- View available HR information such as leave balance.

### Service Hub Agent

A single Service Hub Agent acts as the main entry point.

The agent can:

- Answer common HR and IT questions.
- Help identify the correct request type.
- Show available information when the user is authorized.
- Help create a request.
- Route the request to HR or IT.
- Show request status.

The agent does not make final approval decisions.

### HR Team

The HR team can:

- Process HR requests.
- Provide HR information.
- Update request status.
- Escalate requests that require approval.

### IT Team

The IT team can:

- Process IT requests.
- Assign requests.
- Request additional information.
- Update request status.
- Resolve IT issues.

### Manager / Approver

The authorized approver can:

- Review requests that require approval.
- Approve or reject them.
- Add approval comments or rejection reasons.

### Administrator

The administrator manages:

- Request categories.
- Statuses.
- Roles and permissions.
- Routing rules.

---

## 4. Main Components

### Service Hub Interface

Provides the employee entry point for:

- Asking questions.
- Submitting requests.
- Viewing request status.
- Providing additional information.

### Service Hub Agent

Interprets the employee request and decides whether to:

- Answer directly.
- Show available information.
- Create a request.
- Route the request to HR or IT.

### Request Management

Responsible for:

- Creating the request.
- Generating a unique request number.
- Storing the request type and status.
- Managing assignment, comments, and updates.
- Tracking the request until completion.

### Routing

Determines which team should receive the request based on the service area and request category.

Examples:

- HR request -> HR Team.
- IT request -> IT Team.

### Approval Handling

Used only when a request requires approval.

It ensures that:

- The request is sent to the correct approver.
- Only authorized users can approve or reject.
- The decision is recorded.

### Audit Log

Records important actions such as:

- Request creation.
- Status changes.
- Assignment changes.
- Approval or rejection.
- Resolution.
- Important permission changes.

---

## 5. Request Flow

A normal request follows this flow:

1. The employee enters the Service Hub.
2. The Service Hub Agent identifies the request type.
3. If the question can be answered directly, the agent provides the information.
4. If a request is required, the system creates it.
5. The request is routed to HR or IT.
6. The responsible team processes the request.
7. If approval is required, the request is sent to the authorized approver.
8. The request status is updated during processing.
9. The employee can track the status.
10. The request is resolved and then closed when no further action is needed.

Example statuses:

- Pending
- In Progress
- Resolved
- Rejected
- Closed

---

## 6. External Dependencies

The Service Hub may depend on:

### Company Identity System

Used to authenticate users and identify their roles and permissions.

### HR System

May provide information such as:

- Leave balance.
- Employee information.
- HR-related data needed for requests.

### Notification Service

Email  may be used to notify users about:

- Request updates.
- Approval requests.
- Resolution.

The exact integrations are still to be confirmed.

---

## 7. Trust and Authorization Boundaries

The system must enforce role-based access.

Examples:

- Employees can only see requests they are authorized to view.
- HR users can access HR requests according to their permissions.
- IT users can access IT requests according to their permissions.
- Sensitive HR information must be restricted.
- Only authorized approvers can approve or reject requests.
- Important actions must be traceable.

The Service Hub Agent must respect the same permissions and must not expose information the employee is not allowed to see.

---

## 8. Failure Scenarios and Resilience

### External HR System Unavailable

If leave balance or HR information cannot be retrieved, the system should show that the information is temporarily unavailable instead of displaying incorrect data.


### Approval Failure

If an approval notification fails, the request should remain stored as pending approval and should not be lost.

### Notification Failure

If email notification fails, the request itself should still remain available in the Service Hub.

### Unauthorized Access

If a user attempts to access restricted information, the system must deny access and record the action when appropriate.

---

## 9. Architecture Decisions

### One Service Hub Agent

Decision: Use one Service Hub Agent for both HR and IT.

Reason: Employees have one simple entry point. The agent identifies the request type and routes it to the correct team.

### Separate Processing and Approval

Decision: Processing a request is separate from approving it.

Reason: HR or IT teams can work on requests, but only authorized approvers should make approval decisions.

### External Systems Keep Ownership of Their Data

Decision: The Service Hub reads information such as leave balance from the responsible external system when required.

Reason: The Service Hub should not duplicate or become the owner of data already managed by another company system.

### Audit Important Actions

Decision:Important request and approval actions are recorded.

Reason: HR and IT requests may involve sensitive information and business decisions that require traceability.

---

## Summary

The architecture uses one Service Hub Agent as the employee entry point, a request management process to create and track requests, routing to HR or IT, approval handling when required, secure role-based access, and audit logging.

