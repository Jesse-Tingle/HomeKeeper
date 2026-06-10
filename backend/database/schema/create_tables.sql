-- Home Asset Tracker Database Schema
-- Initial table setup

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(255) NOT NULL,

  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'USA',

  type VARCHAR(100),

  created_by_user_id UUID NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_homes_created_by
    FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS home_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL,
  home_id UUID NOT NULL,

  role VARCHAR(50) NOT NULL DEFAULT 'member',

  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_home_memberships_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

  CONSTRAINT fk_home_memberships_home
    FOREIGN KEY (home_id)
    REFERENCES homes(id),

  CONSTRAINT unique_user_home_membership
    UNIQUE (user_id, home_id),

  CONSTRAINT check_home_membership_role
    CHECK (role IN ('owner', 'admin', 'member'))
);

-------------- Home Assets --------------

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  home_id UUID NOT NULL,

  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,

  manufacturer VARCHAR(255),
  model_number VARCHAR(255),
  serial_number VARCHAR(255),

  location VARCHAR(255),

  install_date DATE,
  warranty_expiration_date DATE,

  expected_lifespan_years INTEGER,

  purchase_cost DECIMAL(10,2),

  notes TEXT,

  created_by_user_id UUID NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_assets_home
    FOREIGN KEY (home_id)
    REFERENCES homes(id),

  CONSTRAINT fk_assets_created_by
    FOREIGN KEY (created_by_user_id)
    REFERENCES users(id)
);


------------ Maintenance Events ------------

CREATE TABLE IF NOT EXISTS maintenance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  asset_id UUID NOT NULL,

  event_type VARCHAR(50) NOT NULL,

  event_date DATE NOT NULL,

  cost DECIMAL(10,2),

  notes TEXT,

  created_by_user_id UUID NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_maintenance_events_asset
    FOREIGN KEY (asset_id)
    REFERENCES assets(id),

  CONSTRAINT fk_maintenance_events_created_by
    FOREIGN KEY (created_by_user_id)
    REFERENCES users(id),

  CONSTRAINT check_event_type
    CHECK (
      event_type IN (
        'inspection',
        'service',
        'repair',
        'replacement'
      )
    )
);