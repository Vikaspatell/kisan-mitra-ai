-- Kisan Mitra AI - PostgreSQL Database Schema
-- Run this script to initialize or migrate the database: psql -U postgres -d kisan_mitra -f schema.sql

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (Farmer Profile & Authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(150),
    land_size NUMERIC(6, 2) DEFAULT 1.0,
    crops JSONB DEFAULT '[]'::jsonb,
    preferred_language VARCHAR(10) DEFAULT 'en', -- 'en', 'hi', 'te'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_state_district ON users(state, district);

-- Table: chat_messages (AI Copilot Chat History per User)
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_user_created ON chat_messages(user_id, created_at ASC);

-- Table: notifications (Weather, Market & Scheme Alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('weather', 'market', 'scheme', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'urgent', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);

-- Table: mandi_prices (Agmarknet Mandi Prices)
CREATE TABLE IF NOT EXISTS mandi_prices (
    id VARCHAR(64) PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market VARCHAR(150) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    variety VARCHAR(100) DEFAULT 'Standard',
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) DEFAULT '₹/Quintal',
    arrival_date VARCHAR(50) NOT NULL,
    source VARCHAR(255) DEFAULT 'Agmarknet / Directorate of Marketing & Inspection, GoI',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON mandi_prices(commodity);
CREATE INDEX IF NOT EXISTS idx_mandi_state_district ON mandi_prices(state, district);

-- Table: government_schemes
CREATE TABLE IF NOT EXISTS government_schemes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_te VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('central', 'state')),
    state VARCHAR(100),
    department VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    summary_hi TEXT,
    summary_te TEXT,
    benefits TEXT NOT NULL,
    benefits_hi TEXT,
    benefits_te TEXT,
    eligibility JSONB NOT NULL,
    required_documents JSONB NOT NULL,
    application_steps JSONB NOT NULL,
    official_portal_url VARCHAR(500) NOT NULL,
    source VARCHAR(255) NOT NULL,
    last_updated VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schemes_category_state ON government_schemes(category, state);
