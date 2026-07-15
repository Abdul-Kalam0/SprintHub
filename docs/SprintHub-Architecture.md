# SprintHub Architecture & Development Guide

> **Version:** 1.0
> **Purpose:** This document defines the architecture, coding standards, REST conventions, and development workflow for the SprintHub backend. Every new module and API must follow these standards.

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- HTTP-only Cookies
- bcrypt
- MVC + Service Layer Architecture

---

# Project Hierarchy

```
SprintHub
│
├── Authentication
│
├── Users
│
├── Workspaces
│     │
│     ├── Members
│     │
│     └── Projects
│             │
│             └── Tasks
│                     │
│                     ├── Comments
│                     ├── Attachments
│                     ├── Activity Logs
│                     └── Notifications
```

This hierarchy is locked and should not change unless intentionally redesigned.

---

# Folder Structure

```
src
│
├── config
│
├── controllers
│
├── middlewares
│
├── models
│
├── routes
│
├── services
│
├── utils
│
├── app.js
└── server.js
```

---

# Backend Architecture

Every request follows this flow:

```
Client
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Model
   │
   ▼
MongoDB
```

---

# Responsibilities

## Routes

- Define API endpoints.
- Attach middleware.
- Call controllers.
- Never contain business logic.

---

## Middleware

Responsibilities include:

- Authentication
- Authorization
- Validation
- Error handling

Middleware may:

- Read request
- Modify request
- Throw errors
- Call next()

Middleware should not send business responses.

---

## Controllers

Controllers should:

- Receive request
- Call service
- Return response
- Pass errors to next()

Controllers should never contain business logic.

---

## Services

Services contain all business logic.

Responsibilities:

- Validation
- Database operations
- Authorization checks
- Business rules

Services never send responses.

They either:

- return data
- or throw errors

---

## Models

Models define:

- Schema
- Relationships
- Indexes
- Hooks

No business logic.

---

# REST API Convention (Locked)

Always use nested resources.

Examples:

```
/api/workspaces
/api/workspaces/:workspaceId

/api/workspaces/:workspaceId/members
/api/workspaces/:workspaceId/members/:memberId

/api/workspaces/:workspaceId/projects
/api/workspaces/:workspaceId/projects/:projectId

/api/projects/:projectId/tasks
/api/projects/:projectId/tasks/:taskId

/api/tasks/:taskId/comments
/api/tasks/:taskId/comments/:commentId

/api/tasks/:taskId/attachments
/api/tasks/:taskId/attachments/:attachmentId
```

Never use ambiguous routes such as:

```
/api/:id/members
/api/:id/projects
```

Every URL should clearly describe the resource hierarchy.

---

# API Development Workflow (Locked)

Before writing any controller or service, follow this process.

## Step 1

Identify the endpoint.

Example:

```
PATCH /api/workspaces/:workspaceId/members/:memberId
```

---

## Step 2

Identify every collection involved.

Example:

```
Workspace

WorkspaceMember
```

---

## Step 3

Determine which resources must be validated.

Ask:

- Does it exist?
- Is it being created?
- Is it being updated?
- Is it being deleted?

---

## Step 4

Separate trusted and untrusted data.

Trusted:

```
req.user
```

Untrusted:

```
req.body
req.params
req.query
```

Validate all untrusted input before use.

---

## Step 5

Write the business flow.

Example:

```
Validate Input

↓

Workspace Exists?

↓

Member Exists?

↓

Business Rules

↓

Database Operation

↓

Return Result
```

---

## Step 6

Write the service.

---

## Step 7

Write the controller.

---

# Validation Principle

Only validate collections involved in the current business operation.

Example:

### Create Workspace

Collections involved:

```
Workspace
```

Authenticated user already exists.

No need to query User again.

---

### Add Member

Collections involved:

```
Workspace

User

WorkspaceMember
```

Validate all three.

---

### Update Member

Collections involved:

```
Workspace

WorkspaceMember
```

User validation is unnecessary.

---

# Authentication Principle

Authentication middleware guarantees:

