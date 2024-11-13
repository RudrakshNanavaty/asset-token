CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Users Table
CREATE TABLE users (
    id UUID default gen_random_uuid() PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

-- Create Assets Table
CREATE TABLE assets (
    id UUID default gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES users(id),
    details TEXT
);

-- Create Asset History Table
CREATE TABLE asset_history (
    id UUID default gen_random_uuid(),
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
