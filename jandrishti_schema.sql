-- JanDrishti Database Schema (MySQL 8+)
-- Database: jandrishti

CREATE DATABASE IF NOT EXISTS jandrishti;
USE jandrishti;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    preferred_language VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_code VARCHAR(255) NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    original_text TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    description TEXT,
    ward VARCHAR(255),
    district VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    urgency INT,
    status VARCHAR(50) NOT NULL,
    ai_confidence DOUBLE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report_ai_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    detected_category VARCHAR(255),
    detected_subcategory VARCHAR(255),
    detected_language VARCHAR(50),
    summary TEXT,
    urgency INT,
    confidence DOUBLE,
    extracted_entities TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS demand_clusters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    ward VARCHAR(255),
    district VARCHAR(255),
    report_count INT DEFAULT 0,
    growth_rate DOUBLE,
    service_gap_score DOUBLE,
    population_impact_score DOUBLE,
    urgency_score DOUBLE,
    demand_score DOUBLE,
    priority_score DOUBLE,
    summary TEXT,
    recommended_actions TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS cluster_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cluster_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    FOREIGN KEY (cluster_id) REFERENCES demand_clusters(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS officer_decisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cluster_id BIGINT NOT NULL,
    officer_id BIGINT NOT NULL,
    decision VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (cluster_id) REFERENCES demand_clusters(id) ON DELETE CASCADE,
    FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_id BIGINT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id VARCHAR(255),
    metadata TEXT,
    ip_address VARCHAR(255),
    created_at DATETIME NOT NULL
);
