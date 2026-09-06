# Product Specification

## Internal Operations Service Hub

### 1. Problem / Context

Employees currently contact HR and IT through different channels such as email, Teams, phone calls, or direct messages.

This can lead to missed requests, delays, duplicate work, and difficulty tracking progress.

The Internal Operations Service Hub will provide one central place where employees can ask for help, submit HR or IT requests, and track their progress.


## 2. Known Facts

- The first version focuses on HR and IT services.
- Requests must be routed to the correct team.
- Employees must be able to track their requests.
- Some requests may require approval.
- Sensitive information must only be visible to authorized users.
- Important request and approval actions must be recorded.

## 3. Actors / Stakeholders

### Employee

The employee uses the hub to:

- Ask HR or IT questions.
- Submit HR or IT requests.
- Track request status.
- Provide additional information when needed.
- View available HR information such as leave balances.

### Service Hub Agent

A single agent acts as the main entry point for both HR and IT.

The agent can:

- Answer common HR and IT questions.
- Help the employee choose the correct request type.
- Show available information when the employee has permission to view it.
- Help create a request.
- Route the request to HR or IT.
- Show the current request status.

The agent does not make final approval decisions.

### HR Team

The HR team can:

- Process HR requests.
- Request additional information.
- Update request status.
- Provide HR-related information.
- Escalate requests that need approval.

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


## 4. Functional Requirements

### HR Services

The system should support HR requests such as:

- Annual Leave.
- PTO.
- Sick / Medical Leave.
- Overtime.
- Payroll Inquiry.
- Employment Certificate.

Each request type may require different information.

Examples:

- Leave: leave type, start date, end date, reason.
- Overtime: date, hours, justification.
- Payroll: payroll period and issue description.

Where available, employees should be able to view balances such as remaining leave days or overtime hours.

### IT Services

The system should support IT requests such as:

- Hardware Issue.
- Software Issue.
- Software Installation.
- Access Request.
- Password / Account Issue.
- Email Issue.

The required information may change depending on the request type.

### Request Management

The system must:

- Create a unique request number.
- Route the request to HR or IT.
- Allow the responsible team to assign and update it.
- Allow employees to track its status.
- Support comments and requests for additional information.
- Send requests requiring approval to the correct approver.
- Record important actions in an audit log.

Example statuses:

- Pending
- In Progress
- Resolved
- Rejected
- Closed


## 5. Non-Functional Requirements

- Role-based access control must protect sensitive information.
- The system should be simple and easy to use.
- Important changes and approval decisions must be traceable.
- The system should provide reasonable response times.
- Submitted requests and updates must be stored reliably.


## 6. Assumptions / Constraints / Unknowns

### Assumptions

- Users access the system through the company identity system.
- HR and IT teams only access requests relevant to their responsibilities.
- Final approval decisions are made by authorized managers or HR staff.

### Constraints

- The solution is for internal company use.
- Access must follow company security rules.

### Unknowns

- Final HR and IT request categories.
- Exact required fields for each request type.
- Final status list.
- Which requests require approval and who approves them.
- How leave and overtime balances are calculated or retrieved.
- Whether notifications, attachments, priorities, or SLA rules are required.


## 7. Non-Goals

The first version will not include:

- External customer support.
- Payroll processing.
- AI making final HR or management decisions.
- Automatic approval decisions.
- Advanced analytics.
- A separate mobile application.


## 8. Acceptance Criteria

### Submit and Route a Request

**Given** an employee submits a valid HR or IT request,  
**when** the request is created,  
**then** it receives a unique number and is routed to the correct team.

### Track a Request

**Given** an employee has submitted a request,  
**when** they view it,  
**then** they can see its current status and relevant updates.

### Secure Access

**Given** a user tries to access a request,  
**when** they do not have permission,  
**then** access must be denied.

### Approval

**Given** a request requires approval,  
**when** an authorized approver approves or rejects it,  
**then** the decision must be saved and recorded.

### HR Information

**Given** an employee requests available HR information such as leave balance,  
**when** the information is available and the employee is authorized to view it,  
**then** the system should provide it.
