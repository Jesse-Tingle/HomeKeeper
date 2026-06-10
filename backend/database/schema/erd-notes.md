# Home Asset Tracker - Entity Relationship Diagram (ERD)

## Overview

This application allows multiple users to collaborate on managing one or more homes. Each home can contain multiple assets (HVAC systems, roofs, appliances, etc.), and each asset can have a history of maintenance events.

---

## Entities

### Users

Represents an individual with access to the application.

| Field         | Type      | Notes                |
| ------------- | --------- | -------------------- |
| id            | UUID      | Primary Key          |
| name          | String    | User's display name  |
| email         | String    | Unique email address |
| password_hash | String    | Hashed password      |
| created_at    | Timestamp | Record creation date |
| updated_at    | Timestamp | Last update date     |

---

### Homes

Represents a physical property.

Examples:

* Primary Residence
* Vacation Home
* Cabin
* Lake House

| Field              | Type      | Notes                          |
| ------------------ | --------- | ------------------------------ |
| id                 | UUID      | Primary Key                    |
| name               | String    | User-defined home name         |
| address            | String    | Property address               |
| type               | String    | Primary, Vacation, Cabin, etc. |
| created_by_user_id | UUID      | FK → Users.id                  |
| created_at         | Timestamp | Record creation date           |
| updated_at         | Timestamp | Last update date               |

---

### Home Memberships

Connects users to homes and controls permissions.

| Field     | Type      | Notes                |
| --------- | --------- | -------------------- |
| id        | UUID      | Primary Key          |
| user_id   | UUID      | FK → Users.id        |
| home_id   | UUID      | FK → Homes.id        |
| role      | Enum      | owner, admin, member |
| joined_at | Timestamp | Date joined          |

---

### Assets

Represents physical systems, structures, or equipment within a home.

Examples:

* Roof
* HVAC
* Water Heater
* Refrigerator
* Generator
* Septic System

| Field                    | Type      | Notes                                       |
| ------------------------ | --------- | ------------------------------------------- |
| id                       | UUID      | Primary Key                                 |
| home_id                  | UUID      | FK → Homes.id                               |
| name                     | String    | Asset name                                  |
| category                 | String    | HVAC, Appliance, Plumbing, Electrical, etc. |
| manufacturer             | String    | Manufacturer name                           |
| model_number             | String    | Manufacturer model number                   |
| serial_number            | String    | Manufacturer serial number                  |
| install_date             | Date      | Installation date                           |
| warranty_expiration_date | Date      | Warranty expiration date                    |
| expected_lifespan_years  | Integer   | Expected lifespan                           |
| purchase_cost            | Decimal   | Original cost                               |
| notes                    | Text      | Additional notes                            |
| created_by_user_id       | UUID      | FK → Users.id                               |
| created_at               | Timestamp | Record creation date                        |
| updated_at               | Timestamp | Last update date                            |

---

### Maintenance Events

Represents maintenance history for an asset.

Examples:

* Inspection
* Service
* Repair
* Replacement

| Field              | Type      | Notes                                    |
| ------------------ | --------- | ---------------------------------------- |
| id                 | UUID      | Primary Key                              |
| asset_id           | UUID      | FK → Assets.id                           |
| date               | Date      | Event date                               |
| type               | Enum      | inspection, service, repair, replacement |
| cost               | Decimal   | Maintenance cost                         |
| notes              | Text      | Event notes                              |
| created_by_user_id | UUID      | FK → Users.id                            |
| created_at         | Timestamp | Record creation date                     |

---

## Relationships

### Users ↔ Homes

Relationship Type:

Many-to-Many

Implemented Through:

Home Memberships

Examples:

* One user can belong to multiple homes.
* One home can have multiple users.

```
Users
  |
  | 1:M
  |
Home Memberships
  |
  | M:1
  |
Homes
```

---

### Homes → Assets

Relationship Type:

One-to-Many

Examples:

* One home contains many assets.
* An asset belongs to exactly one home.

```
Home
  |
  | 1:M
  |
Assets
```

---

### Assets → Maintenance Events

Relationship Type:

One-to-Many

Examples:

* One asset can have many maintenance records.
* A maintenance record belongs to exactly one asset.

```
Asset
  |
  | 1:M
  |
Maintenance Events
```

---

## High-Level Diagram

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
       │
       ▼
┌────────────────────┐
│ Home Memberships   │
└──────┬─────────────┘
       │
       │
       ▼
┌──────────────┐
│    Homes     │
└──────┬───────┘
       │
       │
       ▼
┌──────────────┐
│    Assets    │
└──────┬───────┘
       │
       │
       ▼
┌────────────────────┐
│ Maintenance Events │
└────────────────────┘
```

---

## Permission Roles

### Owner

Can:

* Edit home
* Delete home
* Add/remove members
* Manage assets
* Manage maintenance events

### Admin

Can:

* Manage assets
* Manage maintenance events
* Invite members

Cannot:

* Delete home
* Remove owners

### Member

Can:

* View home
* View assets
* Add maintenance events

Cannot:

* Delete assets
* Manage members
* Delete home

```
```
