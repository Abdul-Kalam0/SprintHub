# SprintHub Database Design

# Database Design Order

Users
↓
Workspaces
↓
Workspace Members
↓
Projects
↓
Tasks
↓
Comments
↓
Attachments
↓
Notifications
↓
Activity Logs

# Database Relationship

User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Workspace    Notification
 │
 ▼
WorkspaceMember
 │
 ▼
Project
 │
 ▼
Task
 ├──────────┬────────────┬─────────────┐
 ▼          ▼            ▼             ▼
Comment   Attachment   ActivityLog   Notification

# Core Entity Hierarchy

SprintHub
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
│
└── Authentication