```
req.user
```

is a valid authenticated user.

Never query User again unless the business operation specifically requires another user.

---

# Naming Convention

Use descriptive variable names.

Examples:

```
existingWorkspace

existingMember

existingProject

existingTask

duplicateMember

createdWorkspace

updatedTask

deletedProject
```

Avoid generic names like:

```
data

result

obj

temp
```

---

# Service Pattern

Every service should follow this structure.

```
Validate Input

↓

Validate Resources

↓

Business Rules

↓

Database Operation

↓

Return Result
```

---

# Controller Pattern

Every controller follows:

```
try

↓

service()

↓

res.status().json()

↓

catch

↓

next(error)
```

---

# Error Handling

Services throw errors.

Controllers catch them.

Global Error Middleware returns the response.

---

# Status Codes

```
200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error
```

---

# Database Relationships

```
User

↓

Workspace

↓

WorkspaceMember

↓

Project

↓

Task

↓

Comment

↓

Attachment

↓

ActivityLog

↓

Notification
```

---

# Database Rules

Workspace creation:

```
Create Workspace

↓

Automatically create WorkspaceMember

↓

Role = owner
```

Workspace deletion:

```
Delete Workspace

↓

Delete all Workspace Members
```

No orphan documents should remain.

---

# Code Philosophy

Prefer:

- Readability over cleverness
- Explicit business logic
- One responsibility per function
- Consistent naming
- Clear architecture
- Easy-to-explain code

Avoid premature abstraction.

Follow the Rule of Three before extracting reusable helpers.

---

# Development Order

```
Authentication ✅

Users ✅

Workspaces ✅

Workspace Members ✅

Projects

Tasks

Comments

Attachments

Activity Logs

Notifications
```

---

# SprintHub Principles

- Business logic belongs in Services.
- Controllers remain thin.
- Middleware handles cross-cutting concerns.
- Models define the database.
- APIs follow RESTful nested resource conventions.
- Validate only the resources involved.
- Trust only authenticated data (`req.user`).
- Always design the flow before writing code.
- Consistency is more important than micro-optimizations.

# Module Development Convention (Locked)

Every new SprintHub module must follow the same design-first approach.

Never start by writing code.

Always complete the following steps first.

---

## Step 1: Understand the Business Requirement

Ask:

- What problem does this module solve?
- How does it fit into SprintHub?
- Which parent resource does it belong to?

Example:

```text
Workspace
    │
    └── Members
```

---

## Step 2: Identify the Collections

Before writing any API, list every MongoDB collection involved.

Example:

```text
Workspace

WorkspaceMember
```

---

## Step 3: Design the REST APIs

Write all routes first.

Example:

```text
POST    /api/workspaces/:workspaceId/members

GET     /api/workspaces/:workspaceId/members

PATCH   /api/workspaces/:workspaceId/members/:memberId

DELETE  /api/workspaces/:workspaceId/members/:memberId
```

Only after all APIs are finalized do we move to implementation.

---

## Step 4: Design the Database Schema

Before writing services:

- Fields
- Relationships
- References
- Indexes
- Enums
- Default values

Example:

```text
WorkspaceMember

workspace → Workspace

user → User

role → owner | admin | member
```

---

## Step 5: API Design Workflow

For every API, answer these questions first.

### A. Which collections are involved?

Example:

```text
Workspace

WorkspaceMember
```

---

### B. Which resources must exist?

Example:

```text
Workspace ✅

WorkspaceMember ✅
```

---

### C. Which resources are being created?

Example:

```text
WorkspaceMember
```

---

### D. Which resources are being updated?

Example:

```text
WorkspaceMember.role
```

---

### E. Which resources are being deleted?

Example:

```text
WorkspaceMember
```

---

### F. Which data is trusted?

Trusted:

```text
req.user
```

Already verified by the authentication middleware.

---

### G. Which data is untrusted?

Always validate:

```text
req.params

req.body

req.query
```

---

### H. What are the business rules?

Examples:

