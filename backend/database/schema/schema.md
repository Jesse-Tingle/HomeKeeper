# Home Asset Tracker - Database Schema

## Overview

The Home Asset Tracker application allows homeowners to manage one or more properties, track home assets, maintain service histories, and collaborate with other household members.

The application supports:

* Multiple users
* Multiple homes per user
* Multiple users per home
* Asset tracking
* Maintenance history
* Role-based permissions
* Warranty and equipment information

---

# Design Decisions

## Primary Keys

All tables use UUIDs as primary keys.

Reasons:

* Better security than incremental IDs
* Prevents ID enumeration
* Easier future scalability
* Common API best practice

---

## User Access Model

Users do not directly own homes.

Users gain access to homes through the `home_memberships` table.

This supports:

* Married couples
* Multiple adults living in the same home
* Shared vacation properties
* Users owning multiple homes

---

## Asset Ownership Model

Assets belong to homes.

Assets do not belong directly to users.

Example:

```text
Main Home
└── HVAC System
```

The HVAC system belongs to the home, not to an individual user.

---

## Home Address Model

Addresses are stored using structured fields rather than a single address field.

Benefits:

* Easier filtering
* Better reporting
* Future map integration
* Location-based features

---

## Deletion Strategy

### MVP

Use hard deletes.

Deleted records are permanently removed.

### Future Enhancement

Implement soft deletes using:

```text
deleted_at
```

for:

* homes
* assets
* maintenance_events

---

# Tables

---

# users

Stores application users.

| Field         | Type      | Required | Notes             |
| ------------- | --------- | -------- | ----------------- |
| id            | UUID      | Yes      | Primary Key       |
| name          | String    | Yes      | User display name |
| email         | String    | Yes      | Unique email      |
| password_hash | String    | Yes      | Hashed password   |
| created_at    | Timestamp | Yes      | Record creation   |
| updated_at    | Timestamp | Yes      | Last update       |

## Constraints

* email must be unique

---

# homes

Stores physical properties.

Examples:

* Primary Residence
* Vacation Home
* Cabin
* Lake House

| Field              | Type      | Required | Notes                          |
| ------------------ | --------- | -------- | ------------------------------ |
| id                 | UUID      | Yes      | Primary Key                    |
| name               | String    | Yes      | User-defined property name     |
| street_address     | String    | Yes      | Street address                 |
| city               | String    | Yes      | City                           |
| state              | String    | Yes      | State or Province              |
| postal_code        | String    | Yes      | ZIP or Postal Code             |
| country            | String    | Yes      | Default: USA                   |
| type               | String    | No       | Primary, Vacation, Cabin, etc. |
| created_by_user_id | UUID      | Yes      | FK → users.id                  |
| created_at         | Timestamp | Yes      | Record creation                |
| updated_at         | Timestamp | Yes      | Last update                    |

---

# home_memberships

Defines which users have access to which homes.

| Field      | Type      | Required | Notes                |
| ---------- | --------- | -------- | -------------------- |
| id         | UUID      | Yes      | Primary Key          |
| user_id    | UUID      | Yes      | FK → users.id        |
| home_id    | UUID      | Yes      | FK → homes.id        |
| role       | Enum      | Yes      | owner, admin, member |
| joined_at  | Timestamp | Yes      | Date joined          |
| created_at | Timestamp | Yes      | Record creation      |
| updated_at | Timestamp | Yes      | Last update          |

## Constraints

A user may only have one membership per home.

Unique combination:

```text
(user_id, home_id)
```

---

# assets

Stores physical systems, structures, appliances, and equipment associated with a home.

Examples:

* Roof
* HVAC
* Water Heater
* Refrigerator
* Generator
* Septic System
* Sump Pump
* Dishwasher

| Field                    | Type      | Required | Notes                                    |
| ------------------------ | --------- | -------- | ---------------------------------------- |
| id                       | UUID      | Yes      | Primary Key                              |
| home_id                  | UUID      | Yes      | FK → homes.id                            |
| name                     | String    | Yes      | Asset name                               |
| category                 | String    | Yes      | HVAC, Appliance, Plumbing, Roofing, etc. |
| manufacturer             | String    | No       | Manufacturer name                        |
| model_number             | String    | No       | Manufacturer model number                |
| serial_number            | String    | No       | Manufacturer serial number               |
| location                 | String    | No       | Basement, Garage, Kitchen, Attic, etc.   |
| install_date             | Date      | No       | Installation date                        |
| warranty_expiration_date | Date      | No       | Warranty expiration date                 |
| expected_lifespan_years  | Integer   | No       | Expected useful life                     |
| purchase_cost            | Decimal   | No       | Original purchase price                  |
| notes                    | Text      | No       | Additional notes                         |
| created_by_user_id       | UUID      | Yes      | FK → users.id                            |
| created_at               | Timestamp | Yes      | Record creation                          |
| updated_at               | Timestamp | Yes      | Last update                              |

---

# maintenance_events

Stores maintenance history for assets.

Examples:

* Inspection
* Service
* Repair
* Replacement

| Field              | Type      | Required | Notes                                    |
| ------------------ | --------- | -------- | ---------------------------------------- |
| id                 | UUID      | Yes      | Primary Key                              |
| asset_id           | UUID      | Yes      | FK → assets.id                           |
| date               | Date      | Yes      | Event date                               |
| type               | Enum      | Yes      | inspection, service, repair, replacement |
| cost               | Decimal   | No       | Maintenance cost                         |
| notes              | Text      | No       | Event notes                              |
| created_by_user_id | UUID      | Yes      | FK → users.id                            |
| created_at         | Timestamp | Yes      | Record creation                          |
| updated_at         | Timestamp | Yes      | Last update                              |

---

# Future Tables

The following tables are planned for future releases and are not part of the MVP.

---

# documents

Stores files associated with assets.

Examples:

* Receipts
* Manuals
* Warranty Documents
* Inspection Reports
* Installation Photos

| Field               | Type      |
| ------------------- | --------- |
| id                  | UUID      |
| asset_id            | UUID      |
| uploaded_by_user_id | UUID      |
| file_url            | String    |
| type                | String    |
| created_at          | Timestamp |

---

# Relationship Summary

## Users ↔ Homes

Relationship Type:

Many-to-Many

Implemented Through:

```text
home_memberships
```

---

## Homes → Assets

Relationship Type:

One-to-Many

One home may contain many assets.

Each asset belongs to exactly one home.

---

## Assets → Maintenance Events

Relationship Type:

One-to-Many

One asset may contain many maintenance records.

Each maintenance record belongs to exactly one asset.

---

# Permission Roles

## Owner

Can:

* View home
* Edit home
* Delete home
* Add members
* Remove members
* Promote members
* Manage assets
* Manage maintenance events

---

## Admin

Can:

* View home
* Edit home
* Manage assets
* Manage maintenance events
* Invite members

Cannot:

* Delete home
* Remove owners

---

## Member

Can:

* View home
* View assets
* Create maintenance events

Cannot:

* Manage members
* Delete assets
* Delete home

---

# MVP Scope

Tables included in MVP:

* users
* homes
* home_memberships
* assets
* maintenance_events

Future versions may include:

* documents
* notifications
* invitations
* service providers
* dashboards
* reporting and analytics
* warranty reminders
* maintenance scheduling
* recurring maintenance tasks
* asset replacement forecasting

```
```
