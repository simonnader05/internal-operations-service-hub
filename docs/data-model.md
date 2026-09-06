# Data Model

## Internal Operations Service Hub

This document describes the information the Service Hub needs to keep, how the main records are related, the rules that control their lifecycle, and how each user group accesses the data.

## 1. Domain

### Employee

An employee is an internal user of the Service Hub. The employee record is mainly a reference to information managed by the company identity or HR system.

Main fields:

- Employee ID
- Full name
- Company email
- Manager
- Active status

An employee can submit many requests and may also act as an assigned agent or approver, depending on their role.

### Request

A request is the main record in the system. It represents an HR or IT need submitted by an employee, either directly or with help from the Service Hub Agent.

Main fields:

- Request ID
- Request number
- Requester
- Service area: HR or IT
- Request category
- Title
- Employee note
- Status
- Assigned team
- Assigned agent, when applicable
- Created date and time
- Last updated date and time
- Resolved date and time, when applicable
- Closed date and time, when applicable
- Resolution note

The request category determines which team receives the request and whether approval is required.

Some request types need additional information. For example:

- Leave request: leave type, start date, and end date
- Overtime request: date, number of hours, and justification
- IT access request: system name and requested access level

The exact category-specific fields will be confirmed when the final request types are agreed.

### Request Category

A request category defines the type of service requested.

Main fields:

- Category ID
- Category name
- Service area
- Default team
- Approval required
- Active status

Examples include Annual Leave, Medical Leave, Overtime, Payroll Inquiry, Hardware Issue, Software Installation, and Access Request.

### Team

A team represents the HR or IT group responsible for processing requests.

Main fields:

- Team ID
- Team name
- Service area
- Active status

One team can process many requests, while each request is assigned to one responsible team.

### Approval

An approval record is created only when a request requires a decision from an authorized manager or HR approver.

Main fields:

- Approval ID
- Request
- Approver
- Decision: Pending, Approved, or Rejected
- Approval comment or rejection reason
- Approval requested date
- Decision date

For the current scope, a request can have zero or one approval.

### Audit Entry

An audit entry records an important action performed on a request.

Main fields:

- Audit entry ID
- Request
- Action type
- Performed by
- Previous value, when relevant
- New value, when relevant
- Date and time

Examples include request creation, assignment changes, status changes, approval, rejection, resolution, and closure.

### Relationships

- One employee can submit many requests.
- Each request belongs to one employee.
- One category can be used by many requests.
- Each request has one category.
- One team can process many requests.
- Each request is assigned to one team.
- A request can have zero or one assigned agent at a time.
- A request can have zero or one approval in the current scope.
- One request can have many audit entries.

## 2. Lifecycle and Rules

The request lifecycle is:

`Pending -> In Progress -> Resolved -> Closed`

A request can also become `Rejected` when it cannot proceed or when an authorized approver rejects it.

The main rules are:

- Every request must have a requester, category, assigned team, and status.
- A new request starts as `Pending`.
- A request moves to `In Progress` when the responsible team begins working on it.
- A request can be approved or rejected only by the authorized approver.
- A rejected request must include an approval comment or rejection reason.
- A resolved request must include a resolution note.
- A resolved request becomes `Closed` when no further action is required.
- Closed requests should not normally be changed.
- Only authorized HR or IT users can process requests for their service area.
- Important status, assignment, approval, and resolution changes must be recorded in the audit history.

## 3. Storage

The Service Hub stores:

- Requests and their current status
- Request categories and routing information
- Team and assignment references
- Approval decisions and comments
- Resolution notes
- Audit history

The following information is calculated when needed rather than stored as a separate value:

- Number of open requests
- Requests by team, category, or status
- Requests waiting for approval
- Average resolution time

The company identity or HR system remains the source of truth for:

- Authentication and user roles
- Employee master information
- Leave and overtime balances
- Other official HR information

The Service Hub should retrieve this information when required instead of creating a second master copy.

## 4. Access

Employees need to find:

- Their own requests
- The current status of each request
- Request details and resolution information
- Available HR information, such as leave balance

HR users need to find:

- HR requests
- Requests assigned to their team or to them
- Requests by status
- Requests that require HR action

IT users need to find:

- IT requests
- Requests assigned to their team or to them
- Requests by status
- Open and unresolved requests

Approvers need to find:

- Requests waiting for their decision
- The information required to approve or reject the request

Administrators need to access:

- Categories
- Teams
- Routing rules
- Roles and permissions
- Audit history

The most common search and filtering fields are request number, requester, category, status, assigned team, assigned agent, and approver.