- Owner cannot remove themselves.
- Duplicate members are not allowed.
- Only workspace owners can add members.
- Workspace must exist before adding members.

Every API must define its business rules before coding.

---

## Step 6: Write the Business Flow

Write the logic in plain English.

Example:

```text
Validate Input

↓

Validate Workspace

↓

Validate Member

↓

Check Duplicate

↓

Create Member

↓

Return Member
```

No code yet.

---

## Step 7: Implement the Service

Only now write the service.

Every service follows:

```text
Validate Input

↓

Validate Resources

↓

Business Rules

↓

Database Operation

↓

Return Result
```

Services never send responses.

They only:

- return data
- or throw errors

---

## Step 8: Implement the Controller

Controllers always follow:

```text
Receive Request

↓

Call Service

↓

Return Response

↓

Pass Errors to next()
```

Controllers never contain business logic.

---

## Step 9: Test Every Endpoint

For every API, test:

- Success case
- Validation errors
- Unauthorized request
- Forbidden request
- Resource not found
- Duplicate/conflict
- Invalid ObjectId
- Edge cases

A module is considered complete only after all endpoints have been tested successfully.

---

# Module Completion Checklist

A SprintHub module is complete only when all of the following are done:

✅ Schema designed

✅ Routes finalized

✅ Controllers implemented

✅ Services implemented

✅ Authentication applied

✅ Authorization applied

✅ Business rules implemented

✅ Proper HTTP status codes used

✅ Error handling completed

✅ Database relationships maintained

✅ No orphan documents created

✅ Postman testing completed

Only after this checklist is complete do we move to the next module.

---

# Additional SprintHub Architecture (Locked)

## PATCH API Convention

Every PATCH API follows:

Validate Existing Resource
↓
Compute Final Values
↓
Validate Final State
↓
Business Rules
↓
Update Resource
↓
Return Updated Resource

Always validate the final state (e.g. `const finalName = name ?? existing.name`).

## Duplicate Validation

- Validate duplicates in the service.
- Protect against race conditions with MongoDB compound unique indexes.

Examples:

- Project → `(workspace, name)`
- Task → `(project, title)`

## Ownership Validation

Never authorize using `createdBy`.

Always validate through relationships:

Task → Project → Workspace → Owner

Comment → Task → Project → Workspace → Owner

## Date Validation

Convert to `Date` objects before comparing.

Validate only when all required dates exist.

## Hybrid Routing Convention

Parent resource operations:

- POST /api/workspaces/:workspaceId/members
- GET /api/workspaces/:workspaceId/members
- POST /api/workspaces/:workspaceId/projects
- GET /api/workspaces/:workspaceId/projects
- POST /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks

Existing resource operations:

- GET /api/workspaces/members/:memberId
- PATCH /api/workspaces/members/:memberId
- DELETE /api/workspaces/members/:memberId

- GET /api/workspaces/projects/:projectId
- PATCH /api/workspaces/projects/:projectId
- DELETE /api/workspaces/projects/:projectId

- GET /api/projects/tasks/:taskId
- PATCH /api/projects/tasks/:taskId
- DELETE /api/projects/tasks/:taskId

## Validation Order

Workspace
↓
Project
↓
Task
↓
Comment

## Task Business Rules

- Title required.
- Unique title within a project.
- Assigned user must be a workspace member.
- Task due date must remain within the project's duration (when project dates exist).

## Standard Response

Success:
{
"success": true,
"message": "...",
"data": {}
}

Failure:
{
"success": false,
"message": "..."
}

## API Development Checklist

1. Identify collections.
2. Identify resources to validate.
3. Separate trusted/untrusted input.
4. Define business rules.
5. Design validation flow.
6. Implement service.
7. Implement controller.
8. Test success, validation, authorization, duplicates, not-found and edge cases.

## SprintHub Principles

- Thin controllers.
- Business logic in services.
- Models define schema and indexes.
- Middleware handles cross-cutting concerns.
- Validate before database operations.
- Use compound indexes for uniqueness.
- Never trust client input.
- Keep architecture consistent.
