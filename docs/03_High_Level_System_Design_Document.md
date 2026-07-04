## High-Level Architecture

```mermaid
flowchart TB

    User((User))

    Browser["Web Browser"]

    React["React Frontend"]

    Router["React Router"]

    Axios["Axios API Client"]

    Express["Express Server"]

    Middleware["Authentication & Validation Middleware"]

    Controller["Controller Layer"]

    Service["Service Layer"]

    Mongo["MongoDB Atlas"]

    Cloudinary["Cloudinary"]

    User --> Browser

    Browser --> React

    React --> Router

    Router --> Axios

    Axios --> Express

    Express --> Middleware

    Middleware --> Controller

    Controller --> Service

    Service --> Mongo

    Service --> Cloudinary
```

# sequenceDiagram

User->>React: Click Create Task

React->>Express: POST /tasks

Express->>Middleware: Authenticate

Middleware->>Controller: Valid Request

Controller->>Service: createTask()

Service->>Model: Save Task

Model->>MongoDB: Insert

MongoDB-->>Model: Success

Model-->>Service

Service-->>Controller

Controller-->>React

React-->>User: Success Toast

# Final Backend Architecture
Express
│
Authentication
│
Middleware
│
Routes
│
Controllers
│
Services
│
Models
│
MongoDB Atlas

# SprintHub Roadmap

Project Proposal ✅

↓

Project Charter ✅

↓

SRS ✅

↓

System Design (High-Level) ✅

↓

Database Design ← NEXT

↓

API Design

↓

Backend Folder Structure

↓

Implementation

