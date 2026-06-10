-- ==========================================
-- DEVELOPMENT SEED DATA
-- Home Maintenance Tracker
-- ==========================================

-- USERS

INSERT INTO users (
id,
name,
email,
password_hash
)
VALUES
(
'11111111-1111-1111-1111-111111111111',
'Jesse Tingle',
'[jesse@example.com](mailto:jesse@example.com)',
'seed-password-hash'
),
(
'22222222-2222-2222-2222-222222222222',
'Sarah Smith',
'[sarah@example.com](mailto:sarah@example.com)',
'seed-password-hash'
),
(
'33333333-3333-3333-3333-333333333333',
'Mike Johnson',
'mike@example.com',
'seed-password-hash'
);

-- HOMES

INSERT INTO homes (
id,
name,
street_address,
city,
state,
postal_code,
country,
type,
created_by_user_id
)
VALUES
(
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Main Home',
'123 Main St',
'Peru',
'IN',
'46970',
'USA',
'Primary',
'11111111-1111-1111-1111-111111111111'
),
(
'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'Lake House',
'456 Lake Dr',
'Monticello',
'IN',
'47960',
'USA',
'Vacation',
'11111111-1111-1111-1111-111111111111'
);

-- HOME MEMBERSHIPS

INSERT INTO home_memberships (
user_id,
home_id,
role
)
VALUES
(
'11111111-1111-1111-1111-111111111111',
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'owner'
),
(
'22222222-2222-2222-2222-222222222222',
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'owner'
),
(
'11111111-1111-1111-1111-111111111111',
'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'owner'
),
(
'33333333-3333-3333-3333-333333333333',
'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'member'
);

-- ASSETS

INSERT INTO assets (
id,
home_id,
name,
category,
manufacturer,
model_number,
serial_number,
location,
install_date,
warranty_expiration_date,
expected_lifespan_years,
purchase_cost,
created_by_user_id
)
VALUES
(
'aaaaaaaa-1111-1111-1111-111111111111',
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'HVAC System',
'HVAC',
'Carrier',
'24ABC648A003',
'HVAC12345',
'Basement',
'2023-06-01',
'2033-06-01',
15,
6500.00,
'11111111-1111-1111-1111-111111111111'
),
(
'bbbbbbbb-1111-1111-1111-111111111111',
'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Water Heater',
'Plumbing',
'Rheem',
'XG50T09HE40U0',
'WH12345',
'Utility Room',
'2022-05-15',
'2028-05-15',
10,
1200.00,
'11111111-1111-1111-1111-111111111111'
),
(
'cccccccc-1111-1111-1111-111111111111',
'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'Generator',
'Electrical',
'Generac',
'7228',
'GEN12345',
'Outside',
'2021-08-10',
'2026-08-10',
20,
4500.00,
'11111111-1111-1111-1111-111111111111'
);

-- MAINTENANCE EVENTS

INSERT INTO maintenance_events (
asset_id,
event_type,
event_date,
cost,
notes,
created_by_user_id
)
VALUES
(
'aaaaaaaa-1111-1111-1111-111111111111',
'inspection',
'2025-03-01',
125.00,
'Annual HVAC inspection completed.',
'11111111-1111-1111-1111-111111111111'
),
(
'bbbbbbbb-1111-1111-1111-111111111111',
'service',
'2025-01-15',
75.00,
'Water heater flushed.',
'11111111-1111-1111-1111-111111111111'
),
(
'cccccccc-1111-1111-1111-111111111111',
'service',
'2025-04-10',
95.00,
'Generator oil change.',
'11111111-1111-1111-1111-111111111111'
);
